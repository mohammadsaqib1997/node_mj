const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')

router.get('/monthly_data', function (req, res) {
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

      let date = moment().set('M', 0).set('Y', moment().get('Y') - 1).endOf('Y')
      for (month in grab_months) {
        await new Promise(resolve => {
          date.add(1, 'month')
          let start = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss")
          let end = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

          connection.query('SELECT SUM(amount) as total FROM commissions WHERE status = 1 AND created_at >= ? AND created_at <= ?', [start, end], function (error, results) {
            if (error) {
              throw_error = error
              resolve()
            } else {
              grab_months[month]['paid'] = results[0].total !== null ? results[0].total : 0

              connection.query('SELECT SUM(amount) as total FROM commissions WHERE status = 0 AND created_at >= ? AND created_at <= ?', [start, end], function (error, results) {
                if (error) {
                  throw_error = error
                  resolve()
                } else {
                  grab_months[month]['un_paid'] = results[0].total !== null ? results[0].total : 0
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

router.get("/un_paid", function (req, res) {
  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
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
        `SELECT COUNT(*) as tot_rows
                FROM commissions
                WHERE status=0 
                ${(search !== '') ? 'AND (trans_id LIKE ? OR remarks LIKE ? OR amount LIKE ? OR created_at LIKE ?)' : ''}`,
        ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
        function (error, results) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = results[0].tot_rows

            connection.query(
              `SELECT 
                                cm.trans_id as id, 
                                cm.member_id, 
                                cm.remarks as description, 
                                cm.amount,
                                cm.created_at as date
                            FROM commissions as cm
                            WHERE cm.status=0 
                            ${(search !== '') ? 'AND (cm.trans_id LIKE ? OR cm.remarks LIKE ? OR cm.amount LIKE ? OR cm.created_at LIKE ?)' : ''}
                            ORDER BY cm.trans_id DESC
                            LIMIT ${limit}
                            OFFSET ${offset}`,
              ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
              function (error, results) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.json({
                    data: results,
                    tot_rows
                  })
                }
              }
            )
          }
        })


    }
  })
})

router.get("/paid", function (req, res) {
  db.getConnection(function (error, connection) {
    if (error) {
      res.status(500).json({
        error
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
        `SELECT COUNT(*) as tot_rows
                FROM commissions
                WHERE status=1 
                ${(search !== '') ? 'AND (trans_id LIKE ? OR remarks LIKE ? OR amount LIKE ? OR created_at LIKE ?)' : ''}`,
        ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `SELECT 
                                cm.trans_id as id, 
                                cm.member_id, 
                                cm.remarks as description, 
                                cm.amount, 
                                COUNT(u_rcp.id) as tot_rcp_up,
                                cm.created_at as date
                            FROM commissions as cm
                            LEFT JOIN user_receipts as u_rcp
                            ON u_rcp.ref_id = cm.trans_id AND u_rcp.type = 1 
                            WHERE cm.status=1 
                            ${(search !== '') ? 'AND (cm.trans_id LIKE ? OR cm.remarks LIKE ? OR cm.amount LIKE ? OR cm.created_at LIKE ?)' : ''}
                            GROUP BY cm.trans_id
                            ORDER BY cm.trans_id DESC
                            LIMIT ${limit}
                            OFFSET ${offset}`,
              ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
              function (error, results) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.json({
                    data: results,
                    tot_rows
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

router.post('/set_sts', function (req, res) {

  if (/^[0-9]*$/.test(req.body.id) && /^[1|2]$/i.test(req.body.type)) {
    let id = req.body.id
    let type = req.body.type

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
              connection.query('UPDATE commissions SET ? WHERE trans_id=?', [{
                status: type
              }, id], function (error, results) {
                if (error) {
                  throw_error = error
                  return resolve()
                } else {
                  connection.query(
                    `SELECT cm.member_id, cm.amount, m.user_asn_id
                    FROM commissions as cm
                    INNER JOIN members as m
                    ON cm.member_id = m.id
                    WHERE cm.trans_id=?`,
                    id,
                    function (error, results) {
                      if (error) {
                        throw_error = error
                        return resolve()
                      } else {
                        let mem_id = results[0].member_id
                        let mem_amount = parseInt(results[0].amount)

                        // - tax apply and fees
                        let gen_amount = mem_amount
                        let tax = Math.round(mem_amount * .13), fees = 25
                        if (type === 1) {
                          gen_amount = mem_amount - (tax + fees)
                        }

                        connection.query('INSERT INTO transactions_comp SET ?', {
                          remarks: "Withdrawal Liability Amount Deduct In Your Wallet User ID " + results[0].user_asn_id,
                          credit: gen_amount
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
                                let upd_wallet = parseInt(results[0].wallet) - gen_amount
                                connection.query('UPDATE company_var SET wallet=? WHERE id=1', upd_wallet, function (error, results, fields) {
                                  if (error) {
                                    throw_error = error
                                    return resolve()
                                  } else {
                                    if (type === 2) {
                                      // cancel request -- start
                                      connection.query('INSERT INTO transactions_m SET ?', {
                                        member_id: mem_id,
                                        remarks: "Your Withdraw Request Has Been Canceled!",
                                        debit: mem_amount,
                                      }, function (error, results) {
                                        if (error) {
                                          throw_error = error
                                          return resolve()
                                        } else {
                                          connection.query('SELECT available FROM info_var_m WHERE member_id=?', mem_id, function (error, results) {
                                            if (error) {
                                              throw_error = error
                                              return resolve()
                                            } else {
                                              let set_available = parseInt(results[0].available) + parseInt(mem_amount)
                                              connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [{
                                                available: set_available
                                              }, mem_id], function (error, results) {
                                                if (error) {
                                                  throw_error = error
                                                  return resolve()
                                                } else {
                                                  connection.query('INSERT INTO notifications SET ?', {
                                                    from_type: 1,
                                                    to_type: 0,
                                                    from_id: 1,
                                                    to_id: mem_id,
                                                    from_txt: "Admin",
                                                    message: "Your Withdrawal Request Has Been Canceled Transaction ID " + id,
                                                    notify_type: 0
                                                  }, function (error, results) {
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
                                      // cancel request -- end
                                    } else {

                                      connection.query(
                                        `select 
                                          has_avlb_at, 
                                          max_trans_limit 
                                        from info_var_m 
                                        where member_id=?`,
                                        mem_id,
                                        (error, result) => {
                                          if (error) {
                                            throw_error = error
                                            return resolve()
                                          } else {
                                            let f_data = result.length ? result[0] : {
                                              has_avlb_at: null,
                                              max_trans_limit: 0
                                            }

                                            f_data['max_trans_limit'] = parseInt(f_data['max_trans_limit']) + 500
                                            f_data['has_avlb_at'] = !f_data['has_avlb_at'] ? moment().format("YYYY-MM-DD HH-mm-ss") : f_data['has_avlb_at']

                                            connection.query(
                                              `update info_var_m set ? where member_id=?`,
                                              [f_data, mem_id],
                                              (error, result) => {
                                                if (error) {
                                                  throw_error = error
                                                  return resolve()
                                                } else {

                                                  connection.query('INSERT INTO notifications SET ?', {
                                                    from_type: 1,
                                                    to_type: 0,
                                                    from_id: 1,
                                                    to_id: mem_id,
                                                    from_txt: "Admin",
                                                    message: `Your Withdrawal Request Has Been Approved Transaction ID ${id}.\nWithdraw Amount: ${mem_amount}\nApply Tax: ${tax}\nApply Fee: ${fees}\nPaid Amount: ${gen_amount}`,
                                                    notify_type: 0
                                                  }, function (error, results) {
                                                    if (error) {
                                                      throw_error = error
                                                    }
                                                    return resolve()
                                                  })
                                                }
                                              }
                                            )
                                          }
                                        }
                                      )
                                    }
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
      message: 'Invalid parameters!'
    })
  }

})

router.post('/user_id_check', function (req, res) {
  if (/^[0-9]*$/.test(req.body.user_id) && /^[0-9]*$/.test(req.body.recv_user_ans_id)) {
    let user_id = req.body.user_id
    let recv_u_asn_id = req.body.recv_user_ans_id

    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.query('SELECT count(*) as count, full_name FROM members WHERE user_asn_id=? AND id<>?', [recv_u_asn_id, user_id], function (error, results, fields) {
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

router.post('/wd_check', (req, res) => {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `select available, max_trans_limit from info_var_m where member_id=${req.decoded.data.user_id}`,
          (error, result) => {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              if (result.length) {
                let req_amount = parseInt(req.body.amount)
                let avlb = parseInt(result[0].available)
                let limit_trans = parseInt(result[0].max_trans_limit)

                if (req_amount > limit_trans) {
                  return res.json({
                    status: false,
                    message: `Maximum amount withdraw only PKR ${limit_trans}/-`
                  })
                } else if (avlb < req_amount) {
                  return res.json({
                    status: false,
                    message: `Withdraw request is exceed to available amount PKR ${avlb}/-`
                  })
                } else {
                  return res.json({
                    status: true
                  })
                }
              } else {
                res.status(500).json({
                  error: "Nothing Found!"
                })
              }
            }
          }
        )
      }
    })
  } else {
    res.status(500).json({
      error: "Invalid Request!"
    })
  }
})

router.post("/withdraw", function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    let id = req.decoded.data.user_id
    let amount = parseInt(req.body.amount)

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
                `SELECT 
                  ivm.available, 
                  m.user_asn_id, 
                  m.email
                FROM info_var_m as ivm
                INNER JOIN members as m
                ON ivm.member_id=m.id
                WHERE ivm.member_id=?`,
                id,
                function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    let mem_avlb = results[0].available
                    let mem_asn_id = results[0].user_asn_id
                    let mem_email = results[0].email

                    let info_param = {
                      available: parseInt(mem_avlb) - amount
                    }
                    connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [info_param, id], function (error, results, fields) {
                      if (error) {
                        throw_error = error
                        return resolve()
                      } else {

                        connection.query('INSERT INTO `transactions_m` SET ?', {
                          member_id: id,
                          remarks: `Withdraw Available Amount PKR ${amount}/-`,
                          credit: amount
                        }, function (error, results, fields) {
                          if (error) {
                            throw_error = error
                            return resolve()
                          } else {
                            let trans_id = results.insertId

                            connection.query('INSERT INTO `notifications` SET ?', {
                              from_type: 1,
                              to_type: 0,
                              from_id: 1,
                              to_id: id,
                              from_txt: "Admin",
                              message: `Deduct available amount Rs.${amount}/-`,
                              notify_type: 0
                            }, function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve()
                              } else {
                                connection.query('INSERT INTO `commissions` SET ?', {
                                  trans_id: trans_id,
                                  member_id: id,
                                  remarks: "Withdrawal Request From User ID " + mem_asn_id,
                                  amount: amount
                                }, function (error, results, fields) {
                                  if (error) {
                                    throw_error = error
                                    return resolve()
                                  } else {
                                    connection.query('INSERT INTO `notifications` SET ?', {
                                      from_type: 0,
                                      to_type: 1,
                                      from_id: id,
                                      to_id: 1,
                                      from_txt: mem_email,
                                      message: `Withdrawal Request From User ID ${mem_asn_id} Amount Rs.${amount}/- Transaction ID ${trans_id}`,
                                      notify_type: 2
                                    }, function (error, results, fields) {
                                      if (error) {
                                        throw_error = error
                                        return resolve()
                                      } else {
                                        connection.query('INSERT INTO `transactions_comp` SET ?', {
                                          remarks: `Withdrawal Liability Amount Add In Your Wallet From User ID ${mem_asn_id}`,
                                          debit: amount
                                        }, function (error, results, fields) {
                                          if (error) {
                                            throw_error = error
                                            return resolve()
                                          } else {

                                            connection.query('SELECT wallet FROM company_var WHERE id=1', function (error, results, fields) {
                                              if (error) {
                                                throw_error = error
                                                return resolve()
                                              } else {
                                                let upd_wallet = parseInt(results[0].wallet) + amount
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
    res.status(500).json({
      error: "Invalid Request!"
    })
  }
})

router.post("/transfer_funds", function (req, res) {

  if (/^[0-9]*$/.test(req.body.id) && /^[0-9]*$/.test(req.body.amount)) {
    let id = req.body.id
    // let recv_user_asn_id = req.body.user_asn_id
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

                // select sender wallet
                let sender_opt = {
                  sql: `SELECT ivm.wallet, m.user_asn_id, m.email
                        FROM members as m
                        JOIN info_var_m as ivm
                        ON m.id=ivm.member_id
                        WHERE m.id=?`
                }
                connection.query(sender_opt, id, function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    let sender_user_asn_id = results[0].user_asn_id
                    let sender_email = results[0].email
                    let sender_params = {
                      wallet: parseInt(results[0].wallet) - amount,
                    }

                    // sender wallet update
                    connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [sender_params, id], function (error, results, fields) {
                      if (error) {
                        throw_error = error
                        return resolve()
                      } else {

                        // select admin wallet
                        connection.query(
                          `select wallet from company_var where id=1`,
                          function (error, results, fields) {
                            if (error) {
                              throw_error = error
                              return resolve()
                            } else {
                              let adm_wallet = results[0].wallet
                              let upd_wallet = {
                                wallet: parseInt(adm_wallet) + amount
                              }
                              // update admin wallet
                              connection.query('UPDATE company_var SET ? WHERE id=1', upd_wallet, function (error, results, fields) {
                                if (error) {
                                  throw_error = error
                                  return resolve()
                                } else {
                                  connection.query('INSERT INTO `transactions_m` SET ?', {
                                    member_id: id,
                                    remarks: "Funds Transfered To Admin",
                                    credit: amount
                                  }, function (error, results, fields) {
                                    if (error) {
                                      throw_error = error
                                      return resolve()
                                    } else {

                                      connection.query('INSERT INTO `notifications` SET ?', {
                                        from_type: 1,
                                        to_type: 0,
                                        from_id: 1,
                                        to_id: id,
                                        from_txt: "Admin",
                                        message: "Successfully Funds Transfered To Admin",
                                        notify_type: 0
                                      }, function (error, results, fields) {
                                        if (error) {
                                          throw_error = error
                                          return resolve()
                                        } else {
                                          connection.query('INSERT INTO `transactions_comp` SET ?', {
                                            remarks: "Funds Received From User ID " + sender_user_asn_id,
                                            debit: amount
                                          }, function (error, results, fields) {
                                            if (error) {
                                              throw_error = error
                                              return resolve()
                                            } else {
                                              connection.query('INSERT INTO `notifications` SET ?', {
                                                from_type: 0,
                                                to_type: 1,
                                                from_id: id,
                                                to_id: 1,
                                                from_txt: sender_email,
                                                message: "Funds Received From User ID " + sender_user_asn_id,
                                                notify_type: 0
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