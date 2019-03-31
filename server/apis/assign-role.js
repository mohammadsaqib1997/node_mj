const express = require('express')
const router = express.Router()

const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 2 || req.decoded.data.type === 0) {
    return next()
  } else {
    return res.json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/crct-head-info', function (req, res) {
  if (req.decoded.data.type === 2) {
    res.json({
      type: 5,
      hod_mem_id: req.decoded.data.user_id,
      hod_id: 1,
      role_status: 1
    })
  } else {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `select 
              asn_role.member_id, 
              crzb_l.id as crzb_id,
              crzb_l.type as crzb_type,
              asn_role.role_status
            from assign_roles as asn_role 
            join crzb_list as crzb_l
            on asn_role.crzb_id = crzb_l.id
            where asn_role.member_id=${req.decoded.data.user_id}`,
          function (error, result) {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                res.json({
                  type: result[0].crzb_type,
                  hod_mem_id: result[0].member_id,
                  hod_id: result[0].crzb_id,
                  role_status: result[0].role_status
                })
              } else {
                res.json({
                  type: null,
                  hod_mem_id: null,
                  hod_id: null,
                  role_status: 0
                })
              }
            }
          })
      }
    })
  }
})

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

router.get('/list', function (req, res) {
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
            asn_role.*,
            crzb_l.*,
            m.user_asn_id as mj_id,
            m.full_name as mj_name
          from assign_roles as asn_role
          join (
          select 
            ls1.id as crzb_l_id, ls1.name, ls1.type, concat(if(ls3.rd_id is null, "", concat(ls3.rd_id, "-")), if(ls2.rd_id is null, "", concat(ls2.rd_id, "-")), ls1.rd_id) as code
          from crzb_list as ls1
              left join crzb_list as ls2
              on ls1.parent_id = ls2.id
              left join crzb_list as ls3
              on ls2.parent_id = ls3.id
          ) as crzb_l
          on asn_role.crzb_id = crzb_l.crzb_l_id
          join members as m
          on asn_role.member_id = m.id
        ) as tbl
        where tbl.name like '%${search}%' or tbl.code like '%${search}%' or tbl.mj_id like '%${search}%' or tbl.mj_name like '%${search}%'`,
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
                tbl.id,
                tbl.crzb_id,
                tbl.role_status,
                tbl.name,
                tbl.type,
                tbl.code,
                tbl.mj_id,
                tbl.mj_name
                from (
                select 
                  asn_role.*,
                  crzb_l.*,
                  m.user_asn_id as mj_id,
                  m.full_name as mj_name
                from assign_roles as asn_role
                join (
                  select 
                    ls1.id as crzb_l_id, 
                        ls1.name, 
                        ls1.type, 
                        concat(if(ls3.rd_id is null, "", concat(ls3.rd_id, "-")), if(ls2.rd_id is null, "", concat(ls2.rd_id, "-")), ls1.rd_id) as code
                  from crzb_list as ls1
                  left join crzb_list as ls2
                  on ls1.parent_id = ls2.id
                  left join crzb_list as ls3
                  on ls2.parent_id = ls3.id
                ) as crzb_l
                on asn_role.crzb_id = crzb_l.crzb_l_id
                join members as m
                on asn_role.member_id = m.id
              ) as tbl
              where tbl.name like '%${search}%' or tbl.code like '%${search}%' or tbl.mj_id like '%${search}%' or tbl.mj_name like '%${search}%'
              ORDER BY id DESC
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

router.get('/exist-check/:crz_id', (req, res) => {
  if (req.params.crz_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let query = `SELECT COUNT(*) as count FROM assign_roles where crzb_id=${req.params.crz_id} AND role_status=1`
        connection.query(query, function (error, result) {
          connection.release();
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (result[0].count > 0) {
              res.json({
                count: result[0].count
              })
            } else {
              res.json({
                count: 0
              })
            }
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
                `SELECT COUNT(*) as count FROM assign_roles WHERE member_id=${user_data.id}`,
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
                        message: "This user is already assigned role!"
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
      connection.query(
        'INSERT INTO `assign_roles` SET ?', {
          member_id: req.body.mem_id,
          crzb_id: req.body.sel_crz_id
        },
        function (error, results) {
          connection.release();
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              status: true
            })
          }
        });
    }
  })
})

router.post('/update-row', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, async function (resolve, err_hdl) {

          let throw_err = null
          await new Promise(in_resolve => {
            connection.query(
              `SELECT COUNT(*) as tot_rows FROM assign_roles WHERE crzb_id=${req.body.crz_id} AND role_status=1`,
              function (error, result) {
                if (error) {
                  throw_err = error
                  in_resolve()
                } else {
                  if (result[0].tot_rows > 0) {
                    connection.query(
                      `UPDATE assign_roles SET ? WHERE crzb_id=${req.body.crz_id} AND role_status=1`, {
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

          connection.query(
            `UPDATE assign_roles SET ? WHERE id=${req.body.updated_id}`, {
              crzb_id: req.body.crz_id,
              role_status: 1
            },
            function (error, results) {
              if (error) {
                err_hdl(error)
              }
              resolve()
            });
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
                `SELECT COUNT(*) as tot_rows FROM assign_roles WHERE crzb_id=${req.body.crz_id} AND role_status=1`,
                function (error, result) {
                  if (error) {
                    throw_err = error
                    in_resolve()
                  } else {
                    if (result[0].tot_rows > 0) {
                      connection.query(
                        `UPDATE assign_roles SET ? WHERE crzb_id=${req.body.crz_id} AND role_status=1`, {
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
            `UPDATE assign_roles SET ? WHERE id=${req.body.row_id}`, {
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