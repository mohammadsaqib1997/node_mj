const express = require('express')
const router = express.Router()

const db = require('../db.js')

router.get("/:id", function (req, res, next) {

    if (/^[0-9]*$/.test(req.params.id)) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                connection.query('SELECT * FROM `user_bank_details` WHERE member_id=?', req.params.id, function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ data: results[0] })
                    }

                });
            }
        })
    } else {
        next()
    }
})

module.exports = router
