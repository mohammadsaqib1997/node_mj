const express = require('express')
const router = express.Router()
const _ = require('lodash')

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
const upload = multer({ storage })


const db = require('../db.js')

router.get("/", function (req, res) {
  let offset = 0
  if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
    offset = (parseInt(req.query.page) - 1) * 10
  }

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      connection.query(`SELECT COUNT(*) as total_rows FROM members`, function (error, results, fields) {
        if (error) {
          connection.release();
          res.status(500).json({ error })
        } else {
          let rows_count = results[0].total_rows
          if (rows_count > 0) {
            let opt = {
              sql: `SELECT m.id, m.user_asn_id, m.email, m.full_name, m.active_sts, m.is_paid_m, ur.id as receipt 
                FROM members as m
                LEFT JOIN user_receipts as ur
                ON m.id=ur.member_id
                LIMIT 10
                OFFSET ${offset}
                `, nestTables: true
            }
            connection.query(opt, function (error, results, fields) {
              connection.release();
              if (error) {
                res.status(500).json({ error })
              } else {
                res.json({ data: results, total_rows: rows_count })
              }

            });

          } else {
            connection.release();
            res.json({ data: [], total_rows: rows_count })
          }
        }
      })
    }
  })
})

router.get('/wallet/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({ error })
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
            res.status(500).json({ error })
          } else {
            let wallet = 0
            if(results.length > 0) {
              wallet = results[0].wallet
            }
            res.json({ data: wallet })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.get("/:id", function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      let options = {
        sql: `
      SELECT m.*, upd.buyer_pay_type, upd.buyer_qty_prd, upd.buyer_type, upd.product_id, upd.id
      FROM members AS m
      LEFT JOIN user_product_details as upd
      ON m.id=upd.member_id
      WHERE m.id=?
      `, nestTables: true
      }

      connection.query(options, [req.params.id], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ data: results })
        }

      });
    }
  })
})

router.post('/mjIdCheck', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      connection.query('SELECT user_asn_id FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ count: results.length })
        }

      });
    }
  })
})

router.post('/add', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ err })
    } else {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release()
          res.status(500).json({ err })
        } else {
          connection.query('INSERT INTO `members` SET ?', req.body.member_data, function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({ error })
              })
            } else {
              let mem_id = results.insertId
              req.body.prd_data['member_id'] = mem_id
              connection.query('INSERT INTO `user_product_details` SET ?', req.body.prd_data, function (error, results, fields) {
                if (error) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({ error })
                  })
                } else {

                  if (_.get(req.body.member_data, 'is_paid_m', 0) === 1) {

                    after_paid_member(connection, mem_id, function (err) {
                      if (err) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({ err })
                        });
                      } else {
                        connection.commit(function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({ err })
                            });
                          } else {
                            connection.release()
                            res.json({ status: true })
                          }
                        })
                      }
                    })

                  } else {
                    connection.commit(function (err) {
                      if (err) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({ err })
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
          });
        }
      })

    }
  })

})

router.post('/update', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ err })
    } else {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release()
          res.status(500).json({ err })
        } else {
          connection.query('UPDATE `members` SET ? WHERE id=?', [req.body.member_data, req.body.update_id], function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({ error })
              })
            } else {

              connection.query('SELECT id FROM user_product_details WHERE member_id=?', [req.body.update_id], function (error, results, fields) {
                if (error) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({ error })
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
                        res.status(500).json({ error })
                      })
                    } else {

                      if (_.get(req.body.member_data, 'is_paid_m', 0) === 1) {

                        after_paid_member(connection, req.body.update_id, function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({ err })
                            });
                          } else {
                            connection.commit(function (err) {
                              if (err) {
                                return connection.rollback(function () {
                                  connection.release()
                                  res.status(500).json({ err })
                                });
                              } else {
                                connection.release()
                                res.json({ status: true })
                              }
                            })
                          }
                        })

                      } else {
                        connection.commit(function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({ err })
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
      res.status(500).json({ err })
    } else {
      connection.query('INSERT INTO `user_receipts` SET ?', req.body, function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ status: true })
        }
      })
    }
  })
})

