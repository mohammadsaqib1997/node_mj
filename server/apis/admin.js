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
          res.json({
            wallet: results[0].wallet !== null ? results[0].wallet : 0
          })
        }
      });
    }
  })
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

module.exports = router
