const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const trans_email = require('../e-conf.js')

const db = require('../db.js')

router.post('/verify', function (req, res) {
  if (req.decoded.data.type === 0) {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.beginTransaction(async function (error) {
          if (error) {
            connection.release();
            res.status(500).json({
              error
            })
          } else {
            let throw_error = null

            let temp_data = {}
            let send_email = null

            await new Promise(resolve => {
              connection.query(
                `SELECT full_name, email FROM members WHERE id=${req.decoded.data.user_id}`,
                function (error, result) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    temp_data['name'] = result[0].full_name
                    send_email = result[0].email
                    temp_data['token'] = jwt.sign({
                        data: {
                          email: result[0].email,
                          user_id: req.decoded.data.user_id,
                          type: 0
                        }
                      },
                      config.secret, {
                        expiresIn: "3 days"
                      }
                    )
                    connection.query(
                      `INSERT INTO tokens SET ?`, {
                        type: 0,
                        member_id: req.decoded.data.user_id,
                        token: temp_data['token']
                      },
                      function (error, result) {
                        if (error) {
                          throw_error = error
                          return resolve()
                        } else {
                          if (send_email !== null) {
                            res.render("verify-token", {
                              host: config.dev ? 'http://127.0.0.1:3000' : 'http://mj-supreme.com',
                              name: temp_data.name,
                              token: temp_data.token
                            }, function (errPug, html) {
                              if (errPug) {
                                throw_error = errPug
                                return resolve()
                              }
                              trans_email.sendMail({
                                from: '"MJ Supreme" <info@mj-supreme.com>',
                                to: send_email,
                                subject: 'Verification Token',
                                html: html
                              }, function (err, info) {
                                if (err) {
                                  throw_error = err
                                }
                                return resolve()
                              })
                            })
                          } else {
                            throw_error = new Error('Email not found!')
                            return resolve()
                          }
                        }
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