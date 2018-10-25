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
        let last_3_days = moment().subtract(3, 'd').startOf('d').format('YYYY-MM-DD HH-mm-ss')
        connection.query(
          `SELECT id, type, member_id
            FROM tokens
            WHERE token=? AND status<1 AND created_at>'${last_3_days}'`,
          req.params.token,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                if (result[0].type === 0) {
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
                } else {
                  connection.release()
                  res.json({
                    status: true,
                    type: result[0].type
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

module.exports = router