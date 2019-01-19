const express = require('express')
const router = express.Router()

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

router.get('/list/:branch_id', function (req, res) {
  if (!/^[0-9]*$/.test(req.params.branch_id)) {
    return res.status(500).json({
      error: "Invalid Branch ID!"
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
        `SELECT COUNT(*) as tot_rows 
        from assign_role_fr as asn_fr
        left join members as m
        on asn_fr.member_id = m.id
        join (
          select 
            fr.*,
            get_franchise_rd_code(fr.id) as fr_code
          from franchises as fr
        ) as fr
        on asn_fr.fr_id = fr.id
        join (
          select 
            crzb_l.id,
            get_crzb_with_p_name(crzb_l.id) as name
          from crzb_list as crzb_l
        ) as crzb_var
        on fr.branch_id = crzb_var.id
        
        where fr.branch_id=${req.params.branch_id} and (
          asn_fr.id like '%${search}%' or
          m.user_asn_id like '%${search}%' or
          m.full_name like '%${search}%' or
          fr.name like '%${search}%' or
          fr.fr_code collate utf8mb4_general_ci like '%${search}%' or
          crzb_var.name collate utf8mb4_general_ci like '%${search}%'
        )`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `select 
                  asn_fr.id,
                  asn_fr.role_status,
                  m.user_asn_id,
                  m.full_name,
                  fr.fr_code,
                  fr.id as fr_id,
                  fr.name as fr_name,
                  crzb_var.id as br_id,
                  crzb_var.name as br_name
                from assign_role_fr as asn_fr
                left join members as m
                on asn_fr.member_id = m.id
                join (
                  select 
                    fr.*,
                    get_franchise_rd_code(fr.id) as fr_code
                  from franchises as fr
                ) as fr
                on asn_fr.fr_id = fr.id
                join (
                  select 
                    crzb_l.id,
                    get_crzb_with_p_name(crzb_l.id) as name
                  from crzb_list as crzb_l
                ) as crzb_var
                on fr.branch_id = crzb_var.id
                
                where fr.branch_id=${req.params.branch_id} and (
                  asn_fr.id like '%${search}%' or
                  m.user_asn_id like '%${search}%' or
                  m.full_name like '%${search}%' or
                  fr.name like '%${search}%' or
                  fr.fr_code collate utf8mb4_general_ci like '%${search}%' or
                  crzb_var.name collate utf8mb4_general_ci like '%${search}%'
                )
                
                ORDER BY asn_fr.id DESC
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

router.get('/get-fr-list/:branch_id', (req, res) => {
  if (req.params.branch_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `select 
              fr.id,
              fr.name
            from franchises as fr
            
            where fr.branch_id=${req.params.branch_id} and fr.active=1`,
          function (error, result) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                result
              })
            }
          });
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }

})

router.post('/get-user-check', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query(
        'SELECT id, full_name FROM `members` where (binary `email`=? OR binary `user_asn_id`=?) AND is_paid_m=1',
        [req.body.email, req.body.email],
        function (error, results, fields) {
          if (error) {
            connection.release();
            res.status(500).json({
              error
            })
          } else {
            if (results.length > 0) {
              let user_data = results[0]
              connection.query(
                `SELECT COUNT(*) as count FROM assign_roles WHERE member_id=${user_data.id} and role_status=1`,
                function (error, result) {
                  connection.release();
                  if (error) {
                    res.status(500).json({
                      error
                    })
                  } else {
                    if (result[0].count > 0) {
                      res.json({
                        status: false,
                        message: "This user is already assigned parent!"
                      })
                    } else {
                      res.json({
                        result: user_data
                      })
                    }
                  }
                })
            } else {
              connection.release();
              res.json({
                status: false,
                message: "Invalid User!"
              })
            }
          }
        });
    }
  })
})

router.post('/assign', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, async function (resolve, err_hdl) {
          let frn_ids = req.body.fr_ids,
            thr_err = null

          for (fr_id of frn_ids) {
            // check franchise id already assign this member id but role status 0
            let skip = false
            await new Promise(inn_res => {
              connection.query(
                `update assign_role_fr set role_status=0 where fr_id=${fr_id} and member_id<>${req.body.mem_id} and role_status=1`,
                function (error) {
                  if (error) {
                    thr_err = error
                    inn_res()
                  } else {
                    connection.query(
                      `select member_id, role_status from assign_role_fr where fr_id=${fr_id} and member_id=${req.body.mem_id}`,
                      function (error, result) {
                        if (error) {
                          thr_err = error
                          inn_res()
                        } else {
                          if (!result.length) {
                            inn_res()
                          } else {
                            if (result[0].role_status == 1) {
                              skip = true
                              inn_res()
                            } else {
                              connection.query(
                                `update assign_role_fr set role_status=1 where fr_id=${fr_id} and member_id=${req.body.mem_id} and role_status=0`,
                                function (error) {
                                  if (error) {
                                    thr_err = error
                                  }
                                  skip = true
                                  inn_res()
                                })
                            }
                          }
                        }
                      })
                  }
                })

            })
            if (thr_err) break
            if (skip) continue

            await new Promise(inn_res => {
              connection.query(
                `insert into assign_role_fr set ?`, {
                  fr_id,
                  member_id: req.body.mem_id
                },
                function (error) {
                  if (error) {
                    thr_err = error
                  }
                  inn_res()
                }
              )
            })
            if (thr_err) break
          }

          if (thr_err) {
            err_hdl(err_hdl)
          }
          resolve()

        },
        function (error) {
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              status: true
            })
          }
        })
    }
  })
})

router.post('/toggle-status', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, async function (resolve, err_hdl) {

          if (req.body.change_sts == true) {
            let throw_err = null
            await new Promise(in_resolve => {
              connection.query(
                `SELECT COUNT(*) as tot_rows FROM assign_role_fr WHERE fr_id=${req.body.fr_id} AND role_status=1`,
                function (error, result) {
                  if (error) {
                    throw_err = error
                    in_resolve()
                  } else {
                    if (result[0].tot_rows > 0) {
                      connection.query(
                        `UPDATE assign_role_fr SET ? WHERE fr_id=${req.body.fr_id} AND role_status=1`, {
                          role_status: 0
                        },
                        function (error, result) {
                          if (error) {
                            throw_err = error
                          }
                          in_resolve()
                        }
                      )
                    } else {
                      in_resolve()
                    }
                  }
                }
              )
            })
            if (throw_err) {
              err_hdl(throw_err)
              resolve()
            }
          }


          connection.query(
            `UPDATE assign_role_fr SET ? WHERE id=${req.body.row_id}`, {
              role_status: req.body.change_sts
            },
            function (error) {
              if (error) {
                err_hdl(error)
              }
              resolve()
            }
          )
        },
        function (error) {
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              status: true
            })
          }
        })
    }
  })
})



module.exports = router