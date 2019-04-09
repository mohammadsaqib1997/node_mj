const express = require('express')
const router = express.Router()
const moment = require('moment')
const _ = require('lodash')

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

router.get('/sale-list', function (req, res) {
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
        `select count(*) as tot_rows from (
          select 
            asn_mem.user_asn_id as role_asn_mj_id,
            asn_mem.full_name as role_asn_mj_name,
            get_crzb_rd_code(z_list.id) as crzb_code,
            get_crzb_with_p_name(z_list.id) as crzb_name

          from mem_link_crzb as mem_lk_crzb
          join members as m
          on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

          left join crzb_list as b_list
          on mem_lk_crzb.crzb_id = b_list.id
          left join crzb_list as z_list
          on b_list.parent_id = z_list.id

          left join assign_roles_trans as asn_role_tns
          on z_list.id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id

          left join members as asn_mem
          on asn_role_tns.member_id = asn_mem.id

          where mem_lk_crzb.linked_mem_type=1
          group by z_list.id, asn_role_tns.member_id
        ) as all_data

        where 
          all_data.role_asn_mj_id like '%${search}%' or
          all_data.role_asn_mj_name like '%${search}%' or
          all_data.crzb_code like '%${search}%' or 
          all_data.crzb_name like '%${search}%'`,
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
                  asn_mem.user_asn_id as role_asn_mj_id,
                  asn_mem.full_name as role_asn_mj_name,
                  get_crzb_rd_code(z_list.id) as crzb_code,
                  get_crzb_with_p_name(z_list.id) as crzb_name,
                  count(*) as total_sale,
                  get_zonal_sale_monthly(z_list.id, asn_mem.id, '${gen_start_month}', '${gen_end_month}') as total_month_sale

                from mem_link_crzb as mem_lk_crzb
                join members as m
                on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

                left join crzb_list as b_list
                on mem_lk_crzb.crzb_id = b_list.id
                left join crzb_list as z_list
                on b_list.parent_id = z_list.id

                left join assign_roles_trans as asn_role_tns
                on z_list.id = asn_role_tns.crzb_id and mem_lk_crzb.member_id = asn_role_tns.linked_member_id

                left join members as asn_mem
                on asn_role_tns.member_id = asn_mem.id

                where mem_lk_crzb.linked_mem_type=1
                group by z_list.id, asn_role_tns.member_id
              ) as all_data

              where 
                all_data.role_asn_mj_id like '%${search}%' or
                all_data.role_asn_mj_name like '%${search}%' or
                all_data.crzb_code like '%${search}%' or 
                all_data.crzb_name like '%${search}%'
              
              order by all_data.total_sale desc
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

router.get('/commission-list', function (req, res) {
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
        `select count(*) as tot_rows from (
          select 
            m.id,
            m.user_asn_id as mj_id,
            m.full_name as mj_name,
            get_crzb_rd_code(asr_trans.crzb_id) as crzb_code,
            get_crzb_with_p_name(asr_trans.crzb_id) as crzb_name

          from assign_roles_trans as asr_trans
          join members as m
          on asr_trans.member_id = m.id
            
          group by m.id
        ) as all_data
        
        where (
          all_data.mj_id like '%${search}%' or
          all_data.mj_name like '%${search}%' or
          all_data.crzb_code like '%${search}%' or
          all_data.crzb_name like '%${search}%'
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
            let date = moment()
            let gen_start_month = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
              gen_end_month = date.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss')
            connection.query(
              `select * from (
                select 
                  m.id,
                  m.user_asn_id as mj_id,
                  m.full_name as mj_name,
                  get_crzb_rd_code(asr_trans.crzb_id) as crzb_code,
                  get_crzb_with_p_name(asr_trans.crzb_id) as crzb_name,
                  sum(asr_trans.amount) as total_comm,
                  get_crzb_mem_comm_monthly(asr_trans.crzb_id, m.id, '${gen_start_month}', '${gen_end_month}') as total_month_comm
                  
                from assign_roles_trans as asr_trans
                join members as m
                on asr_trans.member_id = m.id
                  
                group by m.id
              ) as all_data
              
              where (
                all_data.mj_id like '%${search}%' or
                all_data.mj_name like '%${search}%' or
                all_data.crzb_code like '%${search}%' or
                all_data.crzb_name like '%${search}%'
              )
              
              order by all_data.total_comm desc, all_data.total_month_comm desc
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

router.get('/sale-count', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let data = {
        total_sale: 0,
        yearly_sale: 0,
        monthly_sale: 0
      }

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `SELECT COUNT(*) as sale FROM mem_link_crzb as mem_lk_crzb
          JOIN members as m
          ON mem_lk_crzb.member_id=m.id AND m.is_paid_m=1 AND mem_lk_crzb.linked_mem_type=1`,
          function (error, result) {
            if (error) {
              err_hdl(error);
              resolve()
            } else {
              data['total_sale'] = result[0].sale

              let date = moment()
              let gen_start_year = date.clone().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
                gen_end_year = date.clone().endOf('year').format('YYYY-MM-DD HH:mm:ss')
              connection.query(
                `SELECT COUNT(*) as sale FROM mem_link_crzb as mem_lk_crzb
                JOIN members as m
                ON mem_lk_crzb.member_id=m.id AND m.is_paid_m=1
                WHERE mem_lk_crzb.linked_at>='${gen_start_year}' AND mem_lk_crzb.linked_at<='${gen_end_year}' AND mem_lk_crzb.linked_mem_type=1`,
                function (error, result) {
                  if (error) {
                    err_hdl(error);
                    resolve()
                  } else {
                    data['yearly_sale'] = result[0].sale
                    let gen_start_month = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                      gen_end_month = date.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss')
                    connection.query(
                      `SELECT COUNT(*) as sale FROM mem_link_crzb as mem_lk_crzb
                      JOIN members as m
                      ON mem_lk_crzb.member_id=m.id AND m.is_paid_m=1
                      WHERE mem_lk_crzb.linked_at>='${gen_start_month}' AND mem_lk_crzb.linked_at<='${gen_end_month}' AND mem_lk_crzb.linked_mem_type=1`,
                      function (error, result) {
                        if (error) {
                          err_hdl(error);
                        } else {
                          data['monthly_sale'] = result[0].sale
                        }
                        resolve()
                      })
                  }
                })
            }
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

router.get('/sale-region', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let regions = []

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `SELECT id, name FROM crzb_list WHERE type=1`,
          function (error, result) {
            if (error) {
              err_hdl(error);
              resolve()
            } else {
              regions = result
              connection.query(
                `SELECT 
                  COUNT(*) as sale,
                  l_r.id,
                  l_r.name
                FROM mem_link_crzb as mem_lk_crzb
                JOIN members as m
                ON mem_lk_crzb.member_id=m.id AND m.is_paid_m=1
                LEFT JOIN crzb_list as l_b
                ON mem_lk_crzb.crzb_id = l_b.id
                LEFT JOIN crzb_list as l_z
                ON l_b.parent_id = l_z.id
                LEFT JOIN crzb_list as l_r
                ON l_z.parent_id = l_r.id
                WHERE mem_lk_crzb.linked_mem_type=1
                group by l_r.id`,
                function (error, result) {
                  if (error) {
                    err_hdl(error);
                  } else {
                    _.each(result, o => {
                      let f_ind = _.findIndex(regions, {
                        id: o.id
                      })
                      if (f_ind > -1) {
                        regions[f_ind]['sale'] = o.sale
                      }
                    })
                  }
                  resolve()
                });
            }
          })
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            regions
          })
        }
      })
    }
  })

})

