const express = require('express')
const router = express.Router()
const moment = require('moment')
const _ = require('lodash')
const config = require('../config.js')

const db = require('../db.js')
// const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 2) {
    return next()
  } else {
    return res.json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/crzb-list/:type/:parent_id', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 10,
        search = "",
        type = 0,
        parent_id = 0

      if (/^0$|^1$|^2$|^3$/.test(req.params.type)) {
        type = req.params.type
      }

      if (/^[0-9]*$/.test(req.params.parent_id)) {
        parent_id = req.params.parent_id
      }

      if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
        limit = req.query.limit
      }

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      if (req.query.search) {
        search = req.query.search
      }

      connection.query(
        `select count(*) as tot_rows from (
          select
            m.user_asn_id,
            m.full_name,
            get_crc_rd_code(crct_l.id) as crct_code,
            get_crc_with_p_name(crct_l.id) as crct_name
              
          from crc_list as crct_l
          left join assign_roles as asn_role
          on crct_l.id = asn_role.crc_id and asn_role.role_status=1
          left join members as m
          on asn_role.member_id = m.id
        
          where 
            crct_l.type=${type} and
            crct_l.parent_id=${parent_id} and 
            crct_l.active=1
        ) as all_data
        
        where 
          all_data.user_asn_id like '%${search}%' or
          all_data.full_name like '%${search}%' or
          all_data.crct_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crct_name collate utf8mb4_general_ci like '%${search}%'`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            if (result.length < 1) {
              connection.release()
              return res.json({
                data: [],
                tot_rows: 0
              })
            }
            let tot_rows = result[0].tot_rows
            let date = moment()
            let gen_start_month = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
              gen_end_month = date.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss')
            connection.query(
              `select * from (
                select
                  m.user_asn_id,
                  m.full_name,
                  crct_l.id as crct_id,
                  get_crc_rd_code(crct_l.id) as crct_code,
                  get_crc_with_p_name(crct_l.id) as crct_name,
                  get_crc_total_sale(crct_l.id) as total_sale,
                  get_crc_month_sale(crct_l.id, '${gen_start_month}', '${gen_end_month}') as monthly_sale,
                  get_crct_total_comm(crct_l.id) as total_comm,
                  get_crct_month_comm(crct_l.id, '${gen_start_month}', '${gen_end_month}') as monthly_comm
                    
                from crc_list as crct_l
                left join assign_roles as asn_role
                on crct_l.id = asn_role.crc_id and asn_role.role_status=1
                left join members as m
                on asn_role.member_id = m.id
              
                where 
                  crct_l.type=${type} and
                  crct_l.parent_id=${parent_id} and 
                  crct_l.active=1
              ) as all_data
              
              where 
                all_data.user_asn_id like '%${search}%' or
                all_data.full_name like '%${search}%' or
                all_data.crct_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crct_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.crct_id
              
              LIMIT ${limit}
              OFFSET ${offset}`,
              function (error, results) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.json({
                    data: results,
                    tot_rows
                  })
                }
              })
          }
        })
    }
  })
})

module.exports = router

function null_to_0(int) {
  return int ? parseInt(int) : 0
}