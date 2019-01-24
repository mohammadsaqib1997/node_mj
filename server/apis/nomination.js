const express = require('express')
const router = express.Router()

const moment = require('moment')
const _ = require('lodash')
const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 0) {
    return next()
  } else {
    return res.json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/list', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `SELECT id, name, blood_rel, cnic_numb, contact_numb FROM nominations WHERE member_id=${req.decoded.data.user_id}`,
        (error, result) => {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              result
            })
          }
        }
      )
    }
  })
})

router.post("/add", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, async function (resolve, err_cb) {
          let upd_rows = [],
            ins_rows = []
          _.each(req.body.rows, o => {
            if (o.hasOwnProperty('id')) {
              upd_rows.push({
                id: o.id,
                set: {
                  name: o.name,
                  blood_rel: o.blood_rel,
                  cnic_numb: o.cnic_numb,
                  contact_numb: o.contact_numb
                }
              })
            } else {
              ins_rows.push([req.decoded.data.user_id, o.name, o.blood_rel, o.cnic_numb, o.contact_numb])
            }
          })

          let thr_err;
          if (ins_rows.length > 0) {
            await new Promise(resInner => {
              connection.query(
                `INSERT INTO nominations (member_id, name, blood_rel, cnic_numb, contact_numb) VALUES ?`, [ins_rows],
                async function (error, result) {
                  if (error) {
                    thr_err = error;
                  }
                  resInner()
                })
            })
            if (thr_err) {
              err_cb(thr_err)
              return resolve()
            }
          }

          if (upd_rows.length > 0) {
            for (let row of upd_rows) {
              await new Promise(resInner => {
                connection.query(
                  `UPDATE nominations SET ? WHERE id=?`,
                  [row.set, row.id],
                  function (error) {
                    if (error) {
                      thr_err = error;
                    }
                    resInner()
                  }
                )
              })
              if (thr_err) break
            }
            if (thr_err) {
              err_cb(thr_err)
              return resolve()
            }
          }
          return resolve()
        },
        function (error) {
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

module.exports = router