router.get('/sale-country', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let countries = []

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `SELECT id as c_id, name as c_name FROM crzb_list WHERE type=0`,
          function (error, result) {
            if (error) {
              err_hdl(error);
              resolve()
            } else {
              countries = result
              connection.query(
                `SELECT 
                  COUNT(*) as sale,
                  l_c.id as c_id,
                  l_c.name as c_name,
                  l_c.type as type
                FROM mem_link_crzb as mem_lk_crzb
                JOIN members as m
                ON mem_lk_crzb.member_id=m.id AND m.is_paid_m=1

                LEFT JOIN crzb_list as l_b
                ON mem_lk_crzb.crzb_id = l_b.id
                LEFT JOIN crzb_list as l_z
                ON l_b.parent_id = l_z.id
                LEFT JOIN crzb_list as l_r
                ON l_z.parent_id = l_r.id
                LEFT JOIN crzb_list as l_c
                ON l_r.parent_id = l_c.id

                WHERE mem_lk_crzb.linked_mem_type=1
                group by l_c.id`,
                function (error, result) {
                  if (error) {
                    err_hdl(error);
                  } else {
                    _.each(result, o => {
                      let f_ind = _.findIndex(countries, {
                        c_id: o.c_id
                      })
                      if (f_ind > -1) {
                        countries[f_ind]['sale'] = o.sale
                      }
                    })
                  }
                  resolve()
                });
            }
          })
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            countries
          })
        }
      })
    }
  })

})

