const express = require('express')
const router = express.Router()
const moment = require("moment")

const db = require('../db.js')
const db_utils = require('../func/db-util.js')

router.get('/wallet', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT wallet FROM `company_var` WHERE id=1', function (error, results, fields) {
        if (error) {
          connection.release();
          res.status(500).json({
            error
          })
        } else {
          let comp_wallet = 0
          if (results.length > 0) {
            comp_wallet = results[0].wallet !== null ? results[0].wallet : 0
          }
          connection.query('SELECT SUM(wallet) as user_wallet FROM info_var_m', function (error, results, fields) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              let user_wallet = 0
              if (results.length > 0) {
                user_wallet = results[0].user_wallet !== null ? results[0].user_wallet : 0
              }
              res.json({
                comp_wallet,
                user_wallet
              })
            }
          })
        }
      });
    }
  })
})

router.post('/withdraw', function (req, res) {
  if (/^[1-9]+[0-9]*$/.test(req.body.amount)) {
    let amount = parseInt(req.body.amount)
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

              connection.query("INSERT INTO `transactions_comp` SET ?", {
                remarks: `Deduct amount in your wallet Rs.${amount}/- From Withdrawal.`,
                credit: amount
              }, function (error, results) {
                if (error) {
                  throw_error = error
                  return resolve()
                } else {
                  connection.query('INSERT INTO `notifications` SET ?', {
                    from_type: 1,
                    to_type: 1,
                    from_id: 1,
                    to_id: 1,
                    message: `Successfully Withdrawal Amount Rs.${amount}/-`,
                    notify_type: 0
                  }, function (error, results) {
                    if (error) {
                      throw_error = error
                      return resolve()
                    } else {
                      connection.query('SELECT wallet FROM company_var WHERE id=1', function (error, results, fields) {
                        if (error) {
                          throw_error = error
                          return resolve()
                        } else {
                          let upd_wallet = parseInt(results[0].wallet) - amount
                          connection.query('UPDATE company_var SET wallet=? WHERE id=1', upd_wallet, function (error, results, fields) {
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
      message: "Invalid parameters!"
    })
  }

})

router.get("/member_counts", function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT COUNT(*) AS total, SUM(is_paid_m) as paid_total FROM `members`', function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({
            error
          })
        } else {
          res.json({
            data: {
              paid_mem: results[0].paid_total,
              un_paid_mem: results[0].total - results[0].paid_total,
            }
          })
        }
      });
    }
  })
})

