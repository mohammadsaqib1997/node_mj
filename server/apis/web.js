const express = require('express')
const router = express.Router()

const db = require('../db.js')

const secret = require("./../config").secret
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const gm = require('gm')

router.get("/pk", function (req, res) {
  let data = JSON.parse(fs.readFileSync(__dirname + '/../files/pk.json', 'utf8'))
  let new_data = _.map(data, o => {
    return o.city
  })
  new_data.sort()
  res.json({
    cities: new_data
  })
})

router.post('/tokenLogin', (req, res) => {
  const token = req.body.token || req.query.token
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({
          status: false,
          message: err.message
        });
      } else {
        db.getConnection(function (error, connection) {
          if (error) {
            return res.status(500).json({
              error
            });
          } else {
            let table = 'members',
              colm = "`email`, `is_paid_m`"
            if (decoded.data.type === 1) {
              table = 'moderators'
              colm = "`email`"
            } else if (decoded.data.type === 2) {
              table = 'admins'
              colm = "`email`"
            }
            connection.query(
              `SELECT ${colm} FROM ${table} WHERE id=?`,
              decoded.data.user_id,
              function (error, result) {
                connection.release()
                if (error) {
                  return res.status(500).json({
                    error
                  });
                } else {
                  let user = {
                    user_id: decoded.data.user_id,
                    email: result[0].email,
                    type: decoded.data.type
                  }
                  if (decoded.data.type === 0) {
                    user['is_paid'] = result[0].is_paid_m
                  }
                  return res.json({
                    status: true,
                    token: token,
                    user
                  });
                }
              })
          }
        })
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
        return res.json({
          status: false,
          message: err.message
        });
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

router.get('/get_list_winners_auto', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 15,
        date = moment(),
        startM = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss"),
        endM = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      let throw_error = null
      let tot_rows = 0

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows
          FROM claim_rewards as clm
          WHERE clm.type=0 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
          `,
          function (error, result) {
            if (error) {
              throw_error = error
            } else {
              tot_rows = result[0].tot_rows
            }
            resolve()
          })
      })

      if (throw_error !== null) {
        connection.release()
        return res.status(500).json({
          error: throw_error
        })
      }

      connection.query(
        `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
        FROM claim_rewards as clm
        JOIN members as m
        ON clm.member_id=m.id
        JOIN info_var_m as i_var
        ON m.id=i_var.member_id
        LEFT JOIN u_images as u_img
        ON m.id=u_img.user_id AND u_img.user_type=0
        WHERE clm.type=0 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
        ORDER BY clm.approved_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
        `,
        function (error, result) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              result,
              tot_rows
            })
          }
        })
    }
  })
})

router.get('/get_list_winners_self', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 15,
        date = moment(),
        startM = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss"),
        endM = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      let throw_error = null
      let tot_rows = 0

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows
          FROM claim_rewards as clm
          WHERE clm.type=1 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
          `,
          function (error, result) {
            if (error) {
              throw_error = error
            } else {
              tot_rows = result[0].tot_rows
            }
            resolve()
          })
      })

      if (throw_error !== null) {
        connection.release()
        return res.status(500).json({
          error: throw_error
        })
      }

      connection.query(
        `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
        FROM claim_rewards as clm
        JOIN members as m
        ON clm.member_id=m.id
        JOIN info_var_m as i_var
        ON m.id=i_var.member_id
        LEFT JOIN u_images as u_img
        ON m.id=u_img.user_id AND u_img.user_type=0
        WHERE clm.type=1 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
        ORDER BY clm.approved_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
        `,
        function (error, result) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              result,
              tot_rows
            })
          }
        })
    }
  })
})