router.get('/commission-count', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let data = {
        total_comm: 0,
        yearly_comm: 0,
        monthly_comm: 0
      }

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `SELECT SUM(amount) as comm FROM assign_roles_trans`,
          function (error, result) {
            if (error) {
              err_hdl(error);
              resolve()
            } else {
              data['total_comm'] = null_to_0(result[0].comm)

              let date = moment()
              let gen_start_year = date.clone().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
                gen_end_year = date.clone().endOf('year').format('YYYY-MM-DD HH:mm:ss')
              connection.query(
                `SELECT SUM(amount) as comm FROM assign_roles_trans
                WHERE created_at>='${gen_start_year}' AND created_at<='${gen_end_year}'`,
                function (error, result) {
                  if (error) {
                    err_hdl(error);
                    resolve()
                  } else {
                    data['yearly_comm'] = null_to_0(result[0].comm)
                    let gen_start_month = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                      gen_end_month = date.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss')
                    connection.query(
                      `SELECT SUM(amount) as comm FROM assign_roles_trans
                      WHERE created_at>='${gen_start_month}' AND created_at<='${gen_end_month}'`,
                      function (error, result) {
                        if (error) {
                          err_hdl(error);
                        } else {
                          data['monthly_comm'] = null_to_0(result[0].comm)
                        }
                        resolve()
                      })
                  }
                })
            }
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

router.get('/commission-region', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let regions = []

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `select 
            r_l.id as r_id,
            r_l.name as r_name,
            (select sum(amount) from assign_roles_trans where crzb_id=r_l.id) as r_comm,
            sum(zone.z_comm) as z_comm
            
          from crzb_list as r_l 
          join 
          (
            select 
              z_l.parent_id,
              (select sum(amount) from assign_roles_trans where crzb_id=z_l.id) as z_comm
            from crzb_list as z_l
            group by z_l.id
          ) as zone
          on r_l.id = zone.parent_id
          where r_l.type=1
          group by r_l.id
          order by r_l.id`,
          function (error, result) {
            if (error) {
              err_hdl(error);
              resolve()
            } else {
              _.each(result, o => {
                let p_item = {}
                p_item['r_id'] = o.r_id
                p_item['name'] = o.r_name
                p_item['comm'] = null_to_0(o.r_comm) + null_to_0(o.z_comm)
                regions.push(p_item)
              })
            }
            resolve()

          })
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            regions
          })
        }
      })
    }
  })

})

router.get('/commission-country', (req, res) => {

  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {

      let countries = []

      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          `select 
            c_l.id as c_id,
            c_l.name as c_name,
            c_l.type,
            (select sum(amount) from assign_roles_trans where crzb_id=c_l.id) as c_comm,
            sum(region.r_comm) as r_comm,
            sum(region.z_comm) as z_comm
          from crzb_list as c_l
          join (
            select 
              r_l.parent_id,
              (select sum(amount) from assign_roles_trans where crzb_id=r_l.id) as r_comm,
              sum(zone.z_comm) as z_comm
            from crzb_list as r_l 
            join 
              (
              select 
                z_l.parent_id,
                (select sum(amount) from assign_roles_trans where crzb_id=z_l.id) as z_comm
              from crzb_list as z_l
              group by z_l.id
              ) as zone
            on r_l.id = zone.parent_id
            where r_l.type=1
            group by r_l.id
          ) as region
          on c_l.id = region.parent_id
          where c_l.type=0
          group by c_l.id
          order by c_l.id`,
          function (error, result) {
            if (error) {
              err_hdl(error);
              resolve()
            } else {
              _.each(result, o => {
                let p_item = {}
                p_item['c_id'] = o.c_id
                p_item['c_name'] = o.c_name
                p_item['type'] = o.type
                p_item['comm'] = null_to_0(o.c_comm) + null_to_0(o.r_comm) + null_to_0(o.z_comm)
                countries.push(p_item)
              })
            }
            resolve()

          })
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            countries
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