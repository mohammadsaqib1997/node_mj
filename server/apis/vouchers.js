const express = require('express')
const router = express.Router()

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

router.post("/add", function (req, res) {
    res.json({
        status: true,
        data: req.body
    })
//   db.getConnection(function (err, connection) {
//     if (err) {
//       res.status(500).json({
//         error
//       })
//     } else {
//       db_util.connectTrans(connection, function (resolve, err_cb) {
//         connection.query(
//           `SELECT id, v_id 
//           FROM vouchers 
//           WHERE parent_code='${req.body.sel_control}' 
//           ORDER BY code DESC LIMIT 1`,
//           function (error, result) {
//             if (error) {
//               err_cb(error)
//               resolve()
//             } else {
//               let new_inc = result.length > 0 ? (parseInt(result[0].code) + 1).toString() : '1'
//               new_inc = (new_inc.length < 4) ? ("0000" + new_inc).substr(-4, 4) : new_inc

//               connection.query(
//                 `INSERT INTO c_subsidiary SET ?`, {
//                   code: new_inc,
//                   name: req.body.subs_name,
//                   type: 1,
//                   parent_code: req.body.sel_control
//                 },
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