router.get("/monthly_reg_members", function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let throw_error = null
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
        12: {}
      }
      let date = moment().set('M', 0).set('Y', moment().get('Y') - 1).endOf('Y')

      for (month in grab_months) {
        await new Promise(resolve => {
          date.add(1, 'month')
          let start = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss")
          let end = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

          connection.query('SELECT COUNT(*) as count FROM members WHERE is_paid_m = 1 AND created_at >= ? AND created_at <= ?', [start, end], function (error, results) {
            if (error) {
              throw_error = error
              resolve()
            } else {
              grab_months[month]['paid'] = results[0].count

              connection.query('SELECT COUNT(*) as count FROM members WHERE is_paid_m = 0 AND created_at >= ? AND created_at <= ?', [start, end], function (error, results) {
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
})

router.get('/total_cm', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query("SELECT SUM(amount) as total_paid FROM commissions WHERE status=1", function (error, results) {
        if (error) {
          connection.release()
          res.status(500).json({
            error
          })
        } else {
          let total_paid = results[0].total_paid !== null ? results[0].total_paid : 0
          connection.query("SELECT SUM(amount) as total_un_paid FROM commissions WHERE status=0", function (error, results) {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              let total_un_paid = results[0].total_un_paid !== null ? results[0].total_un_paid : 0
              res.json({
                paid: total_paid,
                un_paid: total_un_paid
              })
            }
          })
        }
      })
    }
  })
})

router.get('/trans_list', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
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

      connection.query(
        `SELECT SUM(debit) - SUM(credit) as tot_balance
        FROM transactions_comp`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_balance = result[0].tot_balance

            connection.query(
              `SELECT COUNT(*) as tot_rows 
              FROM transactions_comp
              ${(search !== '') ? 'WHERE id LIKE ? OR remarks LIKE ? OR debit LIKE ? OR credit LIKE ? OR created_at LIKE ?' : ''}`,
              ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
              function (error, result) {
                if (error) {
                  connection.release()
                  res.status(500).json({
                    error
                  })
                } else {
                  let tot_rows = result[0].tot_rows

                  connection.query(
                    `SELECT * 
                    FROM transactions_comp
                    ${(search !== '') ? 'WHERE id LIKE ? OR remarks LIKE ? OR debit LIKE ? OR credit LIKE ? OR created_at LIKE ?' : ''}
                    ORDER BY id DESC
                    LIMIT ${limit}
                    OFFSET ${offset}`,
                    ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
                    function (error, main_result) {
                      if (error) {
                        connection.release()
                        res.status(500).json({
                          error
                        })
                      } else {
                        if (main_result.length > 0) {
                          connection.query(
                            `SELECT SUM(debit) - SUM(credit) as rows_balance, 
                                  (SELECT SUM(debit) - SUM(credit) FROM transactions_comp where id < ${main_result[main_result.length-1].id}) as last_balance
                              FROM transactions_comp
                              WHERE
                              (id >= ${main_result[main_result.length-1].id} AND id <= ${main_result[0].id})`,
                            [req.params.id, req.params.id],
                            function (error, result) {
                              connection.release();
                              if (error) {
                                res.status(500).json({
                                  error
                                })
                              } else {
                                let rows_balance = result[0].rows_balance !== null ? result[0].rows_balance : 0
                                let last_balance = result[0].last_balance !== null ? result[0].last_balance : 0
                                res.json({
                                  data: main_result,
                                  tot_rows,
                                  tot_balance,
                                  last_balance,
                                  rows_balance
                                })
                              }
                            }
                          )
                        } else {
                          res.json({
                            data: main_result,
                            tot_rows,
                            tot_balance,
                            last_balance: 0,
                            rows_balance: 0
                          })
                        }
                      }
                    })
                }
              })
          }
        })
    }
  })
})

