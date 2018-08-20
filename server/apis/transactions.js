const express = require('express')
const router = express.Router()

const db = require('../db.js')

router.get("/:id", function (req, res, next) {

    if (/^[0-9]*$/.test(req.params.id)) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                let opt = {
                    sql: `SELECT id, remarks as description, (debit - credit) as detail, created_at as date 
                    FROM transactions_m 
                    WHERE member_id=? 
                    ORDER BY id DESC`
                }
                connection.query(opt, req.params.id, function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ data: results })
                    }

                });
            }
        })
    } else {
        next()
    }
})

module.exports = router
