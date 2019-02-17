const express = require('express')
const router = express.Router()
const moment = require('moment')
const _ = require('lodash')

const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 0 || req.decoded.data.type === 2) {
    return next()
  } else {
    return res.status(500).json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/today-winners', (req, res) => {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let start_of_day = moment().startOf('d').format('YYYY-MM-DD HH:mm:ss')
      connection.query(
        `select 
            ld_w.group as ld_id,
            ld_w.created_at as win_at,
            m.user_asn_id,
            m.full_name,
            prd.name as prd_name
          from ld_winners as ld_w
          join members as m
          on ld_w.member_id = m.id
          join products as prd
          on ld_w.prd_id = prd.id

          where ld_w.created_at >= '${start_of_day}'
          
          order by ld_w.created_at desc
          
          limit 10`,
        function (error, result) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              result
            })
          }
        }
      )
    }
  })
})

router.use(function (req, res, next) {
  if (req.decoded.data.type === 2) {
    return next()
  } else {
    return res.status(500).json({
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
        limit = 5,
        load_grp = 5,
        groups_data = []
      let date = moment("2019-02-01"),
        start_at = date.startOf('d').format('YYYY-MM-DD HH:mm:ss')

      if (req.query.offset && /^[0-9]*$/.test(req.query.offset)) {
        offset = (parseInt(req.query.offset) % 5) === 0 ? parseInt(req.query.offset) : 0
      }

      connection.query(
        `SELECT 
          count(*) as tot_rows
        FROM hierarchy_m as hir 
        join members as mem
        on hir.member_id = mem.id
        join members as ref_mem
        on mem.ref_user_asn_id = ref_mem.user_asn_id
        join user_product_details as usr_prd
        on mem.id = usr_prd.member_id
        where 
          hir.created_at >= '${start_at}' and
          usr_prd.product_id = ${req.params.prd_type}
        order by hir.created_at`,
        async function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result.length ? result[0].tot_rows : 0
            let proc_rows = offset
            let grp_inc = offset / limit
            let err

            while (proc_rows < tot_rows) {
              if (groups_data.length >= load_grp) break
              proc_rows += limit
              // proc_rows = proc_rows > tot_rows ? tot_rows : proc_rows
              grp_inc++
              let exist_qrp = false
              await new Promise(resolve => {
                connection.query(
                  `SELECT \`group\` FROM ld_winners where prd_id=${req.params.prd_type} and \`group\`=${grp_inc} order by id desc limit 1`,
                  function (error, result) {
                    if (error) {
                      err = error
                    } else {
                      exist_qrp = result.length > 0
                    }
                    return resolve()
                  }
                )
              })
              if (err) break;

              if (exist_qrp) {
                continue
              }

              await new Promise(resolve => {
                connection.query(
                  `SELECT 
                    ref_mem.full_name,
                    ref_mem.user_asn_id,
                    mem.user_asn_id as lnk_mem_id,
                    hir.created_at as paid_at
                  FROM hierarchy_m as hir 
                  join members as mem
                  on hir.member_id = mem.id
                  join members as ref_mem
                  on mem.ref_user_asn_id = ref_mem.user_asn_id
                  join user_product_details as usr_prd
                  on mem.id = usr_prd.member_id
                  where 
                    hir.created_at >= '${start_at}' and
                    usr_prd.product_id = ${req.params.prd_type}
                  order by hir.created_at
                  limit ${limit}
                  offset ${proc_rows - limit}`,
                  function (error, result) {
                    if (error) {
                      err = error
                    } else {
                      groups_data.push({
                        group: grp_inc,
                        data: result
                      })
                    }
                    return resolve()
                  }
                )
              })

              if (err) break;
            }
            connection.release()
            if (err) {
              return res.status(500).json({
                error
              })
            } else {
              res.json({
                data: groups_data,
                tot_rows,
                last_offset: proc_rows
              })
            }
          }
        }
      )
    }
  })
})

