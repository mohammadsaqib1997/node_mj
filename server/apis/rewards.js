const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')

router.get("/list_req", function (req, res) {
  if (req.decoded.data.type > 0) {
    let offset = 0,
      limit = 10,
      search = "",
      filter_qry = ""
    if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
      limit = req.query.limit
    }

    if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
      offset = (parseInt(req.query.page) - 1) * limit
    }

    if (req.query.search) {
      search = req.query.search
    }

    if (/^(auto)$|^[0-9]$/.test(req.query.filter)) {
      if (/^(auto)$/.test(req.query.filter)) {
        filter_qry = `AND clm_rwds.type=0`
      } else {
        filter_qry = `AND clm_rwds.level=${req.query.filter}`
      }
    }

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT COUNT(*) as total_rows 
                    FROM claim_rewards as clm_rwds
                    LEFT JOIN members as m
                    ON clm_rwds.member_id = m.id
                    WHERE clm_rwds.status=0
                    ${(filter_qry !== '') ? filter_qry: ''}
                    ${(search !== '') ? 'AND (m.user_asn_id LIKE ? OR m.email LIKE ?)' : ''}
                    `,
          ['%' + search + '%', '%' + search + '%'],
          function (error, results, fields) {
            if (error) {
              connection.release();
              res.status(500).json({
                error
              })
            } else {
              let rows_count = results[0].total_rows
              if (rows_count > 0) {

                connection.query(
                  `SELECT
                                    clm_rwds.id,
                                    clm_rwds.type,
                                    clm_rwds.level,
                                    clm_rwds.reward_selected,
                                    m.user_asn_id, 
                                    m.email
                                    FROM claim_rewards as clm_rwds 
                                    LEFT JOIN members as m
                                    ON clm_rwds.member_id=m.id
                                    WHERE clm_rwds.status=0
                                    ${(filter_qry !== '') ? filter_qry: ''}
                                    ${(search !== '') ? 'AND (m.user_asn_id LIKE ? OR m.email LIKE ?)' : ''}
                                    ORDER BY clm_rwds.id DESC
                                    LIMIT ${limit}
                                    OFFSET ${offset}`,
                  ['%' + search + '%', '%' + search + '%'],
                  function (error, results, fields) {
                    connection.release();
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        data: results,
                        total_rows: rows_count
                      })
                    }
                  }
                );

              } else {
                connection.release();
                res.json({
                  data: [],
                  total_rows: rows_count
                })
              }
            }
          })
      }
    })


  } else {
    res.json({
      status: false,
      message: "Permission Denied!"
    })
  }
})

router.get("/list_comp", function (req, res) {
  if (req.decoded.data.type > 0) {
    let offset = 0,
      limit = 10,
      search = "",
      filter_qry = ""
    if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
      limit = req.query.limit
    }

    if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
      offset = (parseInt(req.query.page) - 1) * limit
    }

    if (req.query.search) {
      search = req.query.search
    }

    if (/^(auto)$|^[0-9]$/.test(req.query.filter)) {
      if (/^(auto)$/.test(req.query.filter)) {
        filter_qry = `AND clm_rwds.type=0`
      } else {
        filter_qry = `AND clm_rwds.level=${req.query.filter}`
      }
    }

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT COUNT(*) as total_rows 
                    FROM claim_rewards as clm_rwds
                    LEFT JOIN members as m
                    ON clm_rwds.member_id = m.id
                    WHERE clm_rwds.status=1
                    ${(filter_qry !== '') ? filter_qry: ''}
                    ${(search !== '') ? 'AND (m.user_asn_id LIKE ? OR m.email LIKE ?)' : ''}
                    `,
          ['%' + search + '%', '%' + search + '%'],
          function (error, results, fields) {
            if (error) {
              connection.release();
              res.status(500).json({
                error
              })
            } else {
              let rows_count = results[0].total_rows
              if (rows_count > 0) {

                connection.query(
                  `SELECT
                                    clm_rwds.id,
                                    clm_rwds.type,
                                    clm_rwds.level,
                                    clm_rwds.reward_selected,
                                    m.user_asn_id, 
                                    m.email
                                    FROM claim_rewards as clm_rwds 
                                    LEFT JOIN members as m
                                    ON clm_rwds.member_id=m.id
                                    WHERE clm_rwds.status=1
                                    ${(filter_qry !== '') ? filter_qry: ''}
                                    ${(search !== '') ? 'AND (m.user_asn_id LIKE ? OR m.email LIKE ?)' : ''}
                                    ORDER BY clm_rwds.id DESC
                                    LIMIT ${limit}
                                    OFFSET ${offset}`,
                  ['%' + search + '%', '%' + search + '%'],
                  function (error, results, fields) {
                    connection.release();
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        data: results,
                        total_rows: rows_count
                      })
                    }
                  }
                );

              } else {
                connection.release();
                res.json({
                  data: [],
                  total_rows: rows_count
                })
              }
            }
          })
      }
    })


  } else {
    res.json({
      status: false,
      message: "Permission Denied!"
    })
  }
})

