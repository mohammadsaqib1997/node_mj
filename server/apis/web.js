const express = require('express')
const router = express.Router()

const db = require('../db.js')

const secret = require("./../config").secret
const jwt = require('jsonwebtoken')

router.post('/tokenLogin', (req, res) => {
  const token = req.body.token || req.query.token
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({ status: false, message: err.message });
      } else {
        return res.json({ status: true, token: token, user: decoded.data });
      }
    });

  } else {
    return res.json({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({ status: false, message: err.message });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.post('/check_email', (req, res) => {

  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.query('SELECT email FROM `members` where binary `email`=?', [req.body.email], function (error, results, fields) {
        if (error) {
          connection.release();
          sendDBError(res, error)
        } else {
          if (results.length > 0) {
            connection.release();
            res.json({ count: results.length })
          } else {
            connection.query('SELECT email FROM `moderators` where binary `email`=?', [req.body.email], function (error, results, fields) {
              if (error) {
                connection.release();
                sendDBError(res, error)
              } else {
                if (results.length > 0) {
                  connection.release();
                  res.json({ count: results.length })
                } else {
                  connection.query('SELECT email FROM `admins` where binary `email`=?', [req.body.email], function (error, results, fields) {
                    if (error) {
                      connection.release();
                      sendDBError(res, error)
                    } else {
                      connection.release();
                      res.json({ count: results.length })
                    }
                  })
                }
              }
            })
          }
        }

      });
    }
  })

})

router.post('/check_cont_num', (req, res) => {

  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.query('SELECT contact_num FROM `members` where binary `contact_num`=?', [req.body.cont_num], function (error, results, fields) {
        if (error) {
          connection.release();
          sendDBError(res, error)
        } else {
          if (results.length > 0) {
            connection.release();
            res.json({ count: results.length })
          } else {
            connection.query('SELECT contact_num FROM `moderators` where binary `contact_num`=?', [req.body.cont_num], function (error, results, fields) {
              if (error) {
                connection.release();
                sendDBError(res, error)
              } else {
                if (results.length > 0) {
                  connection.release();
                  res.json({ count: results.length })
                } else {
                  connection.query('SELECT contact_num FROM `admins` where binary `contact_num`=?', [req.body.cont_num], function (error, results, fields) {
                    connection.release();
                    if (error) {
                      sendDBError(res, error)
                    } else {
                      res.json({ count: results.length })
                    }
                  })
                }
              }
            })
          }
        }
      });
    }
  })

})

router.post('/check_ref_id', (req, res) => {

  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.query('SELECT user_asn_id, full_name FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
        connection.release();
        if (error) {
          sendDBError(res, error)
        } else {
          if (results.length > 0) {
            res.json({ count: results.length, user: results[0] })
          } else {
            res.json({ count: results.length })
          }
        }
      });
    }
  })

})

router.post('/login', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {

      connection.query(
        'SELECT id, email FROM `members` WHERE BINARY (`email`=? OR `user_asn_id`=?) AND BINARY `password`=?',
        [req.body.email, req.body.email, req.body.password],
        function (error, results, fields) {
          if (error) {
            connection.release();
            sendDBError(res, error)
          } else {
            if (results.length === 1) {
              connection.release();
              let token = tokenGen(results[0], 0)
              res.json({
                status: true,
                token: token,
                user: userData(results[0], 0)
              })
            } else {
              connection.query(
                'SELECT id, email FROM `moderators` WHERE BINARY `email`=? and BINARY `password`=?',
                [req.body.email, req.body.password],
                function (error, results, fields) {
                  if (error) {
                    connection.release();
                    sendDBError(res, error)
                  } else {
                    if (results.length === 1) {
                      connection.release();
                      let token = tokenGen(results[0], 1)
                      res.json({
                        status: true,
                        token: token,
                        user: userData(results[0], 1)
                      })
                    } else {
                      connection.query(
                        'SELECT id, email FROM `admins` where BINARY `email`=? and BINARY `password`=?',
                        [req.body.email, req.body.password],
                        function (error, results, fields) {
                          connection.release();
                          if (error) {
                            sendDBError(res, error)
                          } else {
                            if (results.length === 1) {
                              let token = tokenGen(results[0], 2)
                              res.json({
                                status: true,
                                token: token,
                                user: userData(results[0], 2)
                              })
                            } else {
                              res.json({
                                status: false,
                                message: "Invalid Credentials!"
                              })
                            }
                          }
                        })
                    }
                  }
                })
            }
          }
        })
    }
  })

})

router.post('/signup', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.beginTransaction(async function (err) {
        if (err) {
          connection.release();
          sendDBError(res, err)
        } else {
          let throw_error = null

          await new Promise(resolve => {
            req.body.member_data['active_sts'] = 1
            connection.query('INSERT INTO `members` SET ?', req.body.member_data, function (error, results, fields) {
              if (error) {
                throw_error = error
                return resolve()
              } else {
                let mem_id = results.insertId
                req.body.prd_data['member_id'] = mem_id
                req.body.bank_data['member_id'] = mem_id
                connection.query('INSERT INTO `user_product_details` SET ?', req.body.prd_data, function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    connection.query('INSERT INTO `user_bank_details` SET ?', req.body.bank_data, function (error, results, fields) {
                      if (error) {
                        throw_error = error
                        return resolve()
                      } else {
                        connection.query('INSERT INTO `notifications` SET ?', {
                          from_type: 0,
                          to_type: 1,
                          from_id: mem_id,
                          to_id: 1, // admin id
                          message: "New member added in members list. Approve it.",
                          notify_type: 1
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
              }
            })
          })

          if (throw_error) {
            return connection.rollback(function () {
              connection.release()
              sendDBError(res, throw_error)
            })
          } else {
            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  connection.release()
                  sendDBError(res, err)
                });
              } else {
                connection.release()
                res.json({ status: true })
              }
            })
          }
        }
      })
    }
  })
})

module.exports = router

function sendDBError(res, err) {
  res.status(500).json({
    success: false,
    message: "DB Error: " + err.message
  })
}

function tokenGen(data, type) {
  let token = jwt.sign({
    data: {
      email: data.email,
      user_id: data.id,
      type: type
    }
  },
    secret,
    {
      expiresIn: "1 days"
    })
  return token
}

function userData(data, type) {
  return {
    email: data.email,
    type: type,
    user_id: data.id
  }
}