const express = require('express')
const router = express.Router()

const db = require('../db.js')

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

router.get('/ac_search_list/:role/:search', (req, res) => {
  if (req.params.role && req.params.search) {

    if (req.params.role === "0") {

    }
    // db.getConnection(function (err, connection) {
    //   if (err) {
    //     res.status(500).json({
    //       err
    //     })
    //   } else {
        
    //   }
    // })

  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }

})

router.post('/get-user-info', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT id, full_name FROM `members` where binary `email`=? OR binary `user_asn_id`=?', [req.body.email, req.body.email], function (error, results, fields) {
        connection.release();
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          if (results.length > 0) {
            res.json({
              result: results[0],
              count: 1
            })
          } else {
            res.json({
              count: 0
            })
          }
        }
      });
    }
  })
})



module.exports = router