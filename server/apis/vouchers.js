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

// router.post("/update", function (req, res) {
//   db.getConnection(function (err, connection) {
//     if (err) {
//       res.status(500).json({
//         error
//       })
//     } else {
//       db_util.connectTrans(connection, function (resolve, err_cb) {
//         connection.query(
//           `SELECT * 
//           FROM c_subsidiary 
//           WHERE id='${req.body.update_id}'`,
//           async function (error, result) {
//             if (error) {
//               err_cb(error)
//               resolve()
//             } else {
//               let p_code = result[0].parent_code
//               let code = result[0].code
//               if (p_code !== req.body.sel_control) {
//                 let thr_err = null
//                 await new Promise(resolve2 => {
//                   connection.query(
//                     `SELECT code 
//                     FROM c_subsidiary 
//                     WHERE parent_code='${req.body.sel_control}' 
//                     ORDER BY code DESC LIMIT 1`,
//                     function (error, result) {
//                       if (error) {
//                         thr_err = error
//                         return resolve2()
//                       } else {
//                         let new_inc = result.length > 0 ? (parseInt(result[0].code) + 1).toString() : '1'
//                         code = (new_inc.length < 4) ? ("0000" + new_inc).substr(-4, 4) : new_inc
//                         return resolve2()
//                       }
//                     }
//                   )
//                 })
//                 if (thr_err) {
//                   err_cb(thr_err)
//                   return resolve()
//                 }
//               }

//               connection.query(
//                 `UPDATE c_subsidiary SET ? WHERE id=?`, [{
//                   code: code,
//                   name: req.body.subs_name,
//                   type: 1,
//                   parent_code: req.body.sel_control
//                 }, req.body.update_id],
//                 function (error, result) {
//                   if (error) {
//                     err_cb(error)
//                   }
//                   resolve()
//                 })
//             }
//           })
//       }, function (error) {
//         if (error) {
//           res.status(500).json({
//             error
//           })
//         } else {
//           res.json({
//             status: true
//           })
//         }
//       })
//     }
//   })
// })

// router.post('/delete', function (req, res) {
//   db.getConnection(function (err, connection) {
//     if (err) {
//       res.status(500).json({
//         error
//       })
//     } else {
//       connection.query(
//         `DELETE FROM c_subsidiary WHERE id=?`,
//         req.body.del_id,
//         function (error, result) {
//           connection.release()
//           if (error) {
//             res.status(500).json({
//               error
//             })
//           } else {
//             res.json({
//               status: true
//             })
//           }
//         }
//       )
//     }
//   })
// })


module.exports = router