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

router.get('/zonal-sale-list/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
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
          select 
            get_crzb_rd_code(b_list.id) as crzb_code,
            get_crzb_with_p_name(b_list.id) as crzb_name

          from mem_link_crzb as mem_lk_crzb
          join members as m
          on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

          left join crzb_list as b_list
          on mem_lk_crzb.crzb_id = b_list.id
          left join crzb_list as z_list
          on b_list.parent_id = z_list.id

          join assign_roles_trans as asn_role_tns
          on z_list.id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id

          where mem_lk_crzb.linked_mem_type=1 and z_list.id=${req.params.hod_id} and asn_role_tns.member_id=${req.decoded.data.user_id}
          group by b_list.id
        ) as all_data
        where 
          all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
        `,
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
              `select all_data.* from (
                select 
                  get_crzb_rd_code(b_list.id) as crzb_code,
                  get_crzb_with_p_name(b_list.id) as crzb_name,
                  count(*) as total_sale,
                  sum(if(m_tb_sale.member_id is null, 0, 1)) as month_sale

                from mem_link_crzb as mem_lk_crzb
                join members as m
                on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

                left join (
                select 
                  mem_lk.member_id,
                  mem_lk.linked_at
                from mem_link_crzb as mem_lk
                ) as m_tb_sale
                on mem_lk_crzb.member_id = m_tb_sale.member_id and (m_tb_sale.linked_at >= '${gen_start_month}' and m_tb_sale.linked_at <= '${gen_end_month}')

                left join crzb_list as b_list
                on mem_lk_crzb.crzb_id = b_list.id
                left join crzb_list as z_list
                on b_list.parent_id = z_list.id

                join assign_roles_trans as asn_role_tns
                on z_list.id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id

                where mem_lk_crzb.linked_mem_type=1 and z_list.id=${req.params.hod_id} and asn_role_tns.member_id=${req.decoded.data.user_id}
                group by b_list.id
              ) as all_data
              
              where 
                all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.total_sale desc, all_data.month_sale desc
          
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

router.get('/region-sale-list/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
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
          select 
            asn_mem.user_asn_id as mj_id,
            asn_mem.full_name as mj_name,
            get_crzb_rd_code(z_list.id) as crzb_code,
            get_crzb_with_p_name(z_list.id) as crzb_name
          from assign_roles as asn_role

          join assign_roles_trans as asn_trans
          on asn_role.crzb_id=asn_trans.crzb_id and asn_role.member_id=asn_trans.member_id

          join mem_link_crzb as mem_lk_crzb
          on asn_trans.linked_member_id=mem_lk_crzb.member_id

          join members as m
          on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

          left join crzb_list as b_list
          on mem_lk_crzb.crzb_id = b_list.id
          left join crzb_list as z_list
          on b_list.parent_id = z_list.id

          left join assign_roles_trans as asn_mem_tns
          on z_list.id = asn_mem_tns.crzb_id and mem_lk_crzb.member_id = asn_mem_tns.linked_member_id

          left join members as asn_mem
          on asn_mem_tns.member_id = asn_mem.id

          where asn_role.crzb_id=${req.params.hod_id} and asn_role.member_id=${req.decoded.data.user_id}
          group by z_list.id, asn_mem_tns.member_id
        ) as all_data
        where 
          all_data.mj_id like '%${search}%' or
          all_data.mj_name like '%${search}%' or
          all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
        `,
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
              `select all_data.* from (
                select 
                  asn_mem.user_asn_id as mj_id,
                  asn_mem.full_name as mj_name,
                  get_crzb_rd_code(z_list.id) as crzb_code,
                  get_crzb_with_p_name(z_list.id) as crzb_name,
                  count(*) as total_sale,
                  sum(if(m_tb_sale.member_id is null, 0, 1)) as month_sale
                from assign_roles as asn_role

                join assign_roles_trans as asn_trans
                on asn_role.crzb_id=asn_trans.crzb_id and asn_role.member_id=asn_trans.member_id

                join mem_link_crzb as mem_lk_crzb
                on asn_trans.linked_member_id=mem_lk_crzb.member_id

                left join (
                select 
                  mem_lk.member_id,
                  mem_lk.linked_at
                from mem_link_crzb as mem_lk
                ) as m_tb_sale
                on mem_lk_crzb.member_id = m_tb_sale.member_id and (m_tb_sale.linked_at >= '${gen_start_month}' and m_tb_sale.linked_at <= '${gen_end_month}')

                join members as m
                on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

                left join crzb_list as b_list
                on mem_lk_crzb.crzb_id = b_list.id
                left join crzb_list as z_list
                on b_list.parent_id = z_list.id

                left join assign_roles_trans as asn_mem_tns
                on z_list.id = asn_mem_tns.crzb_id and mem_lk_crzb.member_id = asn_mem_tns.linked_member_id

                left join members as asn_mem
                on asn_mem_tns.member_id = asn_mem.id

                where asn_role.crzb_id=${req.params.hod_id} and asn_role.member_id=${req.decoded.data.user_id}
                group by z_list.id, asn_mem_tns.member_id
              ) as all_data
              
              where 
                all_data.mj_id like '%${search}%' or
                all_data.mj_name like '%${search}%' or
                all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.total_sale desc, all_data.month_sale desc
          
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

