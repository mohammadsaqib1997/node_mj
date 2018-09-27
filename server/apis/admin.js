const express = require('express')
const router = express.Router()
const moment = require("moment")

const db = require('../db.js')

router.get('/wallet', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ err })
    } else {
      connection.query('SELECT wallet FROM `company_var` WHERE id=1', function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          let wallet = 0
          if (results.length > 0) {
            wallet = results[0].wallet
          } else {
            wallet = 0
          }
          res.json({
            wallet
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
        res.status(500).json({ err })
      } else {

        connection.beginTransaction(async function (err) {
          if (err) {
            connection.release()
            res.status(500).json({ err })
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
                res.status(500).json({ throw_error })
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
      res.status(500).json({ err })
    } else {
      connection.query('SELECT COUNT(*) AS total, SUM(is_paid_m) as paid_total FROM `members`', function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
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
      res.status(500).json({ err })
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
        res.status(500).json({ error: throw_error })
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
      res.status(500).json({ err })
    } else {
      connection.query("SELECT SUM(amount) as total_paid FROM commissions WHERE status=1", function (error, results) {
        if (error) {
          connection.release()
          res.status(500).json({ error })
        } else {
          let total_paid = results[0].total_paid !== null ? results[0].total_paid : 0
          connection.query("SELECT SUM(amount) as total_un_paid FROM commissions WHERE status=0", function (error, results) {
            connection.release()
            if (error) {
              res.status(500).json({ error })
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
      res.status(500).json({ err })
    } else {
      let offset = 0, limit = 10, search = ""

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
            res.status(500).json({ error })
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
                  res.status(500).json({ error })
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
                    function (error, results) {
                      connection.release()
                      if (error) {
                        res.status(500).json({ error })
                      } else {
                        res.json({
                          results,
                          tot_balance,
                          tot_rows
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

module.exports = router
