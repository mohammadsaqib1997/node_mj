const express = require('express')
const router = express.Router()

const moment = require('moment')
const _ = require('lodash')
const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 2) {
    return next()
  } else {
    return res.json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/list_voucher', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
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
        FROM vouchers
        ${(search !== '') ? 'WHERE v_id LIKE ?' : ''}`,
        ['%' + search + '%'],
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `SELECT id, v_id, v_date 
              FROM vouchers
              ${(search !== '') ? 'WHERE v_id LIKE ?' : ''}
              ORDER BY v_id DESC
              LIMIT ${limit}
              OFFSET ${offset}`,
              ['%' + search + '%'],
              function (error, result) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.json({
                    data: result,
                    tot_rows
                  })
                }
              })
          }
        })
    }
  })
})

router.get('/load/:id', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `SELECT id, v_id, v_date 
        FROM vouchers
        WHERE id LIKE ?`,
        [req.params.id],
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            if (result.length > 0) {
              let v_data = result[0]
              connection.query(
                `SELECT id, subs_id, particular, debit, credit 
                FROM v_entries
                WHERE v_id LIKE ?`,
                [req.params.id],
                function (error, result) {
                  connection.release()
                  if (error) {
                    res.status(500).json({
                      error
                    })
                  } else {
                    res.json({
                      v_data,
                      v_ent_data: result
                    })
                  }
                })
            } else {
              res.json({
                status: false,
                message: "Invalid Id!"
              })
            }
          }
        })
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
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `INSERT INTO vouchers SET ?`, {
            v_date: moment(req.body.v_date).format("YYYY-MM-DD HH-mm-ss")
          },
          function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let v_ins_id = result.insertId
              let gen_v_id = moment().format('YYYYMMDD')
              gen_v_id = gen_v_id + ((v_ins_id.toString().length < 3) ? ("000" + v_ins_id).substr(-3, 3) : v_ins_id)

              connection.query(
                `UPDATE vouchers SET ? WHERE id=${v_ins_id}`, {
                  v_id: gen_v_id
                },
                function (error, result) {
                  if (error) {
                    err_cb(error)
                    resolve()
                  } else {
                    let mapRows = _.map(req.body.rows, o => {
                      return [v_ins_id, o.subs_id, o.particular, o.debit, o.credit]
                    })
                    connection.query(
                      `INSERT INTO v_entries (v_id, subs_id, particular, debit, credit) VALUES ?`, [mapRows],
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                        }
                        resolve()
                      })
                  }
                })
            }
          })
      }, function (error) {
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

router.post("/update", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `UPDATE vouchers SET ? WHERE id=${req.body.upd_id}`, {
            v_date: moment(req.body.v_date).format("YYYY-MM-DD HH-mm-ss"),
            updated_at: moment().format("YYYY-MM-DD HH-mm-ss")
          },
          async function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {

              let thr_err = null
              for (let upd_row of req.body.rows) {
                if (_.get(upd_row, 'remove', false)) {
                  await new Promise(in_res => {
                    connection.query(
                      `DELETE FROM v_entries WHERE id=${upd_row.id}`,
                      function (error, result) {
                        if (error) {
                          thr_err = error
                        }
                        in_res()
                      })
                  })
                } else if (_.get(upd_row, 'id', null)) {
                  let upd_db_row = _.cloneDeep(upd_row)
                  delete upd_db_row['id']
                  await new Promise(in_res => {
                    connection.query(
                      `UPDATE v_entries SET ? WHERE id=${upd_row.id}`,
                      upd_db_row,
                      function (error, result) {
                        if (error) {
                          thr_err = error
                        }
                        in_res()
                      })
                  })
                } else {
                  await new Promise(in_res => {
                    upd_row['v_id'] = req.body.upd_id;
                    connection.query(
                      `INSERT INTO v_entries SET ?`,
                      upd_row,
                      function (error, result) {
                        if (error) {
                          thr_err = error
                        }
                        in_res()
                      })
                  })
                }

                if (thr_err) break
              }
              if (thr_err) {
                err_cb(thr_err)
              }
              resolve()
            }
          })
      }, function (error) {
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

router.post('/delete', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `DELETE FROM v_entries 
          WHERE v_id='${req.body.del_id}'`,
          async function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              connection.query(
                `DELETE FROM vouchers 
                WHERE id='${req.body.del_id}'`,
                async function (error, result) {
                  if (error) {
                    err_cb(error)
                  }
                  resolve()
                })
            }
          })
      }, function (error) {
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