const express = require('express')
const router = express.Router()


const db = require('../db.js')

router.get("/", function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    }else{
      connection.query('SELECT * FROM `moderators`', function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        }else{
          res.json({ data: results })
        }

      });
    }
  })
})

module.exports = router