router.get('/country-sale-list/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
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
          select 
            asn_mem.user_asn_id as mj_id,
            asn_mem.full_name as mj_name,
            get_crzb_rd_code(r_list.id) as crzb_code,
            get_crzb_with_p_name(r_list.id) as crzb_name
          from assign_roles as asn_role

          join assign_roles_trans as asn_trans
          on asn_role.crzb_id=asn_trans.crzb_id and asn_role.member_id=asn_trans.member_id

          join mem_link_crzb as mem_lk_crzb
          on asn_trans.linked_member_id=mem_lk_crzb.member_id

          join members as m
          on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

          left join crzb_list as b_list
          on mem_lk_crzb.crzb_id = b_list.id
          left join crzb_list as z_list
          on b_list.parent_id = z_list.id
          left join crzb_list as r_list
          on z_list.parent_id = r_list.id

          left join assign_roles_trans as asn_mem_tns
          on r_list.id = asn_mem_tns.crzb_id and mem_lk_crzb.member_id = asn_mem_tns.linked_member_id

          left join members as asn_mem
          on asn_mem_tns.member_id = asn_mem.id

          where asn_role.crzb_id=${req.params.hod_id} and asn_role.member_id=${req.decoded.data.user_id}
          group by r_list.id, asn_mem_tns.member_id
        ) as all_data
        where 
          all_data.mj_id like '%${search}%' or
          all_data.mj_name like '%${search}%' or
          all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
        `,
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
              `select all_data.* from (
                select 
                  asn_mem.user_asn_id as mj_id,
                  asn_mem.full_name as mj_name,
                  get_crzb_rd_code(r_list.id) as crzb_code,
                  get_crzb_with_p_name(r_list.id) as crzb_name,
                  count(*) as total_sale,
                  sum(if(m_tb_sale.member_id is null, 0, 1)) as month_sale
                from assign_roles as asn_role

                join assign_roles_trans as asn_trans
                on asn_role.crzb_id=asn_trans.crzb_id and asn_role.member_id=asn_trans.member_id

                join mem_link_crzb as mem_lk_crzb
                on asn_trans.linked_member_id=mem_lk_crzb.member_id

                left join (
                select 
                  mem_lk.member_id,
                  mem_lk.linked_at
                from mem_link_crzb as mem_lk
                ) as m_tb_sale
                on mem_lk_crzb.member_id = m_tb_sale.member_id and (m_tb_sale.linked_at >= '${gen_start_month}' and m_tb_sale.linked_at <= '${gen_end_month}')

                join members as m
                on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

                left join crzb_list as b_list
                on mem_lk_crzb.crzb_id = b_list.id
                left join crzb_list as z_list
                on b_list.parent_id = z_list.id
                left join crzb_list as r_list
                on z_list.parent_id = r_list.id

                left join assign_roles_trans as asn_mem_tns
                on r_list.id = asn_mem_tns.crzb_id and mem_lk_crzb.member_id = asn_mem_tns.linked_member_id

                left join members as asn_mem
                on asn_mem_tns.member_id = asn_mem.id

                where asn_role.crzb_id=${req.params.hod_id} and asn_role.member_id=${req.decoded.data.user_id}
                group by r_list.id, asn_mem_tns.member_id
              ) as all_data
              
              where 
                all_data.mj_id like '%${search}%' or
                all_data.mj_name like '%${search}%' or
                all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.total_sale desc, all_data.month_sale desc
          
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

