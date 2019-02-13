const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')
const db_util = require('../func/db-util.js')

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

router.get('/ld-list/:prd_type', function (req, res) {
  if (!/^1$|^2$/.test(req.params.prd_type)) {
    return res.status(500).json({
      error: "Invalid Parameters!"
    })
  }

  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 50,
        search = ""
      let date = moment(),
        start_at = date.startOf('d').format('YYYY-MM-DD HH:mm:ss'),
        end_at = date.endOf('d').format('YYYY-MM-DD HH:mm:ss')
      //   if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
      //     limit = req.query.limit
      //   }

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      //   if (req.query.search) {
      //     search = req.query.search
      //   }


      connection.query(
        `SELECT 
          ref_mem.id,
          ref_mem.full_name,
          ref_mem.user_asn_id,
          mem.user_asn_id as lnk_mem_id,
          usr_prd.product_id
        FROM hierarchy_m as hir 
        join members as mem
        on hir.member_id = mem.id
        join members as ref_mem
        on mem.ref_user_asn_id = ref_mem.user_asn_id
        join user_product_details as usr_prd
        on mem.id = usr_prd.member_id
        where 
          (hir.created_at >= '${start_at}' and 
          hir.created_at <= '${end_at}') and
          usr_prd.product_id = ${req.params.prd_type}
        order by hir.created_at
        limit ${limit}
        offset ${offset}`,
        function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: results
            })
          }
        })
    }
  })
})

router.post('/today-spin/:prd_type/:grp_pg', (req, res) => {
  if (!/^1$|^2$/.test(req.params.prd_type) && !/^[0-9]*$/.test(req.params.grp_pg)) {
    return res.status(500).json({
      error: "Invalid Parameters!"
    })
  }
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let limit = 5,
        offset = (parseInt(req.params.grp_pg) - 1) * limit
      let date = moment(),
        start_at = date.startOf('d').format('YYYY-MM-DD HH:mm:ss'),
        end_at = date.endOf('d').format('YYYY-MM-DD HH:mm:ss')

      connection.query(
        `SELECT 
          ref_mem.id,
          ref_mem.full_name,
          ref_mem.user_asn_id,
          mem.user_asn_id as lnk_mem_id,
          usr_prd.product_id
        FROM hierarchy_m as hir 
        join members as mem
        on hir.member_id = mem.id
        join members as ref_mem
        on mem.ref_user_asn_id = ref_mem.user_asn_id
        join user_product_details as usr_prd
        on mem.id = usr_prd.member_id
        where 
          (hir.created_at >= '${start_at}' and 
          hir.created_at <= '${end_at}') and
          usr_prd.product_id = ${req.params.prd_type}
        order by hir.created_at
        limit ${limit}
        offset ${offset}`,
        function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: results
            })
          }
        })
    }
  })
})

module.exports = router