router.get('/get_winners', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let throw_error = null,
        data = {
          auto_rewards: [],
          self_rewards: []
        }

      await new Promise(resolve => {
        connection.query(
          `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
          FROM claim_rewards as clm
          JOIN members as m
          ON clm.member_id=m.id
          JOIN info_var_m as i_var
          ON m.id=i_var.member_id
          LEFT JOIN u_images as u_img
          ON m.id=u_img.user_id AND u_img.user_type=0
          WHERE clm.type=0 AND clm.status=1
          ORDER BY clm.approved_at DESC
          LIMIT 4
          `,
          function (error, results, fields) {
            if (error) {
              throw_error = error
            } else {
              data['auto_rewards'] = results
            }
            return resolve()
          })
      })

      if (throw_error !== null) {
        connection.release();
        return res.status(500).json({
          err: throw_error
        })
      }

      await new Promise(resolve => {
        connection.query(
          `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
          FROM claim_rewards as clm
          JOIN members as m
          ON clm.member_id=m.id
          JOIN info_var_m as i_var
          ON m.id=i_var.member_id
          LEFT JOIN u_images as u_img
          ON m.id=u_img.user_id AND u_img.user_type=0
          WHERE clm.type=1 AND clm.status=1
          ORDER BY clm.approved_at DESC
          LIMIT 4
          `,
          function (error, results, fields) {
            if (error) {
              throw_error = error
            } else {
              data['self_rewards'] = results
            }
            return resolve()
          })
      })

      if (throw_error !== null) {
        connection.release();
        res.status(500).json({
          err: throw_error
        })
      } else {
        connection.release();
        res.json({
          data
        })
      }

    }
  })
})

router.get('/list_partner', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 12,
        search = ""

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      if (req.query.search) {
        search = req.query.search
      }

      connection.query(
        `SELECT COUNT(*) as total_rows 
        FROM partners
        ${(search !== '') ? 'WHERE': ''}
        ${(search !== '') ? '(discount LIKE ? OR full_name LIKE ? OR city LIKE ?)' : ''}`,
        [
          '%' + search + '%',
          '%' + search + '%',
          '%' + search + '%'
        ],
        function (error, results, fields) {
          if (error) {
            connection.release();
            res.status(500).json({
              error
            })
          } else {
            let rows_count = results[0].total_rows
            connection.query(
              `SELECT full_name, email, discount, cont_num, city, address, logo
              FROM partners
              ${(search !== '') ? 'WHERE': ''}
              ${(search !== '') ? '(discount LIKE ? OR full_name LIKE ? OR city LIKE ?)' : ''}
              ORDER BY id ASC
              LIMIT ${limit}
              OFFSET ${offset}`,
              [
                '%' + search + '%',
                '%' + search + '%',
                '%' + search + '%'
              ],
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
            )
          }
        }
      )
    }
  })
})

router.get('/partner/logo/:file_name', function (req, res) {
  if (req.params.file_name !== '') {
    if (fs.existsSync(__dirname + "/../uploads/partners_logo/" + req.params.file_name)) {
      gm(__dirname + '/../uploads/partners_logo/' + req.params.file_name)
        .gravity('Center')
        .background('transparent')
        .resize(320, 320)
        .extent(320, 320)
        .stream('jpg', function (err, stdout, stderr) {
          if (err) return res.status(404).json({
            message: "Not Found!"
          })
          stdout.pipe(res)

          stdout.on('error', function (err) {
            return res.status(404).json({
              message: "Not Found!"
            })
          });
        })
    } else {
      res.status(404).json({
        message: 'Not found!'
      })
    }
  } else {
    res.status(404).json({
      message: 'Not found!'
    })
  }
});

router.get('/user/img/:file_name', function (req, res) {
  if (req.params.file_name !== '') {
    if (fs.existsSync(__dirname + "/../uploads/profile/" + req.params.file_name)) {
      gm(__dirname + '/../uploads/profile/' + req.params.file_name)
        .gravity('Center')
        .background('transparent')
        .resize(180, 180)
        .extent(180, 180)
        .stream('jpg', function (err, stdout, stderr) {
          if (err) return res.status(404).json({
            message: "Not Found!"
          })
          stdout.pipe(res)

          stdout.on('error', function (err) {
            return res.status(404).json({
              message: "Not Found!"
            })
          });
        })
    } else {
      res.status(404).json({
        message: 'Not found!'
      })
    }
  } else {
    res.status(404).json({
      message: 'Not found!'
    })
  }
});