router.get('/country-comm-list/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
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
          SELECT 
            asn_mem.user_asn_id as mj_id,
            asn_mem.full_name as mj_name,
            get_crzb_rd_code(r_l.id) as crzb_code,
            get_crzb_with_p_name(r_l.id) as crzb_name
          FROM assign_roles_trans as asn_trans

          join mem_link_crzb as mem_lk_crzb
          on asn_trans.linked_member_id = mem_lk_crzb.member_id

          join crzb_list as b_l
          on mem_lk_crzb.crzb_id = b_l.id
          join crzb_list as z_l
          on b_l.parent_id = z_l.id
          join crzb_list as r_l
          on z_l.parent_id = r_l.id

          left join assign_roles_trans as asn_mem_trn
          on mem_lk_crzb.member_id = asn_mem_trn.linked_member_id and asn_mem_trn.crzb_id = r_l.id

          left join members as asn_mem
          on asn_mem_trn.member_id= asn_mem.id

          where asn_trans.member_id=${req.decoded.data.user_id} and asn_trans.crzb_id=${req.params.hod_id}
          group by asn_mem.id, r_l.id
        ) as all_data
        where 
          all_data.mj_id like '%${search}%' or
          all_data.mj_name like '%${search}%' or
          all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
        `,
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
              `select all_data.* from (
                SELECT 
                  asn_mem.user_asn_id as mj_id,
                  asn_mem.full_name as mj_name,
                  get_crzb_rd_code(r_l.id) as crzb_code,
                  get_crzb_with_p_name(r_l.id) as crzb_name,
                  sum(asn_trans.amount) as total_comm,
                  sum(if(m_tb_sale.member_id is null, 0, asn_trans.amount)) as month_comm
                FROM assign_roles_trans as asn_trans

                join mem_link_crzb as mem_lk_crzb
                on asn_trans.linked_member_id = mem_lk_crzb.member_id

                left join (
                select 
                  mem_lk.member_id,
                  mem_lk.linked_at
                from mem_link_crzb as mem_lk
                ) as m_tb_sale
                on mem_lk_crzb.member_id = m_tb_sale.member_id and (m_tb_sale.linked_at >= '${gen_start_month}' and m_tb_sale.linked_at <= '${gen_end_month}')

                join crzb_list as b_l
                on mem_lk_crzb.crzb_id = b_l.id
                join crzb_list as z_l
                on b_l.parent_id = z_l.id
                join crzb_list as r_l
                on z_l.parent_id = r_l.id

                left join assign_roles_trans as asn_mem_trn
                on mem_lk_crzb.member_id = asn_mem_trn.linked_member_id and asn_mem_trn.crzb_id = r_l.id

                left join members as asn_mem
                on asn_mem_trn.member_id= asn_mem.id

                where asn_trans.member_id=${req.decoded.data.user_id} and asn_trans.crzb_id=${req.params.hod_id}
                group by asn_mem.id, r_l.id
              ) as all_data
              
              where 
                all_data.mj_id like '%${search}%' or
                all_data.mj_name like '%${search}%' or
                all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.total_comm desc, all_data.month_comm desc
          
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

