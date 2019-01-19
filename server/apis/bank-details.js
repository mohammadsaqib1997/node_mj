const express = require('express')
const router = express.Router()
const _ = require('lodash')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const config = require('../config')
const trans_email = require('../e-conf.js')

const db = require('../db.js')

router.get("/:id", function (req, res, next) {

  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error
        })
      } else {
        connection.query('SELECT account_number, account_title, address, bank_name, branch_code, iban_number FROM `user_bank_details` WHERE member_id=?', req.params.id, function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: (results.length > 0) ? results[0] : {}
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.post("/update", function (req, res) {
  if (req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error
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
                `SELECT u_bk.id, m.email 
                FROM \`members\` as m
                LEFT JOIN \`user_bank_details\` as u_bk
                ON m.id=u_bk.member_id
                WHERE m.id=?`,
                req.decoded.data.user_id,
                function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    let bk_query = ''
                    let params = []
                    let save_data = _.cloneDeep(req.body.data)
                    delete save_data['secure']
                    if (results.length > 0 && results[0].id !== null) {
                      bk_query = 'UPDATE user_bank_details SET ? WHERE member_id=?'
                      params = [save_data, req.decoded.data.user_id]
                    } else {
                      bk_query = 'INSERT INTO user_bank_details SET ?'
                      save_data['member_id'] = req.decoded.data.user_id
                      params = [save_data]
                    }

                    if (req.body.data['secure'] === true) {
                      let send_email = results[0].email
                      let token = jwt.sign({
                        data: {
                          user_id: req.decoded.data.user_id,
                          u_id: shortId.generate(),
                          type: 5
                        }
                      }, config.secret, {
                        expiresIn: "1 day"
                      })
                      connection.query(
                        `INSERT INTO tokens SET ?`, {
                          type: 5,
                          member_id: req.decoded.data.user_id,
                          token: token,
                          token_data: JSON.stringify(save_data)
                        },
                        function (error, results) {
                          if (error) {
                            throw_error = error
                            return resolve()
                          } else {
                            res.render("verify-token", {
                              host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                              name: "Member",
                              token: token
                            }, function (errPug, html) {
                              if (errPug) {
                                throw_error = errPug
                                return resolve()
                              } else {
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
                              }
                            })
                          }
                        })

                    } else {
                      connection.query(bk_query, params, function (error, results, fields) {
                        if (error) {
                          throw_error = error
                          return resolve()
                        } else {
                          return resolve()
                        }
                      })
                    }
                  }
                });
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
      message: "Invalid User!"
    })
  }
})

module.exports = router