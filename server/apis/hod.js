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

router.get('/sale-list/:hod_id/:type', function (req, res) {
  if (!/^[0-9]*$/.test(req.params.hod_id) || !/^1$|^2$|^3$|^4$/.test(req.params.type)) {
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
            from (
              select crzbf_ls.code
              from assign_roles_trans as asn_r_tr
              
              join mem_link_franchise as mem_lk_fr
              on asn_r_tr.linked_member_id = mem_lk_fr.member_id
              
              join(
                select 
                  l1.id as l1_id,
                  if(
                    ${req.params.type}=4, 
                    l1.id, 
                    if(
                      ${req.params.type}=3,
                      l2.id,
                      if(
                        ${req.params.type}=2,
                        l3.id,
                        if(
                          ${req.params.type}=1,
                          l4.id,
                          null
                          )
                        )
                      )
                    ) as crzbf_id,
                    get_crzbf_name_type(if(
                      ${req.params.type}=4, 
                      l1.id, 
                      if(
                        ${req.params.type}=3,
                        l2.id,
                        if(
                          ${req.params.type}=2,
                          l3.id,
                          if(
                            ${req.params.type}=1,
                            l4.id,
                            null
                            )
                          )
                        )
                    ), ${req.params.type}) as name,
                    get_crzbf_code_type(if(
                      ${req.params.type}=4, 
                      l1.id, 
                      if(
                        ${req.params.type}=3,
                        l2.id,
                        if(
                          ${req.params.type}=2,
                          l3.id,
                          if(
                            ${req.params.type}=1,
                            l4.id,
                            null
                            )
                          )
                        )
                    ), ${req.params.type}) as code
                from franchises as l1
                join crzb_list as l2
                on l1.branch_id = l2.id
                join crzb_list as l3
                on l2.parent_id = l3.id
                join crzb_list as l4
                on l3.parent_id = l4.id
              ) as crzbf_ls
              on mem_lk_fr.franchise_id = crzbf_ls.l1_id
              
              left join 
                (
                  select 
                    asn_r_tr.member_id, 
                    asn_r_tr.linked_member_id, 
                    asn_r_tr.crzb_id as crzbf_id
                  from assign_roles_trans as asn_r_tr
              
                  union all
              
                  select 
                    asn_r_tr_fr.member_id, 
                    asn_r_tr_fr.linked_member_id, 
                    asn_r_tr_fr.fr_id as crzbf_id
                  from assign_roles_trans_fr as asn_r_tr_fr
                  ) as tr_childs
              on mem_lk_fr.member_id = tr_childs.linked_member_id and tr_childs.crzbf_id <> ${req.params.hod_id} and tr_childs.crzbf_id = crzbf_ls.crzbf_id
              
              left join members as asn_mem
              on tr_childs.member_id = asn_mem.id
              
              where asn_r_tr.member_id = ${req.decoded.data.user_id} and asn_r_tr.crzb_id = ${req.params.hod_id} and (
                crzbf_ls.code collate utf8mb4_general_ci like '%${search}%' or 
                  crzbf_ls.name collate utf8mb4_general_ci like '%${search}%' or
                  asn_mem.user_asn_id like '%${search}%' or
                  asn_mem.full_name like '%${search}%' 
              )
              
              group by crzbf_ls.code, crzbf_ls.name, asn_mem.id
            ) as all_data`,
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
                crzbf_ls.code,
                crzbf_ls.name,
                asn_mem.user_asn_id as mj_id,
                asn_mem.full_name as mj_name,
                count(*) as total_sale,
                sum(ifnull(get_mem_lk_exist_month(mem_lk_fr.member_id, '${gen_start_month}', '${gen_end_month}'), 0)) as month_sale
              from assign_roles_trans as asn_r_tr
              
              join mem_link_franchise as mem_lk_fr
              on asn_r_tr.linked_member_id = mem_lk_fr.member_id
              
              join(
                select 
                  l1.id as l1_id,
                  if(
                    ${req.params.type}=4, 
                    l1.id, 
                    if(
                      ${req.params.type}=3,
                      l2.id,
                      if(
                        ${req.params.type}=2,
                        l3.id,
                        if(
                          ${req.params.type}=1,
                          l4.id,
                          null
                          )
                        )
                      )
                    ) as crzbf_id,
                    get_crzbf_name_type(if(
                      ${req.params.type}=4, 
                      l1.id, 
                      if(
                        ${req.params.type}=3,
                        l2.id,
                        if(
                          ${req.params.type}=2,
                          l3.id,
                          if(
                            ${req.params.type}=1,
                            l4.id,
                            null
                            )
                          )
                        )
                    ), ${req.params.type}) as name,
                    get_crzbf_code_type(if(
                      ${req.params.type}=4, 
                      l1.id, 
                      if(
                        ${req.params.type}=3,
                        l2.id,
                        if(
                          ${req.params.type}=2,
                          l3.id,
                          if(
                            ${req.params.type}=1,
                            l4.id,
                            null
                            )
                          )
                        )
                    ), ${req.params.type}) as code
                from franchises as l1
                join crzb_list as l2
                on l1.branch_id = l2.id
                join crzb_list as l3
                on l2.parent_id = l3.id
                join crzb_list as l4
                on l3.parent_id = l4.id
              ) as crzbf_ls
              on mem_lk_fr.franchise_id = crzbf_ls.l1_id
              
              left join 
                (
                  select 
                    asn_r_tr.member_id, 
                    asn_r_tr.linked_member_id, 
                    asn_r_tr.crzb_id as crzbf_id
                  from assign_roles_trans as asn_r_tr
              
                  union all
              
                  select 
                    asn_r_tr_fr.member_id, 
                    asn_r_tr_fr.linked_member_id, 
                    asn_r_tr_fr.fr_id as crzbf_id
                  from assign_roles_trans_fr as asn_r_tr_fr
                  ) as tr_childs
              on mem_lk_fr.member_id = tr_childs.linked_member_id and tr_childs.crzbf_id <> ${req.params.hod_id} and tr_childs.crzbf_id = crzbf_ls.crzbf_id
              
              left join members as asn_mem
              on tr_childs.member_id = asn_mem.id
              
              where asn_r_tr.member_id = ${req.decoded.data.user_id} and asn_r_tr.crzb_id = ${req.params.hod_id} and (
                crzbf_ls.code collate utf8mb4_general_ci like '%${search}%' or 
                  crzbf_ls.name collate utf8mb4_general_ci like '%${search}%' or
                  asn_mem.user_asn_id like '%${search}%' or
                  asn_mem.full_name like '%${search}%' 
              )
              
              group by crzbf_ls.code, crzbf_ls.name, asn_mem.id
              order by total_sale desc, month_sale desc
          
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

router.get('/commission-list/:hod_id/:type', function (req, res) {
  if (!/^[0-9]*$/.test(req.params.hod_id) || !/^1$|^2$|^3$|^4$/.test(req.params.type)) {
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
        from assign_roles_trans as trans
        join assign_roles_trans_fr as trans_fr
        on trans.linked_member_id = trans_fr.linked_member_id
        
        join(
          select 
            l1.id as l1_id,
            if(
              ${req.params.type}=4, 
              l1.id, 
              if(
                ${req.params.type}=3,
                l2.id,
                if(
                  ${req.params.type}=2,
                  l3.id,
                  if(
                    ${req.params.type}=1,
                    l4.id,
                    null
                    )
                  )
                )
            ) as crzbf_id,
            get_crzbf_name_type(if(
              ${req.params.type}=4, 
              l1.id, 
              if(
                ${req.params.type}=3,
                l2.id,
                if(
                  ${req.params.type}=2,
                  l3.id,
                  if(
                    ${req.params.type}=1,
                    l4.id,
                    null
                    )
                  )
                )
            ), ${req.params.type}) as name,
            get_crzbf_code_type(if(
              ${req.params.type}=4, 
              l1.id, 
              if(
                ${req.params.type}=3,
                l2.id,
                if(
                  ${req.params.type}=2,
                  l3.id,
                  if(
                    ${req.params.type}=1,
                    l4.id,
                    null
                    )
                  )
                )
            ), ${req.params.type}) as code
          from franchises as l1
          join crzb_list as l2
          on l1.branch_id = l2.id
          join crzb_list as l3
          on l2.parent_id = l3.id
          join crzb_list as l4
          on l3.parent_id = l4.id
          ) as crzbf_ls
        on trans_fr.fr_id = crzbf_ls.l1_id
        
        join members as j_mem
        on trans.linked_member_id = j_mem.id
        
        where trans.member_id = ${req.decoded.data.user_id} and trans.crzb_id = ${req.params.hod_id} and (
          crzbf_ls.code collate utf8mb4_general_ci like '%${search}%' or
          crzbf_ls.name collate utf8mb4_general_ci like '%${search}%' or
          j_mem.user_asn_id like '%${search}%' or
          j_mem.full_name like '%${search}%'
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
                trans.id,
                crzbf_ls.code,
                crzbf_ls.name,
                j_mem.user_asn_id as j_mj_id,
                j_mem.full_name as j_mj_name,
                trans.amount,
                trans.created_at as issue_date
                  
              from assign_roles_trans as trans
              join assign_roles_trans_fr as trans_fr
              on trans.linked_member_id = trans_fr.linked_member_id
              
              join(
                select 
                  l1.id as l1_id,
                  if(
                    ${req.params.type}=4, 
                    l1.id, 
                    if(
                      ${req.params.type}=3,
                      l2.id,
                      if(
                        ${req.params.type}=2,
                        l3.id,
                        if(
                          ${req.params.type}=1,
                          l4.id,
                          null
                          )
                        )
                      )
                  ) as crzbf_id,
                  get_crzbf_name_type(if(
                    ${req.params.type}=4, 
                    l1.id, 
                    if(
                      ${req.params.type}=3,
                      l2.id,
                      if(
                        ${req.params.type}=2,
                        l3.id,
                        if(
                          ${req.params.type}=1,
                          l4.id,
                          null
                          )
                        )
                      )
                  ), ${req.params.type}) as name,
                  get_crzbf_code_type(if(
                    ${req.params.type}=4, 
                    l1.id, 
                    if(
                      ${req.params.type}=3,
                      l2.id,
                      if(
                        ${req.params.type}=2,
                        l3.id,
                        if(
                          ${req.params.type}=1,
                          l4.id,
                          null
                          )
                        )
                      )
                  ), ${req.params.type}) as code
                from franchises as l1
                join crzb_list as l2
                on l1.branch_id = l2.id
                join crzb_list as l3
                on l2.parent_id = l3.id
                join crzb_list as l4
                on l3.parent_id = l4.id
                ) as crzbf_ls
              on trans_fr.fr_id = crzbf_ls.l1_id
              
              join members as j_mem
              on trans.linked_member_id = j_mem.id
              
              
              where trans.member_id = ${req.decoded.data.user_id} and trans.crzb_id = ${req.params.hod_id} and (
                crzbf_ls.code collate utf8mb4_general_ci like '%${search}%' or
                crzbf_ls.name collate utf8mb4_general_ci like '%${search}%' or
                j_mem.user_asn_id like '%${search}%' or
                j_mem.full_name like '%${search}%'
              )
              
              order by trans.id desc
          
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

router.get('/commission-count/:hod_id', (req, res) => {
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
        total_comm: 0,
        yearly_comm: 0,
        monthly_comm: 0,
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
            sum(trans.amount) as total,
            ifnull(get_crzb_mem_comm_monthly(trans.crzb_id, trans.member_id, '${gen_start_year}', '${gen_end_year}'), 0) as yearly,
            ifnull(get_crzb_mem_comm_monthly(trans.crzb_id, trans.member_id, '${gen_start_month}', '${gen_end_month}'), 0) as monthly
              
          from assign_roles_trans as trans
          
          left join crzb_list as crzb_l 
          on trans.crzb_id=crzb_l.id
          
          where
          trans.member_id = ${req.decoded.data.user_id}
          and
          trans.crzb_id = ${req.params.hod_id}`,
          function (error, result) {
            if (error) {
              err_hdl(error);
            } else {
              data['total_comm'] = result[0].total
              data['yearly_comm'] = result[0].yearly
              data['monthly_comm'] = result[0].monthly
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

router.get('/top5-branch-childs-sale/:hod_id', (req, res) => {
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
                fr.name,
                count(fr.id) as sale
            from assign_roles as asn_role
            
            left join assign_roles_trans as asnr_tr 
            on asn_role.member_id = asnr_tr.member_id and asn_role.crzb_id = asnr_tr.crzb_id
            
            right join mem_link_franchise as mem_lk_fr
            on asnr_tr.linked_member_id = mem_lk_fr.member_id
            
            left join franchises as fr
            on mem_lk_fr.franchise_id = fr.id
            
            where asn_role.member_id=${req.decoded.data.user_id} and asn_role.crzb_id=${req.params.hod_id}
            group by fr.id
            order by sale desc
            limit 5`,
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

router.get('/top5-childs-sale/:hod_id', (req, res) => {
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
              if(
              crzb_lvl_1.l1_p=asn_role.crzb_id, 
                crzb_lvl_1.l1_name, 
                if(
                  crzb_lvl_1.l2_p=asn_role.crzb_id,
                  crzb_lvl_1.l2_name,
                  if(
                    crzb_lvl_1.l3_p=asn_role.crzb_id,
                    crzb_lvl_1.l3_name,
                    ''
                    )
                  )
              ) as name,
              count(crzb_lvl_1.l1_id) as sale
            from assign_roles as asn_role
          
            left join assign_roles_trans as asnr_tr 
            on asn_role.member_id = asnr_tr.member_id and asn_role.crzb_id = asnr_tr.crzb_id
          
            right join mem_link_crzb as mem_lk_crzb
            on asnr_tr.linked_member_id = mem_lk_crzb.member_id
          
            left join (
              select 
                crzb_1.id as l1_id,
                    crzb_1.name as l1_name,
                    crzb_1.parent_id as l1_p,
                    crzb_2.id as l2_id,
                    crzb_2.name as l2_name,
                    crzb_2.parent_id as l2_p,
                    crzb_3.id as l3_id,
                    crzb_3.name as l3_name,
                    crzb_3.parent_id as l3_p,
                    crzb_4.id as l4_id,
                    crzb_4.name as l4_name,
                    crzb_4.parent_id as l4_p
              from crzb_list as crzb_1
                
                left join crzb_list as crzb_2
                on crzb_1.parent_id = crzb_2.id
                
                left join crzb_list as crzb_3
                on crzb_2.parent_id = crzb_3.id
                
                left join crzb_list as crzb_4
                on crzb_3.parent_id = crzb_4.id
            ) crzb_lvl_1
            on mem_lk_crzb.crzb_id = crzb_lvl_1.l1_id
          
            where asn_role.member_id=${req.decoded.data.user_id} and asn_role.crzb_id=${req.params.hod_id}
          
            group by if(
                    crzb_lvl_1.l1_p=asn_role.crzb_id, 
                      crzb_lvl_1.l1_id, 
                      if(
                        crzb_lvl_1.l2_p=asn_role.crzb_id,
                          crzb_lvl_1.l2_id,
                          if(
                            crzb_lvl_1.l3_p=asn_role.crzb_id,
                              crzb_lvl_1.l3_id,
                              ''
                          )
                        )
                      )
            order by sale desc
            limit 5`,
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