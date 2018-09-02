const express = require('express')
const router = express.Router()
const moment = require("moment")

const db = require('../db.js')

router.get('/', function (req, res) {
  if (req.decoded.data.user_id) {
    let type = req.decoded.data.type === 2 || req.decoded.data.type === 1 ? 1 : 0
    let id = type === 1 ? 1 : req.decoded.data.user_id
    let limit = 5
    if (/^[1-9][0-9]?$|^100$/.test(req.query.limit)) {
      limit = req.query.limit
    }
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({ err })
      } else {
        connection.query('SELECT COUNT(*) as total FROM notifications WHERE to_id=? AND to_type=? AND seen=0', [id, type], function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({ error })
          } else {
            let un_read = result[0].total

            connection.query(`
            SELECT id, from_id, from_txt, from_type, message as msg, seen as \`read\`, created_at as date, notify_type as type 
            FROM notifications 
            WHERE to_id=? AND to_type=?
            ORDER BY id DESC LIMIT ${limit}
            `, [id, type], function (error, result) {
                connection.release()
                if (error) {
                  res.status(500).json({ error })
                } else {
                  res.json({ result, un_read })
                }
              })
          }
        })
      }
    })
  } else {
    res.json({ status: false, message: "Invalid Request!" })
  }
})

router.get('/member_info/:id', function (req, res) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({ err })
      } else {
        connection.query(`
        SELECT is_paid_m as paid, full_name as name, email, contact_num as cont_num
        FROM members 
        WHERE id=?
        `, req.params.id, function (error, result) {
            connection.release()
            if (error) {
              res.status(500).json({ error })
            } else {
              res.json({ data: result[0] })
            }
          })
      }
    })
  } else {
    res.json({ status: false, message: "Invalid Parameters!" })
  }
})

router.get('/cm_info/:trans_id', function (req, res) {
  if (/^[0-9]*$/.test(req.params.trans_id)) {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({ err })
      } else {
        connection.query(`
        SELECT status
        FROM commissions 
        WHERE trans_id=?
        `, req.params.trans_id, function (error, result) {
            connection.release()
            if (error) {
              res.status(500).json({ error })
            } else {
              res.json({ data: result[0] })
            }
          })
      }
    })
  } else {
    res.json({ status: false, message: "Invalid Parameters!" })
  }
})

router.post('/read_it', function (req, res) {
  if (/^[0-9]*$/.test(req.body.id)) {
    let seen_sts = 1
    if (/^[0|1]$/.test(req.body.sts)) {
      seen_sts = req.body.sts
    }
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({ err })
      } else {
        connection.query(`
        UPDATE notifications
        SET ?
        WHERE id=?
        `, [
            { seen: seen_sts },
            req.body.id
          ], function (error, result) {
            connection.release()
            if (error) {
              res.status(500).json({ error })
            } else {
              res.json({ status: true })
            }
          })
      }
    })
  } else {
    res.json({ status: false, message: "Invalid Parameters!" })
  }
})

module.exports = router
