const express = require('express')
const router = express.Router()

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
        `SELECT COUNT(*) as tot_rows 
        FROM assign_roles as as_role
        left join members as m
        on as_role.member_id = m.id
        left join crzb_list as crzb_l
        on as_role.crzb_id = crzb_l.id
        where m.full_name like '%${search}%' OR crzb_l.name like '%${search}%';`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `SELECT as_role.*, m.full_name, crzb_l.name 
                FROM assign_roles as as_role
                left join members as m
                on as_role.member_id = m.id
                left join crzb_list as crzb_l
                on as_role.crzb_id = crzb_l.id
                where m.full_name like '%${search}%' OR crzb_l.name like '%${search}%'
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

router.get('/exist-check/:crzb_id', (req, res) => {
  if (req.params.crzb_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let query = `SELECT COUNT(*) as count FROM assign_roles where crzb_id=${req.params.crzb_id} AND role_status=1`
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
          crzb_id: req.body.sel_crzb_id
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

router.post('/toggle-status', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, async function (resolve, err_hdl) {

          if (req.body.change_sts === 1) {
            let throw_err = null
            await new Promise(in_resolve => {
              connection.query(
                `SELECT id FROM assign_roles WHERE crzb_id=${req.body.crzb_id} AND role_status=1 LIMIT 1`,
                function (error, result) {
                  if (error) {
                    throw_err = error
                    in_resolve()
                  } else {
                    if (result.length > 0 && result[0].id !== null) {
                      let old_asn_id = result[0].id

                      connection.query(
                        `UPDATE assign_roles SET ? WHERE id=${old_asn_id}`, {
                          role_status: 0
                        },
                        function (error, result) {
                          if (error) {
                            throw_err = error
                          }
                          console.log("this", result)
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