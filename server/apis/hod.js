const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 0) {
    return next()
  } else {
    return res.json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/sale-count/:hod_id', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let data = {
        total_sale: 0,
        yearly_sale: 0,
        monthly_sale: 0,
        type: null,
        name: null
      }
      let date = moment()
      let gen_start_year = date.clone().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        gen_end_year = date.clone().endOf('year').format('YYYY-MM-DD HH:mm:ss'),
        gen_start_month = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        gen_end_month = date.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss')

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `select 
              crzb_l.id as crzb_id,
              crzb_l.name as crzb_name,
              crzb_l.type as crzb_type,
              (
              select count(*) 
                  from assign_roles_trans as trans
                  join mem_link_crzb as mem_lk
                  on trans.linked_member_id=mem_lk.member_id
                  where trans.crzb_id=${req.params.hod_id} and trans.member_id=${req.decoded.data.user_id}
              ) as total_sale,
              (
              select count(*) 
                  from assign_roles_trans as trans
                  join mem_link_crzb as mem_lk
                  on trans.linked_member_id=mem_lk.member_id and (mem_lk.linked_at >= '${gen_start_year}' and mem_lk.linked_at <= '${gen_end_year}')
                  where trans.crzb_id=${req.params.hod_id} and trans.member_id=${req.decoded.data.user_id}
              ) as yearly_sale,
              (
              select count(*) 
                  from assign_roles_trans as trans
                  join mem_link_crzb as mem_lk
                  on trans.linked_member_id=mem_lk.member_id and (mem_lk.linked_at >= '${gen_start_month}' and mem_lk.linked_at <= '${gen_end_month}')
                  where trans.crzb_id=${req.params.hod_id} and trans.member_id=${req.decoded.data.user_id}
              ) as monthly_sale
          from assign_roles as asn_role
          left join crzb_list as crzb_l 
          on asn_role.crzb_id=crzb_l.id
          where asn_role.crzb_id=${req.params.hod_id} and asn_role.member_id=${req.decoded.data.user_id}`,
          function (error, result) {
            if (error) {
              err_hdl(error);
            } else {
              data['total_sale'] = result[0].total_sale
              data['yearly_sale'] = result[0].yearly_sale
              data['monthly_sale'] = result[0].monthly_sale
              data['type'] = result[0].crzb_type
              data['name'] = result[0].crzb_name
            }
            resolve()
          });
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            data
          })
        }
      })
    }
  })

})

router.get('/top-5-childs-sale/:hod_id', (req, res) => {
  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let data = []

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `select 
                top_5.*
            from assign_roles as asn_role
            join (
              select 
                c_l.id,
                c_l.name,
                    c_l.parent_id,
                get_crzb_total_sale(c_l.id) as sale
              from crzb_list as c_l
                where c_l.parent_id=${req.params.hod_id}
              order by sale desc, c_l.id
              limit 5
            ) as top_5
            on asn_role.crzb_id = top_5.parent_id
            where asn_role.crzb_id=${req.params.hod_id} and asn_role.member_id=${req.decoded.data.user_id}`,
          function (error, result) {
            if (error) {
              err_hdl(error);
            } else {
              data = result
            }
            resolve()
          });
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            data
          })
        }
      })
    }
  })
})

module.exports = router