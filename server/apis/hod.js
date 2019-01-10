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

router.get('/sale-list/:hod_id', function (req, res) {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
    return res.status(500).json({
      error: "Invalid HOD ID!"
    })
  }

  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 10,
        search = ""

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
        `select 
            COUNT(*) as tot_rows
            from mem_link_crzb as mem_lk_crzb
                join members as m
                on mem_lk_crzb.member_id = m.id and m.is_paid_m=1
                
                join (
                  select
                    lvl_3.id as lvl3id,
                        lvl_3.parent_id as lvl3p_id,
                        lvl_2.*
                  from crzb_list as lvl_3
                    join (
                    select
                      lvl_2.id as lvl2id,
                      lvl_2.parent_id as lvl2p_id,
                            lvl_1.*
                    from crzb_list as lvl_2
                        join (
                      select
                        lvl_1.id as lvl1id,
                        lvl_1.parent_id as lvl1p_id
                      from crzb_list as lvl_1
                    ) as lvl_1
                    on lvl_2.parent_id = lvl_1.lvl1id
                    ) as lvl_2
                    on lvl_3.parent_id = lvl_2.lvl2id
                ) as parent_crzb
                on mem_lk_crzb.crzb_id = parent_crzb.lvl3id and (parent_crzb.lvl3p_id=${req.params.hod_id} OR parent_crzb.lvl2p_id=${req.params.hod_id} OR parent_crzb.lvl1p_id=${req.params.hod_id})
                
                join (
                  select 
                  crzb_l.id,
                  get_crzb_rd_code(crzb_l.id) as crzb_code,
                  get_crzb_with_p_name(crzb_l.id) as crzb_name
                  from crzb_list as crzb_l
                ) as crzb_var
                on mem_lk_crzb.crzb_id = crzb_var.id
                
                left join assign_roles_trans as asn_role_tns
                on mem_lk_crzb.crzb_id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id
                
                left join members as asn_mem
                on asn_role_tns.member_id = asn_mem.id
                
                where mem_lk_crzb.linked_type=1 and (
                  asn_mem.user_asn_id like '%${search}%' or
                  asn_mem.full_name like '%${search}%' or
                  crzb_var.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                  crzb_var.crzb_name collate utf8mb4_general_ci like '%${search}%'
                )
                group by mem_lk_crzb.crzb_id, asn_role_tns.member_id`,
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
              `select 
                  asn_mem.user_asn_id,
                  asn_mem.full_name,
                  crzb_var.crzb_code,
                  crzb_var.crzb_name,
                  count(*) as total_sale,
                  get_crzb_mem_sale_monthly(mem_lk_crzb.crzb_id, asn_mem.id, '${gen_start_month}', '${gen_end_month}') as total_month_sale
                
                from mem_link_crzb as mem_lk_crzb
                join members as m
                on mem_lk_crzb.member_id = m.id and m.is_paid_m=1
                
                join (
                  select
                    lvl_3.id as lvl3id,
                        lvl_3.parent_id as lvl3p_id,
                        lvl_2.*
                  from crzb_list as lvl_3
                    join (
                    select
                      lvl_2.id as lvl2id,
                      lvl_2.parent_id as lvl2p_id,
                            lvl_1.*
                    from crzb_list as lvl_2
                        join (
                      select
                        lvl_1.id as lvl1id,
                        lvl_1.parent_id as lvl1p_id
                      from crzb_list as lvl_1
                    ) as lvl_1
                    on lvl_2.parent_id = lvl_1.lvl1id
                    ) as lvl_2
                    on lvl_3.parent_id = lvl_2.lvl2id
                ) as parent_crzb
                on mem_lk_crzb.crzb_id = parent_crzb.lvl3id and (parent_crzb.lvl3p_id=${req.params.hod_id} OR parent_crzb.lvl2p_id=${req.params.hod_id} OR parent_crzb.lvl1p_id=${req.params.hod_id})
                
                join (
                  select 
                  crzb_l.id,
                  get_crzb_rd_code(crzb_l.id) as crzb_code,
                  get_crzb_with_p_name(crzb_l.id) as crzb_name
                  from crzb_list as crzb_l
                ) as crzb_var
                on mem_lk_crzb.crzb_id = crzb_var.id
                
                left join assign_roles_trans as asn_role_tns
                on mem_lk_crzb.crzb_id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id
                
                left join members as asn_mem
                on asn_role_tns.member_id = asn_mem.id
                
                where mem_lk_crzb.linked_type=1 and (
                  asn_mem.user_asn_id like '%${search}%' or
                  asn_mem.full_name like '%${search}%' or
                  crzb_var.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                  crzb_var.crzb_name collate utf8mb4_general_ci like '%${search}%'
                )
                group by mem_lk_crzb.crzb_id, asn_role_tns.member_id
                order by total_sale desc
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

router.get('/branch-sale-list/:hod_id', function (req, res) {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
    return res.status(500).json({
      error: "Invalid HOD ID!"
    })
  }

  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 10,
        search = ""

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
        `select 
            COUNT(*) as tot_rows
          from mem_link_crzb as mem_lk_crzb
          join members as lk_mem
          on mem_lk_crzb.member_id = lk_mem.id and lk_mem.is_paid_m=1
          
          join (
            select 
            crzb_l.id,
            get_crzb_rd_code(crzb_l.id) as crzb_code,
            get_crzb_with_p_name(crzb_l.id) as crzb_name
            from crzb_list as crzb_l
          ) as crzb_var
          on mem_lk_crzb.crzb_id = crzb_var.id
          
          join assign_roles_trans as asn_role_tns
          on mem_lk_crzb.crzb_id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id
          
          join members as asn_mem
          on asn_role_tns.member_id = asn_mem.id and asn_mem.id=${req.decoded.data.user_id}
          
          where mem_lk_crzb.linked_type=1 and mem_lk_crzb.crzb_id=${req.params.hod_id} and (
            lk_mem.user_asn_id like '%${search}%' or
            lk_mem.full_name like '%${search}%' or
            crzb_var.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
            crzb_var.crzb_name collate utf8mb4_general_ci like '%${search}%'
          )`,
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
            connection.query(
              `select 
                  lk_mem.user_asn_id,
                  lk_mem.full_name,
                  crzb_var.crzb_code,
                  crzb_var.crzb_name,
                  asn_role_tns.created_at as join_date
                
                from mem_link_crzb as mem_lk_crzb
                join members as lk_mem
                on mem_lk_crzb.member_id = lk_mem.id and lk_mem.is_paid_m=1
                
                join (
                  select 
                  crzb_l.id,
                  get_crzb_rd_code(crzb_l.id) as crzb_code,
                  get_crzb_with_p_name(crzb_l.id) as crzb_name
                  from crzb_list as crzb_l
                ) as crzb_var
                on mem_lk_crzb.crzb_id = crzb_var.id
                
                join assign_roles_trans as asn_role_tns
                on mem_lk_crzb.crzb_id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id
                
                join members as asn_mem
                on asn_role_tns.member_id = asn_mem.id and asn_mem.id=${req.decoded.data.user_id}
                
                where mem_lk_crzb.linked_type=1 and mem_lk_crzb.crzb_id=${req.params.hod_id} and (
                  lk_mem.user_asn_id like '%${search}%' or
                  lk_mem.full_name like '%${search}%' or
                  crzb_var.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                  crzb_var.crzb_name collate utf8mb4_general_ci like '%${search}%'
                )
                order by join_date desc
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

router.get('/sale-count/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
    return res.status(500).json({
      error: "Invalid HOD ID!"
    })
  }
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
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
    return res.status(500).json({
      error: "Invalid HOD ID!"
    })
  }
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