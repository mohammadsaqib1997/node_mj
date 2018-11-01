const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')

router.get('/email-info', function (req, res) {
    if (req.decoded.data.type === 0) {
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({
                    error
                })
            } else {
                let last_1_day = moment().subtract(1, 'd').startOf('d').format('YYYY-MM-DD HH-mm-ss')
                connection.query(
                    `SELECT m.email_v_sts, t.created_at
                    FROM members as m
                    LEFT JOIN tokens as t
                    ON m.id=t.member_id AND t.created_at>'${last_1_day}'
                    WHERE m.id=${req.decoded.data.user_id}`,
                    function (error, result) {
                        connection.release()
                        if (error) {
                            res.status(500).json({
                                error
                            })
                        } else {
                            res.json({
                                status: true,
                                email_v_sts: result[0].email_v_sts,
                                last_email: (result[0].created_at !== null) ? true : false
                            })
                        }
                    }
                )
            }
        })
    } else {
        res.json({
            status: false,
            message: "Invalid Request!"
        })
    }

})

module.exports = router