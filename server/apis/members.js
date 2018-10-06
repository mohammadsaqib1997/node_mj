const express = require('express')
const router = express.Router()
const _ = require('lodash')
const moment = require("moment")

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../uploads/receipts')
  },
  filename: function (req, file, cb) {
    let date = Date.now()
    if (req.body.type == 0)
      req.body.id = date
    cb(null, date + typeGet(file.mimetype))
  }
})
const upload = multer({
  storage
})


const db = require('../db.js')

router.get("/", function (req, res) {
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


  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query(
        `SELECT COUNT(*) as total_rows FROM members ${(search !== '') ? 'WHERE user_asn_id LIKE ? OR email LIKE ? OR full_name LIKE ?' : ''}`,
        ['%' + search + '%', '%' + search + '%', '%' + search + '%'],
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
                  m.id, 
                  m.user_asn_id, 
                  m.email, 
                  m.full_name, 
                  m.active_sts, 
                  m.is_paid_m, 
                  COUNT(ur.id) as tot_rcp_up 
                FROM members as m
                LEFT JOIN user_receipts as ur
                ON m.id=ur.ref_id AND ur.type=0 
                ${(search !== '') ? 'WHERE m.user_asn_id LIKE ? OR m.email LIKE ? OR m.full_name LIKE ?' : ''}
                GROUP BY m.id
                ORDER BY m.id DESC
                LIMIT ${limit}
                OFFSET ${offset}`,
                ['%' + search + '%', '%' + search + '%', '%' + search + '%'],
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
})

router.get("/get_terms_sts", (req, res) => {
  if (req.decoded.data.user_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT accept_sts FROM terms_accept WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let accept_sts = 0
            if (results.length > 0) {
              accept_sts = results[0].accept_sts
            }
            res.json({
              accept_sts
            })
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.post("/terms_accept", (req, res) => {
  if (req.decoded.data.user_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT accept_sts FROM terms_accept WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let query = 0
            if (results.length > 0) {
              query = `UPDATE terms_accept SET accept_sts=1 WHERE member_id=${req.decoded.data.user_id}`
            } else {
              query = `INSERT INTO terms_accept SET member_id=${req.decoded.data.user_id}, accept_sts=1`
            }

            connection.query(query, function (error, result) {
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
            })
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.get('/get_level_info', function (req, res) {
  if (req.decoded.data.user_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT h_childs_count FROM info_var_m WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (results.length > 0) {
              res.json({
                child_count: results[0].h_childs_count
              })
            } else {
              res.json({
                status: false,
                message: "You are not active member!"
              })
            }
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.get('/wallet/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT wallet
        FROM info_var_m
        WHERE member_id=?
        `
        }

        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let wallet = 0
            if (results.length > 0) {
              wallet = results[0].wallet
            }
            res.json({
              data: wallet
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.get('/user_info/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT direct_ref_count, in_direct_ref_count, level, package_act_date, wallet
        FROM info_var_m
        WHERE member_id=?
        `
        }
        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let data = {}
            if (results.length > 0) {
              data = results[0]
            }
            res.json({
              data
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.get('/get_referrals/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    let grab_months = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {},
      11: {},
      12: {},
    }

    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        let throw_error = null
        let user_asn_id = null
        let mem_id = req.params.id

        await new Promise(resolve => {
          connection.query('SELECT id, user_asn_id FROM members WHERE id=?', mem_id, function (error, results) {
            if (error) {
              throw_error = error
            } else {
              if (results.length > 0 && results[0].user_asn_id !== null) {
                user_asn_id = results[0].user_asn_id
              }
            }
            resolve()
          })
        })

        if (user_asn_id) {
          let date = moment().set('M', 0).set('Y', moment().get('Y') - 1).endOf('Y')
          for (month in grab_months) {
            await new Promise(resolve => {
              date.add(1, 'month')
              let start = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss")
              let end = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

              connection.query('SELECT COUNT(*) as count FROM members WHERE ref_user_asn_id = ? AND is_paid_m = 1 AND created_at >= ? AND created_at <= ?', [user_asn_id, start, end], function (error, results) {
                if (error) {
                  throw_error = error
                  resolve()
                } else {
                  grab_months[month]['paid'] = results[0].count

                  connection.query('SELECT COUNT(*) as count FROM members WHERE ref_user_asn_id = ? AND is_paid_m = 0 AND created_at >= ? AND created_at <= ?', [user_asn_id, start, end], function (error, results) {
                    if (error) {
                      throw_error = error
                      resolve()
                    } else {
                      grab_months[month]['un_paid'] = results[0].count
                      resolve()
                    }
                  })
                }
              })
            })

            if (throw_error) {
              break
            }
          }
        }
        connection.release();

        if (throw_error) {
          res.status(500).json({
            error: throw_error
          })
        } else {
          res.json({
            data: grab_months
          })
        }



      }
    })
  } else {
    next()
  }
})

router.get("/user_id/:id", function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT user_asn_id
        FROM members
        WHERE id=?
        `
        }
        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (results.length > 0 && results[0].user_asn_id !== null) {
              res.json({
                user_asn_id: results[0].user_asn_id
              })
            } else {
              res.status(404).json({
                message: "Not Found Id!"
              })
            }
          }
        });
      }
    })
  } else {
    next()
  }
})