router.post('/pay_user', function (req, res) {
  if (/^[0-9]*$/.test(req.body.id)) {

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({ err })
      } else {
        let mem_id = req.body.id

        connection.beginTransaction(async function (err) {
          if (err) {
            connection.release()
            res.status(500).json({ err })
          } else {

            // grab last user asn id
            connection.query('SELECT user_asn_id FROM `members` ORDER BY user_asn_id DESC LIMIT 1', function (error, results, fields) {
              if (error) {
                return connection.rollback(function () {
                  connection.release()
                  res.status(500).json({ error })
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
                      res.status(500).json({ error })
                    })
                  } else {

                    after_paid_member(connection, mem_id, function (err) {
                      if (err) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({ err })
                        });
                      } else {
                        connection.commit(function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({ err })
                            });
                          } else {
                            connection.release()
                            res.json({ status: true })
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
    res.json({ status: false, message: 'Invalid parameters!' })
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

async function after_paid_member(connection, mem_id, cb) {
  let throw_error = null

  await new Promise(resolve => {
    // apply fees - transaction
    connection.query('INSERT INTO `transactions_m` SET ?', {
      member_id: mem_id,
      remarks: "Activation Fees",
      credit: 5000
    }, function (error, results, fields) {
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

                            // update the info variables
                            let set_info_params = {
                              h_childs_count: parseInt(results[0].h_childs_count) + 1,
                              level: get_level(parseInt(results[0].h_childs_count) + 1)
                            }
                            connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_info_params, results[0].member_id], function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve2()
                              } else {
                                // release the await...
                                return resolve2()
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
          let from_user_asn_id = results[0].user_asn_id
          let grab_ref_usr_ids = [results[0].ref_user_asn_id]

          let direct_inc = 0
          for (usr_asn_id of grab_ref_usr_ids) {
            await new Promise(resolve2 => {
              connection.query('SELECT id, ref_user_asn_id FROM `members` WHERE user_asn_id=?', usr_asn_id, function (error, results, fields) {
                if (error) {
                  throw_error = error
                  return resolve2()
                } else {
                  if (results[0].ref_user_asn_id !== null) {
                    grab_ref_usr_ids.push(results[0].ref_user_asn_id)
                  }
                  connection.query('SELECT * FROM `info_var_m` WHERE member_id=?', results[0].id, function (error, results, fields) {
                    if (error) {
                      throw_error = error
                      return resolve2()
                    } else {
                      direct_inc++
                      let set_param = {}

                      let commission_amount = 0
                      let c_mem_id = results[0].member_id

                      if (direct_inc === 1) {
                        set_param['direct_ref_count'] = parseInt(results[0].direct_ref_count) + 1
                        if (results[0].level <= 9) {
                          commission_amount = 1000
                          set_param['wallet'] = parseInt(results[0].wallet) + 1000
                        }
                      } else if (direct_inc === 2) {
                        set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                        if (results[0].level <= 9) {
                          commission_amount = 300
                          set_param['wallet'] = parseInt(results[0].wallet) + 300
                        }
                      } else {
                        set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                        if (results[0].level <= 9) {
                          commission_amount = 200
                          set_param['wallet'] = parseInt(results[0].wallet) + 200
                        }
                      }

                      connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_param, c_mem_id], function (error, results, fields) {
                        if (error) {
                          throw_error = error
                          return resolve2()
                        } else {
                          // apply commission - transaction
                          connection.query('INSERT INTO `transactions_m` SET ?', {
                            member_id: c_mem_id,
                            remarks: "Issued Commission - User ID " + from_user_asn_id,
                            debit: commission_amount
                          }, function (error, results, fields) {
                            if (error) {
                              throw_error = error
                            }
                            // release the await...
                            return resolve2()
                          })
                        }
                      })
                    }
                  })
                }
              })
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

  return cb(throw_error)
}

function get_level(childs) {
  let level = 0, l_rows = 1, c_rows = 1;
  while (childs >= c_rows) {
    level++;
    l_rows = l_rows * 4;
    c_rows += l_rows;
  }
  return level;
}