router.get('/region-comm-list/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
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
          SELECT 
            asn_mem.user_asn_id as mj_id,
            asn_mem.full_name as mj_name,
            get_crzb_rd_code(z_l.id) as crzb_code,
            get_crzb_with_p_name(z_l.id) as crzb_name
          FROM assign_roles_trans as asn_trans

          join mem_link_crzb as mem_lk_crzb
          on asn_trans.linked_member_id = mem_lk_crzb.member_id

          join crzb_list as b_l
          on mem_lk_crzb.crzb_id = b_l.id
          join crzb_list as z_l
          on b_l.parent_id = z_l.id

          left join assign_roles_trans as asn_mem_trn
          on mem_lk_crzb.member_id = asn_mem_trn.linked_member_id and asn_mem_trn.crzb_id = z_l.id

          left join members as asn_mem
          on asn_mem_trn.member_id= asn_mem.id

          where asn_trans.member_id=${req.decoded.data.user_id} and asn_trans.crzb_id=${req.params.hod_id}
          group by asn_mem.id, z_l.id
        ) as all_data
        where 
          all_data.mj_id like '%${search}%' or
          all_data.mj_name like '%${search}%' or
          all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
        `,
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
              `select all_data.* from (
                SELECT 
                  asn_mem.user_asn_id as mj_id,
                  asn_mem.full_name as mj_name,
                  get_crzb_rd_code(z_l.id) as crzb_code,
                  get_crzb_with_p_name(z_l.id) as crzb_name,
                  sum(asn_trans.amount) as total_comm,
                  sum(if(m_tb_sale.member_id is null, 0, asn_trans.amount)) as month_comm
                FROM assign_roles_trans as asn_trans

                join mem_link_crzb as mem_lk_crzb
                on asn_trans.linked_member_id = mem_lk_crzb.member_id

                left join (
                select 
                  mem_lk.member_id,
                  mem_lk.linked_at
                from mem_link_crzb as mem_lk
                ) as m_tb_sale
                on mem_lk_crzb.member_id = m_tb_sale.member_id and (m_tb_sale.linked_at >= '${gen_start_month}' and m_tb_sale.linked_at <= '${gen_end_month}')

                join crzb_list as b_l
                on mem_lk_crzb.crzb_id = b_l.id
                join crzb_list as z_l
                on b_l.parent_id = z_l.id

                left join assign_roles_trans as asn_mem_trn
                on mem_lk_crzb.member_id = asn_mem_trn.linked_member_id and asn_mem_trn.crzb_id = z_l.id

                left join members as asn_mem
                on asn_mem_trn.member_id= asn_mem.id

                where asn_trans.member_id=${req.decoded.data.user_id} and asn_trans.crzb_id=${req.params.hod_id}
                group by asn_mem.id, z_l.id
              ) as all_data
              
              where 
                all_data.mj_id like '%${search}%' or
                all_data.mj_name like '%${search}%' or
                all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.total_comm desc, all_data.month_comm desc
          
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

router.get('/zonal-comm-list/:hod_id', (req, res) => {
  if (!/^[0-9]*$/.test(req.params.hod_id)) {
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
          SELECT 
            get_crzb_rd_code(mem_lk_crzb.crzb_id) as crzb_code,
            get_crzb_with_p_name(mem_lk_crzb.crzb_id) as crzb_name
          FROM assign_roles_trans as asn_trans

          join mem_link_crzb as mem_lk_crzb
          on asn_trans.linked_member_id = mem_lk_crzb.member_id

          where asn_trans.member_id=${req.decoded.data.user_id} and asn_trans.crzb_id=${req.params.hod_id}
          group by mem_lk_crzb.crzb_id
        ) as all_data
        where 
          all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
          all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
        `,
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
              `select all_data.* from (
                SELECT 
                  get_crzb_rd_code(mem_lk_crzb.crzb_id) as crzb_code,
                  get_crzb_with_p_name(mem_lk_crzb.crzb_id) as crzb_name,
                  sum(asn_trans.amount) as total_comm,
                  sum(if(m_tb_sale.member_id is null, 0, asn_trans.amount)) as month_comm
                FROM assign_roles_trans as asn_trans

                join mem_link_crzb as mem_lk_crzb
                on asn_trans.linked_member_id = mem_lk_crzb.member_id

                left join (
                select 
                  mem_lk.member_id,
                  mem_lk.linked_at
                from mem_link_crzb as mem_lk
                ) as m_tb_sale
                on mem_lk_crzb.member_id = m_tb_sale.member_id and (m_tb_sale.linked_at >= '${gen_start_month}' and m_tb_sale.linked_at <= '${gen_end_month}')

                where asn_trans.member_id=${req.decoded.data.user_id} and asn_trans.crzb_id=${req.params.hod_id}
                group by mem_lk_crzb.crzb_id
              ) as all_data
              
              where
                all_data.crzb_code collate utf8mb4_general_ci like '%${search}%' or 
                all_data.crzb_name collate utf8mb4_general_ci like '%${search}%'
              
              order by all_data.total_comm desc, all_data.month_comm desc
          
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