router.get('/voucher_list', function (req, res) {
  if (req.decoded.data.type === 2) {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
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

        connection.query(
          `SELECT SUM(debit) - SUM(credit) as tot_balance
          FROM transactions_comp
          WHERE type=2`,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              let tot_balance = result[0].tot_balance
              connection.query(
                `SELECT COUNT(*) as tot_rows 
                FROM transactions_comp
                WHERE type=2
                ${(search !== '') ? 'AND (id LIKE ? OR remarks LIKE ? OR debit LIKE ? OR credit LIKE ? OR created_at LIKE ?)' : ''}`,
                ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
                function (error, result) {
                  if (error) {
                    connection.release()
                    res.status(500).json({
                      error
                    })
                  } else {
                    let tot_rows = result[0].tot_rows

                    connection.query(
                      `SELECT * 
                      FROM transactions_comp
                      WHERE type=2
                      ${(search !== '') ? 'AND (id LIKE ? OR remarks LIKE ? OR debit LIKE ? OR credit LIKE ? OR created_at LIKE ?)' : ''}
                      ORDER BY id DESC
                      LIMIT ${limit}
                      OFFSET ${offset}`,
                      ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
                      function (error, results) {
                        connection.release()
                        if (error) {
                          res.status(500).json({
                            error
                          })
                        } else {
                          res.json({
                            data: results,
                            tot_rows,
                            tot_balance
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
      message: 'Not Permission Yet!'
    })
  }
})

router.post('/add_voucher', function (req, res) {
  if (req.decoded.data.type === 2) {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler

          connection.query(
            `INSERT INTO \`transactions_comp\` SET ?`, {
              remarks: req.body.remarks,
              debit: parseInt(req.body.debit),
              credit: parseInt(req.body.credit),
              type: 2
            },
            function (error, results) {
              if (error) {
                err_cb(error)
                resolve()
              } else {
                connection.query(
                  `SELECT wallet FROM company_var WHERE id=1`,
                  function (error, results) {
                    if (error) {
                      err_cb(error)
                      resolve()
                    } else {
                      let company_params = {
                        wallet: parseInt(results[0].wallet) + (parseInt(req.body.debit) - parseInt(req.body.credit)),
                      }

                      connection.query('UPDATE company_var SET ? WHERE id=1', company_params, function (error, results) {
                        if (error) {
                          err_cb(error)
                        }
                        resolve();
                      })
                    }
                  })
              }
            })

        }, function (error) { // this is finalize response handler
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
  } else {
    res.json({
      status: false,
      message: 'Not Permission Yet!'
    })
  }
})

router.post('/user_id_check', function (req, res) {
  if (req.decoded.data.type > 0 && /^[0-9]*$/.test(req.body.recv_user_ans_id)) {
    let recv_u_asn_id = req.body.recv_user_ans_id

    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.query('SELECT count(*) as count, full_name FROM members WHERE user_asn_id=?', recv_u_asn_id, function (error, results, fields) {
          connection.release();
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: results[0]
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

router.post("/transfer_funds", function (req, res) {

  if (req.decoded.data.type > 0 && /^[0-9]*$/.test(req.body.user_asn_id) && /^[0-9]*$/.test(req.body.amount)) {
    let recv_user_asn_id = req.body.user_asn_id
    let amount = parseInt(req.body.amount)

    if (amount >= 100) {

      db.getConnection(function (error, connection) {
        if (error) {
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
                  `SELECT wallet FROM company_var WHERE id=1`,
                  function (error, results, fields) {
                    if (error) {
                      throw_error = error
                      return resolve()
                    } else {

                      let company_params = {
                        wallet: parseInt(results[0].wallet) - amount,
                      }

                      connection.query('UPDATE company_var SET ? WHERE id=1', company_params, function (error, results, fields) {
                        if (error) {
                          throw_error = error
                          return resolve()
                        } else {

                          connection.query(
                            `SELECT ivm.wallet, ivm.member_id
                            FROM members as m
                            JOIN info_var_m as ivm
                            ON m.id=ivm.member_id
                            WHERE m.user_asn_id=?`,
                            recv_user_asn_id,
                            function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve()
                              } else {
                                let recv_id = results[0].member_id
                                let recv_params = {
                                  wallet: parseInt(results[0].wallet) + amount
                                }

                                connection.query(
                                  `UPDATE info_var_m SET ? WHERE member_id=?`,
                                  [recv_params, recv_id],
                                  function (error, results, fields) {
                                    if (error) {
                                      throw_error = error
                                      return resolve()
                                    } else {

                                      connection.query('INSERT INTO `transactions_comp` SET ?', {
                                        remarks: "Funds Transfered To User ID " + recv_user_asn_id,
                                        credit: amount
                                      }, function (error, results, fields) {
                                        if (error) {
                                          throw_error = error
                                          return resolve()
                                        } else {

                                          connection.query(
                                            `INSERT INTO \`notifications\` SET ?`, {
                                              from_type: 1,
                                              to_type: 1,
                                              from_id: 1,
                                              to_id: 1,
                                              message: "Successfully Funds Transfered To User ID " + recv_user_asn_id,
                                              notify_type: 0
                                            },
                                            function (error, results, fields) {
                                              if (error) {
                                                throw_error = error
                                                return resolve()
                                              } else {

                                                connection.query(
                                                  `INSERT INTO \`transactions_m\` SET ?`, {
                                                    member_id: recv_id,
                                                    remarks: "Funds Received From Admin",
                                                    debit: amount
                                                  },
                                                  function (error, results, fields) {
                                                    if (error) {
                                                      throw_error = error
                                                      return resolve()
                                                    } else {

                                                      connection.query(
                                                        `INSERT INTO \`notifications\` SET ?`, {
                                                          from_type: 1,
                                                          to_type: 0,
                                                          from_id: 1,
                                                          to_id: recv_id,
                                                          from_txt: 'Admin',
                                                          message: "Funds Received From Admin",
                                                          notify_type: 0
                                                        },
                                                        function (error, results, fields) {
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
        message: 'Minimum transfer funds send 100.'
      })
    }
  } else {
    res.json({
      status: false,
      message: 'Invalid parameters!'
    })
  }
})

module.exports = router