router.get("/auto_rwds", function (req, res, next) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT * FROM claim_rewards WHERE member_id=? AND type=0 AND status<>2`,
          req.decoded.data.user_id,
          function (error, results, fields) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                results
              })
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
    })
  }
})

router.get("/self_rwds", function (req, res, next) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT * FROM claim_rewards WHERE member_id=? AND type=1 AND status<>2`,
          req.decoded.data.user_id,
          function (error, results, fields) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                results
              })
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
    })
  }
})

router.post('/claim', function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.beginTransaction(async function (err) {
          if (err) {
            connection.release()
            res.status(500).json({
              err
            })
          } else {
            let throw_error = null

            await new Promise(resolve => {
              let params = {
                member_id: req.decoded.data.user_id,
                level: req.body.level
              }
              if (req.body.is_self && req.body.is_self === 1) {
                params['type'] = 1
                params['reward_selected'] = 0
              } else {
                params['reward_selected'] = req.body.reward_selected
              }
              connection.query(
                `INSERT INTO claim_rewards SET ?`,
                params,
                function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    let insert_clm_id = results.insertId
                    connection.query(`SELECT user_asn_id, email FROM members WHERE id=${req.decoded.data.user_id}`, function (error, result) {
                      if (error) {
                        throw_error = error
                        return resolve()
                      } else {
                        connection.query('INSERT INTO `notifications` SET ?', {
                          from_type: 0,
                          from_txt: result[0].email,
                          to_type: 1,
                          from_id: req.decoded.data.user_id,
                          to_id: 1,
                          message: `${(params.type) ? 'Self': 'Auto'} Reward Request From User ID ${result[0].user_asn_id} Reward Level -> ${req.body.level == 0 ? 'You': req.body.level}`,
                          notify_type: 3,
                          ref_id: insert_clm_id
                        }, function (error, results, fields) {
                          if (error) {
                            throw_error = error
                          }
                          return resolve()
                        })
                      }
                    })
                  }
                })

            })

            if (throw_error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({
                  throw_error
                })
              });
            } else {
              connection.commit(function (err) {
                if (err) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({
                      err
                    })
                  });
                } else {
                  connection.release()
                  res.json({
                    status: true
                  })
                }
              })
            }


          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
    })
  }
})

router.post("/sts_change", function (req, res) {
  if (req.decoded.data.type > 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.beginTransaction(async function (err) {
          if (err) {
            connection.release()
            res.status(500).json({
              err
            })
          } else {
            let throw_error = null

            await new Promise(resolve => {
              connection.query(
                'SELECT member_id, level, type FROM claim_rewards WHERE id=?',
                req.body.clm_id,
                function (error, results) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    let rwd_type = results[0].type
                    let member_id = results[0].member_id
                    let notify_msg = `Your ${rwd_type==1 ? 'Self':'Auto'} Reward Request has been ${req.body.sts === 1 ? 'Accepted' : 'Canceled'} Reward Level -> ${results[0].level == 0 ? 'You': results[0].level}.`,
                      params = {
                        status: req.body.sts
                      }

                    if (req.body.sts === 2) {
                      notify_msg += " Reason is: " + req.body.reason
                      params['cancel_reason'] = req.body.reason
                    } else {
                      params['approved_at'] = moment().format('YYYY-MM-DD HH-mm-ss')
                    }

                    connection.query(
                      `UPDATE claim_rewards SET ? WHERE id=?`,
                      [
                        params,
                        req.body.clm_id
                      ],
                      function (error, results, fields) {
                        if (error) {
                          throw_error = error
                          return resolve()
                        } else {

                          connection.query('INSERT INTO `notifications` SET ?', {
                            from_type: 1,
                            from_txt: "Admin",
                            to_type: 0,
                            from_id: 1,
                            to_id: member_id,
                            message: notify_msg,
                            notify_type: 0
                          }, function (error, results, fields) {
                            if (error) {
                              throw_error = error
                            }
                            return resolve()
                          })

                        }
                      })
                  }
                }
              )
            })

            if (throw_error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({
                  throw_error
                })
              });
            } else {
              connection.commit(function (err) {
                if (err) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({
                      err
                    })
                  });
                } else {
                  connection.release()
                  res.json({
                    status: true
                  })
                }
              })
            }
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Permission Denied!"
    })
  }
})

module.exports = router