router.get('/winner-list', function (req, res) {
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
          count(*) as tot_rows 
        from ld_winners as ld_w
        join members as m
        on ld_w.member_id = m.id
        join products as prd
        on ld_w.prd_id = prd.id
        ${(search !== '') ? 'where (ld_w.group like ? or prd.name like ? or m.user_asn_id like ? or m.full_name like ?)':''}`,
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result.length ? result[0].tot_rows : 0
            if (tot_rows < 1) {
              connection.release()
              return res.json({
                data: [],
                tot_rows: 0
              })
            } else {
              connection.query(
                `select 
                  ld_w.id,
                  ld_w.group,
                  ld_w.created_at,
                  m.user_asn_id,
                  m.full_name,
                  prd.name as prd_name
                from ld_winners as ld_w
                join members as m
                on ld_w.member_id = m.id
                join products as prd
                on ld_w.prd_id = prd.id
                
                ${(search !== '') ? 'where (ld_w.group like ? or prd.name like ? or m.user_asn_id like ? or m.full_name like ?)':''}
                
                order by ld_w.created_at desc
                
                limit ${limit}
                offset ${offset}`,
                [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
                function (error, result) {
                  connection.release()
                  if (error) {
                    return res.status(500).json({
                      error
                    })
                  } else {
                    res.json({
                      data: result,
                      tot_rows
                    })
                  }
                }
              )
            }
          }
        }
      )
    }
  })
})

router.get('/ld-detail/:id', (req, res) => {
  if (!req.params.id || !/^[0-9]*$/.test(req.params.id)) {
    return res.status(500).json({
      error: "Invalid Parameters!"
    })
  } else {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT * from ld_winners where id=?`,
          req.params.id,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result.length < 1) {
                connection.release()
                return res.status(500).json({
                  error: "Invalid ID!"
                })
              } else {
                let winner_mem_id = result[0].member_id
                let
                  limit = 5,
                  gourp = parseInt(result[0].group),
                  offset = (gourp - 1) * limit
                let date = moment("2019-02-01"),
                  start_at = date.startOf('d').format('YYYY-MM-DD HH:mm:ss')

                connection.query(
                  `SELECT 
                    ref_mem.id,
                    ref_mem.full_name,
                    ref_mem.user_asn_id,
                    mem.user_asn_id as lnk_mem_id,
                    hir.created_at
                  FROM hierarchy_m as hir 
                  join members as mem
                  on hir.member_id = mem.id
                  join members as ref_mem
                  on mem.ref_user_asn_id = ref_mem.user_asn_id
                  join user_product_details as usr_prd
                  on mem.id = usr_prd.member_id
                  where 
                    hir.created_at >= '${start_at}' and 
                    usr_prd.product_id = ${result[0].prd_id}
                  order by hir.created_at
                  limit ${limit}
                  offset ${offset}`,
                  function (error, result) {
                    connection.release()
                    if (error) {
                      return res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        data: result,
                        winner: {
                          mj_id: _.find(result, {
                            id: winner_mem_id
                          }).user_asn_id,
                          grp_id: gourp
                        }
                      })
                    }
                  }
                )
              }
            }
          }
        )
      }
    })
  }
})

router.post('/spin/:prd_type/:grp_pg', (req, res) => {
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
      let ld_date = moment("2019-02-01"),
        start_at = ld_date.startOf('d').format('YYYY-MM-DD HH:mm:ss'),
        last_win_start_date = moment().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss')

      // check members in group
      connection.query(
        `SELECT 
          ref_mem.id,
          ref_mem.full_name,
          ref_mem.user_asn_id
        FROM hierarchy_m as hir 
        join members as mem
        on hir.member_id = mem.id
        join members as ref_mem
        on mem.ref_user_asn_id = ref_mem.user_asn_id
        join user_product_details as usr_prd
        on mem.id = usr_prd.member_id
        where 
          hir.created_at >= '${start_at}' and 
          usr_prd.product_id = ${req.params.prd_type}
        order by hir.created_at
        limit ${limit}
        offset ${offset}`,
        async function (error, results) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            if (results.length < 5) {
              connection.release()
              return res.json({
                status: false,
                message: "Invalid Spin!"
              })
            } else {
              let err

              // check gourp already spin or not
              let ald_spin = false
              await new Promise(resolve => {
                connection.query(
                  `SELECT \`group\`
                  FROM ld_winners 
                  where 
                    \`group\`=${req.params.grp_pg} and
                    prd_id=${req.params.prd_type}
                  limit 1`,
                  function (error, result) {
                    if (error) {
                      err = error
                    } else {
                      if (result.length > 0) {
                        ald_spin = true
                      }
                    }
                    return resolve()
                  }
                )
              })
              if (err) {
                connection.release()
                return res.status(500).json({
                  err
                })
              } else if (ald_spin) {
                connection.release()
                return res.json({
                  status: false,
                  message: "This group is already spinned!"
                })
              }

              // check group member already win in last day
              let mem_ids = _.map(_.uniqBy(results, 'id'), o => {
                return o.id
              })
              let last_win_mem_ids = []
              await new Promise(resolve => {
                connection.query(
                  `SELECT member_id
                  FROM ld_winners 
                  where 
                    member_id in(${mem_ids.join(', ')}) and
                    created_at >= '${last_win_start_date}'`,
                  function (error, result) {
                    if (error) {
                      err = error
                    } else {
                      if (result.length > 0) {
                        last_win_mem_ids = _.map(result, o => {
                          return o.member_id
                        })
                      }
                    }
                    return resolve()
                  }
                )
              })
              if (err) {
                connection.release()
                return res.status(500).json({
                  err
                })
              }

              // all validation done select winner
              let mem_get_ls = _.reject(mem_ids, id => {
                return _.indexOf(last_win_mem_ids, id) > -1
              })
              let sel_mem_ids = mem_get_ls.length > 0 ? mem_get_ls : mem_ids
              let random_ind = _.random(0, sel_mem_ids.length - 1)
              let winner_mem_id = sel_mem_ids[random_ind]

              connection.query(
                `insert into ld_winners set ?`, {
                  member_id: winner_mem_id,
                  group: req.params.grp_pg,
                  prd_id: req.params.prd_type
                },
                function (error) {
                  connection.release()
                  if (error) {
                    return res.status(500).json({
                      error
                    })
                  } else {
                    res.json({
                      status: true
                    })
                  }
                }
              )
            }
          }
        })
    }
  })
})

module.exports = router