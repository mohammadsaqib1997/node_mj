const express = require('express')
const router = express.Router()
const moment = require('moment')
const jwt = require('jsonwebtoken')
const config = require('../config')
const _ = require('lodash')

const db = require('../db.js')
const db_utils = require('../func/db-util.js')

router.get('/check/:token', function (req, res) {
  if (req.params.token !== "") {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {

        connection.query(
          `SELECT id, type, member_id, token_data, created_at
            FROM tokens
            WHERE binary token=? AND status<1`,
          req.params.token,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                let last_1_day = parseInt(moment().subtract(1, 'd').startOf('d').format('x'))
                let last_3_hours = parseInt(moment().subtract(3, 'h').format('x'))
                let result_date = parseInt(moment(result[0].created_at).format('x'))
                if (result[0].type === 0 && result_date > last_1_day) {
                  let token_id = result[0].id;
                  let mem_id = result[0].member_id

                  db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler
                    connection.query(
                      `UPDATE members SET ? WHERE id=${mem_id}`, {
                        email_v_sts: 1
                      },
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          connection.query(
                            `UPDATE tokens SET ? WHERE id=${token_id}`, {
                              status: 1
                            },
                            function (error, result) {
                              if (error) {
                                err_cb(error)
                              }
                              resolve()
                            }
                          )
                        }
                      }
                    )
                  }, function (error) { // this is finalize response handler
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        status: true,
                        type: 0
                      })
                    }
                  })

                } else if (result[0].type === 1 && result_date > last_3_hours) {
                  connection.release()
                  res.json({
                    status: true,
                    type: 1
                  })
                } else if (result[0].type === 2 && result_date > last_1_day) {
                  let token_id = result[0].id;
                  let mem_id = result[0].member_id

                  db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler
                    connection.query(
                      `UPDATE members SET ? WHERE id=${mem_id}`, {
                        email_v_sts: 1
                      },
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          connection.query(
                            `UPDATE tokens SET ? WHERE id=${token_id}`, {
                              status: 1
                            },
                            function (error, result) {
                              if (error) {
                                err_cb(error)
                                resolve()
                              } else {
                                connection.query(
                                  `UPDATE pincodes SET ? WHERE member_id=${mem_id}`, {
                                    active_sts: 1
                                  },
                                  function (error, result) {
                                    if (error) {
                                      err_cb(error)
                                    }
                                    resolve()
                                  }
                                )
                              }
                            }
                          )
                        }
                      }
                    )
                  }, function (error) { // this is finalize response handler
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        status: true,
                        type: 2
                      })
                    }
                  })

                } else if ((result[0].type === 3 || result[0].type === 4) && result_date > last_1_day) {
                  let token_id = result[0].id,
                    mem_id = result[0].member_id,
                    token_decode_err = null,
                    token_type = null


                  db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler
                    connection.query(
                      `UPDATE tokens SET ? WHERE id=${token_id}`, {
                        status: 1
                      },
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          jwt.verify(req.params.token, config.secret, function (err, decoded) {
                            if (err) {
                              token_decode_err = err
                              resolve()
                            } else {
                              let update_data = {
                                email_v_sts: 1
                              }
                              token_type = decoded.type

                              update_data = _.merge(update_data, decoded.data.form_data)

                              connection.query(
                                `UPDATE members SET ? WHERE id=${mem_id}`,
                                update_data,
                                function (error, result) {
                                  if (error) {
                                    err_cb(error)
                                    resolve()
                                  }
                                  resolve()
                                }
                              )
                            }
                          })
                        }
                      }
                    )
                  }, function (error) { // this is finalize response handler
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      if (token_decode_err) {
                        res.json({
                          status: false,
                          type: "Token Error: " + token_decode_err.message
                        })
                      } else {
                        res.json({
                          status: true,
                          type: token_type
                        })
                      }
                    }
                  })

                } else if (result[0].type === 5 && result_date > last_1_day) {
                  let token_id = result[0].id,
                    mem_id = result[0].member_id,
                    token_data = JSON.parse(result[0].token_data)

                  db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler
                    connection.query(
                      `UPDATE tokens SET ? WHERE id=${token_id}`, {
                        status: 1
                      },
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          connection.query(
                            `SELECT u_bk.id
                            FROM \`user_bank_details\` as u_bk
                            WHERE u_bk.member_id=${mem_id}`,
                            function (error, result) {
                              if (error) {
                                err_cb(error)
                                resolve()
                              } else {
                                let bk_query = ''
                                let params = []
                                if (result.length > 0) {
                                  bk_query = 'UPDATE user_bank_details SET ? WHERE member_id=?'
                                  params = [token_data, mem_id]
                                } else {
                                  bk_query = 'INSERT INTO user_bank_details SET ?'
                                  token_data['member_id'] = mem_id
                                  params = [token_data]
                                }
                                connection.query(bk_query, params, function (error, results, fields) {
                                  if (error) {
                                    err_cb(error)
                                  }
                                  resolve()
                                })
                              }
                            }
                          )
                        }
                      }
                    )
                  }, function (error) { // this is finalize response handler
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        status: true,
                        type: 5
                      })
                    }
                  })

                } else {
                  connection.release()
                  res.json({
                    status: false,
                    message: "Token Expire!"
                  })
                }
              } else {
                connection.release()
                res.json({
                  status: false,
                  message: "Invalid Token!"
                })
              }
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Request!"
    })
  }

})

router.post('/change-pass', function (req, res) {
  if (req.body.token && req.body.token !== "" && req.body.password && req.body.password !== "") {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.query(
          `SELECT id, member_id, created_at
            FROM tokens
            WHERE binary token=? AND status<1 AND type=1`,
          req.body.token,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                let last_3_hours = parseInt(moment().subtract(3, 'h').format('x'))
                let result_date = parseInt(moment(result[0].created_at).format('x'))
                if (result_date > last_3_hours) {
                  let token_id = result[0].id;
                  let mem_id = result[0].member_id
                  let new_pass = req.body.password
                  connection.beginTransaction(async function (error) {
                    if (error) {
                      connection.release()
                      res.status(500).json({
                        error
                      })
                    } else {
                      let throw_error = null

                      await new Promise(resolve => {
                        connection.query(
                          `UPDATE members SET ? WHERE id=${mem_id}`, {
                            email_v_sts: 1,
                            password: new_pass
                          },
                          function (error, result) {
                            if (error) {
                              throw_error = error
                              return resolve()
                            } else {
                              connection.query(
                                `UPDATE tokens SET ? WHERE id=${token_id}`, {
                                  status: 1
                                },
                                function (error, result) {
                                  if (error) {
                                    throw_error = error
                                  }
                                  return resolve()
                                }
                              )
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
                        })
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
                } else {
                  connection.release()
                  res.json({
                    status: false,
                    message: "Token Expired!"
                  })
                }
              } else {
                connection.release()
                res.json({
                  status: false,
                  message: "Invalid Request!"
                })
              }
            }
          })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }
})

router.get('/unsubscribe/:token', function (req, res) {
  if (req.params.token !== "") {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.query(
          `SELECT COUNT(*) as \`rows\`
            FROM subscribers
            WHERE binary unsubscribe_id=?`,
          req.params.token,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result['0'].rows > 0) {
                connection.query(
                  `DELETE FROM subscribers WHERE binary unsubscribe_id=?`,
                  req.params.token,
                  function (error, result) {
                    connection.release()
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      res.json({
                        status: true
                      })
                    }
                  }
                )
              } else {
                connection.release()
                res.json({
                  status: false,
                  message: "Invalid Token!"
                })
              }
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Request!"
    })
  }
})

module.exports = router