router.get("/:id", function (req, res, next) {

  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT m.*, upd.buyer_pay_type, upd.buyer_qty_prd, upd.buyer_type, upd.product_id, upd.id
        FROM members AS m
        LEFT JOIN user_product_details as upd
        ON m.id=upd.member_id
        WHERE m.id=?
        `,
          nestTables: true
        }

        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: results
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.post("/add_referral", function (req, res) {
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
            connection.query('SELECT COUNT(*) as count FROM members WHERE id=? AND user_asn_id=?', [req.decoded.data.user_id, req.body.member_data.ref_user_asn_id], function (error, results, fields) {
              if (error) {
                throw_error = error
                resolve()
              } else {
                if (results[0].count > 0) {

                  // deduct amount from wallet
                  connection.query('SELECT wallet FROM `info_var_m` WHERE member_id=?', req.decoded.data.user_id, function (error, results, fields) {
                    if (error) {
                      throw_error = error
                      return resolve()
                    } else {

                      if (results.length > 0 && parseInt(results[0].wallet) >= 5000) {

                        let set_w_params = {
                          wallet: parseInt(results[0].wallet) - 5000
                        }
                        connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [set_w_params, req.decoded.data.user_id], function (error, results, fields) {
                          if (error) {
                            throw_error = error
                            return resolve()
                          } else {

                            // grab last user asn id
                            connection.query('SELECT user_asn_id FROM `members` ORDER BY user_asn_id DESC LIMIT 1', function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve()
                              } else {
                                req.body.member_data['is_paid_m'] = 1
                                req.body.member_data['active_sts'] = 1

                                // id increament with last id
                                let new_inc = (parseInt(results[0].user_asn_id) + 1).toString()
                                new_inc = (new_inc.length < 9) ? ("000000000" + new_inc).substr(-9, 9) : new_inc
                                req.body.member_data['user_asn_id'] = new_inc

                                // insert member for new data
                                connection.query('INSERT INTO members SET ?', req.body.member_data, function (error, results, fields) {
                                  if (error) {
                                    throw_error = error
                                    return resolve()
                                  } else {
                                    let mem_id = results.insertId
                                    req.body.prd_data['member_id'] = mem_id
                                    connection.query('INSERT INTO `user_product_details` SET ?', req.body.prd_data, function (error, results, fields) {
                                      if (error) {
                                        throw_error = error
                                        return resolve()
                                      } else {

                                        connection.query('INSERT INTO `transactions_m` SET ?', {
                                          member_id: req.decoded.data.user_id,
                                          remarks: "Create New Referral Fees Deduct Amount In Your Wallet - User ID " + req.body.member_data['user_asn_id'],
                                          credit: 5000
                                        }, function (error, results, fields) {
                                          if (error) {
                                            throw_error = error
                                            return resolve()
                                          } else {

                                            connection.query('INSERT INTO `notifications` SET ?', {
                                              from_type: 1,
                                              to_type: 0,
                                              from_id: 1,
                                              to_id: req.decoded.data.user_id,
                                              message: "Create New Referral Fees Deduct Amount In Your Wallet - User ID " + req.body.member_data['user_asn_id'],
                                              notify_type: 0
                                            }, function (error, results, fields) {
                                              if (error) {
                                                throw_error = error
                                                return resolve()
                                              } else {
                                                after_paid_member(connection, mem_id, req.body.member_data['user_asn_id'], function (err) {
                                                  if (err) {
                                                    throw_error = err
                                                  }
                                                  resolve()
                                                })
                                              }

                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      } else {
                        throw_error = "You have not Rs. 5000/- in your wallet!"
                        return resolve()
                      }
                    }
                  })
                } else {
                  throw_error = "Not valid user!"
                  resolve()
                }
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
})

router.post('/mjIdCheck', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT user_asn_id FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            count: results.length
          })
        }

      });
    }
  })
})

router.post('/add', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release()
          res.status(500).json({
            err
          })
        } else {
          connection.query('INSERT INTO `members` SET ?', req.body.member_data, function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({
                  error
                })
              })
            } else {
              let mem_id = results.insertId
              req.body.prd_data['member_id'] = mem_id
              connection.query('INSERT INTO `user_product_details` SET ?', req.body.prd_data, function (error, results, fields) {
                if (error) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({
                      error
                    })
                  })
                } else {

                  if (_.get(req.body.member_data, 'is_paid_m', 0) === 1) {

                    after_paid_member(connection, mem_id, req.body.member_data.user_asn_id, function (err) {
                      if (err) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({
                            err
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
          });
        }
      })

    }
  })

})

router.post('/update', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release()
          res.status(500).json({
            err
          })
        } else {
          connection.query('UPDATE `members` SET ? WHERE id=?', [req.body.member_data, req.body.update_id], function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({
                  error
                })
              })
            } else {

              connection.query('SELECT id FROM user_product_details WHERE member_id=?', [req.body.update_id], function (error, results, fields) {
                if (error) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({
                      error
                    })
                  })
                } else {
                  let query = 'UPDATE `user_product_details` SET ? WHERE member_id=?'
                  let params = [req.body.prd_data, req.body.update_id]

                  if (results.length < 1) {
                    query = 'INSERT INTO `user_product_details` SET ?'
                    params = [req.body.prd_data]
                  }

                  connection.query(query, params, function (error, results, fields) {
                    if (error) {
                      return connection.rollback(function () {
                        connection.release()
                        res.status(500).json({
                          error
                        })
                      })
                    } else {

                      if (_.get(req.body.member_data, 'is_paid_m', 0) === 1) {

                        after_paid_member(connection, req.body.update_id, req.body.member_data.user_asn_id, function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({
                                err
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
            }
          });
        }
      })

    }
  })

})

router.post('/receipt_add', upload.single('receipt'), function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('INSERT INTO `user_receipts` SET ?', req.body, function (error, results, fields) {
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
      })
    }
  })
})

router.post('/pay_user', function (req, res) {
  if (/^[0-9]*$/.test(req.body.id)) {

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let mem_id = req.body.id

        connection.beginTransaction(async function (err) {
          if (err) {
            connection.release()
            res.status(500).json({
              err
            })
          } else {

            // grab last user asn id
            connection.query('SELECT user_asn_id FROM `members` ORDER BY user_asn_id DESC LIMIT 1', function (error, results, fields) {
              if (error) {
                return connection.rollback(function () {
                  connection.release()
                  res.status(500).json({
                    error
                  })
                })
              } else {

                let params_set = {
                  is_paid_m: 1
                }
                // if not find it first id assign
                if (results[0].user_asn_id === null) {
                  params_set['user_asn_id'] = '000010001'
                } else {
                  // id increament with last id
                  let new_inc = (parseInt(results[0].user_asn_id) + 1).toString()
                  new_inc = (new_inc.length < 9) ? ("000000000" + new_inc).substr(-9, 9) : new_inc
                  params_set['user_asn_id'] = new_inc
                }

                // first change status is_paid_m=1 and assign id
                connection.query('UPDATE `members` SET ? WHERE id=?', [params_set, mem_id], function (error, results, fields) {
                  if (error) {
                    return connection.rollback(function () {
                      connection.release()
                      res.status(500).json({
                        error
                      })
                    })
                  } else {

                    after_paid_member(connection, mem_id, params_set['user_asn_id'], function (err) {
                      if (err) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({
                            err
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
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: 'Invalid parameters!'
    })
  }

})

module.exports = router

function typeGet(mimetype) {
  let type = ""
  if (mimetype === "image/png") {
    type = ".png"
  }
  if (mimetype === "image/jpeg") {
    type = ".jpg"
  }
  return type
}

async function after_paid_member(connection, mem_id, mem_asn_id, cb) {
  let throw_error = null
  // initial amount wallet company
  let add_to_c_wallet = 5000

  await new Promise(resolve => {
    // apply fees - transaction
    connection.query('INSERT INTO `transactions_comp` SET ?', {
      remarks: "Activation Fees From User ID " + mem_asn_id,
      debit: add_to_c_wallet
    }, function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        connection.query('INSERT INTO `notifications` SET ?', {
          from_type: 0,
          to_type: 1,
          from_id: mem_id,
          to_id: 1,
          message: "Activation Fees From User ID " + mem_asn_id,
          notify_type: 0
        }, function (error, results, fields) {
          if (error) {
            throw_error = error
          }
          return resolve()
        })
      }
    })
  })

  if (throw_error) {
    return cb(throw_error)
  }

  await new Promise(resolve => {
    // insert member variable
    connection.query('INSERT INTO `info_var_m` SET ?', {
      member_id: mem_id
    }, async function (error, results, fields) {
      if (error) {
        throw_error = error
      }
      return resolve()
    })
  })

  if (throw_error) {
    return cb(throw_error)
  }

  await new Promise(resolve => {
    // count and add in hierarchy and assign parent id here
    connection.query('SELECT COUNT(*) AS total_rows FROM `hierarchy_m`', function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        let h_params = {
          id: results[0].total_rows + 1,
          member_id: mem_id,
          parent_id: Math.ceil(results[0].total_rows / 4)
        }
        let grab_parent_ids = [h_params.parent_id]

        // insert hierarchy tree member
        connection.query('INSERT INTO `hierarchy_m` SET ?', h_params, async function (error, results, fields) {
          if (error) {
            throw_error = error
            return resolve()
          } else {

            // here is parents level increament
            for (parent_id of grab_parent_ids) {
              let exist_row = true

              await new Promise(resolve2 => {
                if (parent_id > 0) {

                  // select hierarchy id and grab row
                  connection.query('SELECT member_id, parent_id FROM `hierarchy_m` WHERE id=?', parent_id, function (error, results, fields) {
                    if (error) {
                      throw_error = error
                      return resolve2()
                    } else {
                      // found the parent id and next parent id grab
                      if (results.length > 0) {
                        if (results[0].parent_id > 0) {
                          grab_parent_ids.push(results[0].parent_id)
                        }

                        // select parent selected info variables
                        connection.query('SELECT * FROM `info_var_m` WHERE member_id=?', results[0].member_id, function (error, results, fields) {
                          if (error) {
                            throw_error = error
                            return resolve2()
                          } else {
                            let old_level = results[0].level
                            let i_mem_id = results[0].member_id

                            // update the info variables
                            let set_info_params = {
                              h_childs_count: parseInt(results[0].h_childs_count) + 1,
                              level: get_level(parseInt(results[0].h_childs_count) + 1)
                            }
                            connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_info_params, i_mem_id], function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve2()
                              } else {
                                if (old_level < set_info_params.level) {
                                  connection.query('INSERT INTO `notifications` SET ?', {
                                    from_type: 1,
                                    to_type: 0,
                                    from_id: 1,
                                    to_id: i_mem_id,
                                    from_txt: 'Admin',
                                    message: "Successfully Upgrade Your Level Up -> " + set_info_params.level,
                                    notify_type: 0
                                  }, function (error, results, fields) {
                                    if (error) {
                                      throw_error = error
                                    }
                                    return resolve2()
                                  })
                                } else {
                                  return resolve2()
                                }

                              }
                            })

                          }
                        })
                      } else {
                        exist_row = false
                        return resolve2()
                      }
                    }
                  })
                } else {
                  exist_row = false
                  return resolve2()
                }
              })
              if (throw_error || exist_row === false) break
            }
            return resolve()
          }
        })

      }
    })
  })

  if (throw_error) {
    return cb(throw_error)
  }


  // now finance goes here
  await new Promise(resolve => {
    // select ref user and apply comissions and set wallet and direct or indirect count increament
    connection.query('SELECT user_asn_id, ref_user_asn_id FROM `members` WHERE id=?', mem_id, async function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        if (results[0].ref_user_asn_id !== null) {
          let grab_ref_usr_ids = [results[0].ref_user_asn_id]

          let direct_inc = 0
          for (ref_usr_asn_id of grab_ref_usr_ids) {
            await new Promise(resolve2 => {

              connection.query(
                `SELECT m.id, m.full_name, m.ref_user_asn_id , iv.direct_ref_count, iv.in_direct_ref_count, iv.wallet, iv.level
                FROM \`members\` as m
                LEFT JOIN info_var_m as iv
                ON m.id = iv.member_id
                WHERE user_asn_id=?`,
                ref_usr_asn_id,
                function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve2()
                  } else {
                    if (results[0].ref_user_asn_id !== null) {
                      grab_ref_usr_ids.push(results[0].ref_user_asn_id)
                    }

                    let ref_mem_id = results[0].id

                    direct_inc++
                    let set_param = {}
                    let commission_amount = 0

                    if (direct_inc === 1) {
                      set_param['direct_ref_count'] = parseInt(results[0].direct_ref_count) + 1
                      commission_amount = 1000
                      set_param['wallet'] = parseInt(results[0].wallet) + commission_amount

                    } else if (direct_inc === 2) {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                      commission_amount = 300
                      set_param['wallet'] = parseInt(results[0].wallet) + commission_amount

                    } else if (direct_inc <= 9) {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                      commission_amount = 200
                      set_param['wallet'] = parseInt(results[0].wallet) + 200

                    } else {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                    }

                    connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_param, ref_mem_id], function (error, results, fields) {
                      if (error) {
                        throw_error = error
                        return resolve2()
                      } else {

                        // notify query add direct or indirect
                        connection.query('INSERT INTO `notifications` SET ?', {
                          from_type: 1,
                          to_type: 0,
                          from_id: 1,
                          to_id: ref_mem_id,
                          from_txt: 'Admin',
                          message: `Add Your ${(direct_inc === 1) ? 'Direct' : 'In-Direct'} Refferral in Hierarchy - User ID ${mem_asn_id}`,
                          notify_type: 0
                        }, function (error, results, fields) {
                          if (error) {
                            throw_error = error
                            return resolve2()
                          } else {
                            if (commission_amount > 0) {

                              add_to_c_wallet = add_to_c_wallet - commission_amount

                              // apply commission - transaction
                              connection.query('INSERT INTO `transactions_m` SET ?', {
                                member_id: ref_mem_id,
                                remarks: "Issued Commission From User ID " + mem_asn_id,
                                debit: commission_amount
                              }, function (error, results, fields) {
                                if (error) {
                                  throw_error = error
                                  return resolve2()
                                } else {
                                  // notify query issued commission to user
                                  connection.query('INSERT INTO `notifications` SET ?', {
                                    from_type: 1,
                                    to_type: 0,
                                    from_id: 1,
                                    to_id: ref_mem_id,
                                    from_txt: 'Admin',
                                    message: "Issued Commission From User ID " + mem_asn_id + " Amount Rs." + commission_amount + "/-",
                                    notify_type: 0
                                  }, function (error, results, fields) {
                                    if (error) {
                                      throw_error = error
                                      return resolve2()
                                    } else {

                                      // transaction insert in company
                                      connection.query('INSERT INTO `transactions_comp` SET ?', {
                                        remarks: "Issued Commission To User ID " + ref_usr_asn_id,
                                        credit: commission_amount
                                      }, function (error, results, fields) {
                                        if (error) {
                                          throw_error = error
                                          return resolve2()
                                        } else {
                                          // notify admin issued commission to user
                                          connection.query('INSERT INTO `notifications` SET ?', {
                                            from_type: 0,
                                            to_type: 1,
                                            from_id: ref_mem_id,
                                            to_id: 1,
                                            message: "Issued Commission To User ID " + ref_usr_asn_id + " Amount Rs." + commission_amount + "/-",
                                            notify_type: 0
                                          }, function (error, results, fields) {
                                            if (error) {
                                              throw_error = error
                                            }
                                            return resolve2()
                                          })
                                        }
                                      })
                                    }
                                  })
                                }
                              })

                            } else {
                              return resolve2()
                            }
                          }
                        })
                      }
                    })

                  }
                }
              )
            })
            if (throw_error) break
          }
          return resolve()

        } else {
          return resolve()
        }
      }
    })
  })

  if (throw_error) {
    return cb(throw_error)
  }

  // add amount to company wallet after all commission issued
  await new Promise(resolve => {
    connection.query('SELECT wallet FROM company_var WHERE id=1', function (error, results) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        let is_add = add_to_c_wallet > 0 ? true : false
        let g_wallet = parseInt(results[0].wallet) + (add_to_c_wallet)

        connection.query('UPDATE company_var SET wallet=? WHERE id=1', g_wallet, function (error, results) {
          if (error) {
            throw_error = error
            return resolve()
          } else {
            if (add_to_c_wallet > 0 || add_to_c_wallet < 0) {
              // notify admin after pay member and wallet amount add or deduct
              connection.query('INSERT INTO `notifications` SET ?', {
                from_type: 0,
                to_type: 1,
                from_id: mem_id,
                to_id: 1,
                message: `${(is_add) ? "Add" : "Deduct"} Amount Rs.${add_to_c_wallet}/- From Wallet After Paid Member.`,
                notify_type: 0
              }, function (error, results, fields) {
                if (error) {
                  throw_error = error
                }
                return resolve()
              })
            } else {
              return resolve()
            }
          }
        })
      }
    })
  })

  if (throw_error) {
    return cb(throw_error)
  }

  // notify paid member after paid
  await new Promise(resolve => {
    connection.query('INSERT INTO `notifications` SET ?', {
      from_type: 1,
      to_type: 0,
      from_id: 1,
      to_id: mem_id,
      from_txt: "Admin",
      message: `Your Payment Has Been Approved.`,
      notify_type: 0
    }, function (error, results, fields) {
      if (error) {
        throw_error = error
      }
      return resolve()
    })
  })

  return cb(throw_error)
}

function get_level(childs) {
  let level = 0,
    l_rows = 1,
    c_rows = 1;
  while (childs > c_rows) {
    level++;
    l_rows = l_rows * 4;
    c_rows += l_rows;
  }
  return level;
}