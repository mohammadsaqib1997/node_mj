const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')

router.get('/check/:token', function (req, res) {
  if (req.params.token !== "") {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {

        connection.query(
          `SELECT id, type, member_id, created_at
            FROM tokens
            WHERE token=? AND status<1`,
          req.params.token,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                let last_3_days = parseInt(moment().subtract(3, 'd').startOf('d').format('x'))
                let last_3_hours = parseInt(moment().subtract(3, 'h').format('x'))
                let result_date = parseInt(moment(result[0].created_at).format('x'))
                if (result[0].type === 0 && result_date > last_3_days) {
                  let token_id = result[0].id;
                  let mem_id = result[0].member_id
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
                            email_v_sts: 1
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
                              status: true,
                              type: 0
                            })
                          }
                        })
                      }

                    }
                  })
                } else if (result[0].type === 1 && result_date > last_3_hours) {
                  connection.release()
                  res.json({
                    status: true,
                    type: result[0].type
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
            WHERE token=? AND status<1 AND type=1`,
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

module.exports = router