router.get('/user/thumb/:file_name', function (req, res) {
  if (req.params.file_name !== '') {
    if (fs.existsSync(__dirname + "/../uploads/profile/" + req.params.file_name)) {
      gm(__dirname + '/../uploads/profile/' + req.params.file_name)
        .gravity('Center')
        .background('transparent')
        .resize(50, 50)
        .extent(50, 50)
        .stream('jpg', function (err, stdout, stderr) {
          if (err) return res.status(404).json({
            message: "Not Found!"
          })
          stdout.pipe(res)

          stdout.on('error', function (err) {
            return res.status(404).json({
              message: "Not Found!"
            })
          });
        })
    } else {
      res.status(404).json({
        message: 'Not found!'
      })
    }
  } else {
    res.status(404).json({
      message: 'Not found!'
    })
  }
});

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
            res.json({
              count: results.length
            })
          } else {
            connection.query('SELECT email FROM `moderators` where binary `email`=?', [req.body.email], function (error, results, fields) {
              if (error) {
                connection.release();
                sendDBError(res, error)
              } else {
                if (results.length > 0) {
                  connection.release();
                  res.json({
                    count: results.length
                  })
                } else {
                  connection.query('SELECT email FROM `admins` where binary `email`=?', [req.body.email], function (error, results, fields) {
                    if (error) {
                      connection.release();
                      sendDBError(res, error)
                    } else {
                      connection.release();
                      res.json({
                        count: results.length
                      })
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
            res.json({
              count: results.length,
              user: results[0]
            })
          } else {
            res.json({
              count: results.length
            })
          }
        }
      });
    }
  })

})

router.post("/admin/login", (req, res) => {
  db.getConnection(async function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      let throw_error = null
      let resp = null

      // moderator check
      await new Promise(resolve => {
        connection.query(
          'SELECT id, email, active_sts FROM `moderators` WHERE BINARY `email`=? and BINARY `password`=?',
          [req.body.email, req.body.password],
          function (error, results) {
            if (error) {
              throw_error = error;
              return resolve()
            } else {
              if (results.length === 1) {
                if (results[0].active_sts === 1) {
                  resp = {
                    status: true,
                    token: tokenGen(results[0], 1),
                    user: userData(results[0], 1)
                  }
                } else {
                  resp = {
                    status: false,
                    message: "Your account has bees Suspended. Contact your administrator."
                  }
                }
              }
              return resolve()
            }
          })
      })

      if (resp) {
        connection.release();
        return res.json(resp)
      } else if (throw_error) {
        connection.release();
        return sendDBError(res, throw_error)
      }

      // admin check
      await new Promise(resolve => {
        connection.query(
          'SELECT id, email FROM `admins` where BINARY `email`=? and BINARY `password`=?',
          [req.body.email, req.body.password],
          function (error, results) {
            if (error) {
              throw_error = error;
              return resolve()
            } else {
              if (results.length === 1) {
                resp = {
                  status: true,
                  token: tokenGen(results[0], 2),
                  user: userData(results[0], 2)
                }
              } else {
                resp = {
                  status: false,
                  message: "Sorry, the specified combination do not match. Reset your credentials if required."
                }
              }
              return resolve()
            }
          })
      })

      if (resp) {
        connection.release();
        return res.json(resp)
      } else if (throw_error) {
        connection.release();
        return sendDBError(res, throw_error)
      }
    }
  })
})

router.post('/login', (req, res) => {
  db.getConnection(async function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      let throw_error = null
      let resp = null

      // member check
      await new Promise(resolve => {
        connection.query(
          'SELECT id, email, active_sts, is_paid_m FROM `members` WHERE BINARY (`email`=? OR `user_asn_id`=?) AND BINARY `password`=?',
          [req.body.email, req.body.email, req.body.password],
          function (error, results) {
            if (error) {
              throw_error = error;
              return resolve()
            } else {
              if (results.length === 1) {
                if (results[0].active_sts === 1) {
                  user = userData(results[0], 0)
                  user['is_paid'] = results[0].is_paid_m
                  resp = {
                    status: true,
                    token: tokenGen(results[0], 0),
                    user
                  }
                } else {
                  resp = {
                    status: false,
                    message: "Your account has bees Suspended. Contact your administrator."
                  }
                }
              } else {
                resp = {
                  status: false,
                  message: "Sorry, the specified combination do not match. Reset your credentials if required."
                }
              }
              return resolve()
            }
          })
      })

      if (resp) {
        connection.release();
        return res.json(resp)
      } else if (throw_error) {
        connection.release();
        return sendDBError(res, throw_error)
      }

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

                connection.query(`INSERT INTO terms_accept SET member_id=${mem_id}, accept_sts=1`, function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
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
    secret, {
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