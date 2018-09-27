const express = require('express')
const router = express.Router()

const db = require('../db.js')

router.get("/:id", function (req, res, next) {

    if (/^[0-9]*$/.test(req.params.id)) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                connection.query('SELECT account_number, account_title, address, bank_name, branch_code, iban_number FROM `user_bank_details` WHERE member_id=?', req.params.id, function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ data: (results.length > 0) ? results[0] : {} })
                    }

                });
            }
        })
    } else {
        next()
    }
})

router.post("/update", function (req, res) {
    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ error })
        } else {
            connection.beginTransaction(async function (err) {
                if (err) {
                    connection.release()
                    res.status(500).json({ err })
                } else {
                    let throw_error = null

                    await new Promise(resolve => {
                        connection.query('SELECT COUNT(*) as count FROM `user_bank_details` WHERE member_id=?', req.decoded.data.user_id, function (error, results, fields) {
                            if (error) {
                                throw_error = error
                                return resolve()
                            } else {
                                let bk_query = ''
                                let params = []
                                if (results[0].count > 0) {
                                    bk_query = 'UPDATE user_bank_details SET ? WHERE member_id=?'
                                    params = [req.body.data, req.decoded.data.user_id]
                                } else {
                                    bk_query = 'INSERT INTO user_bank_details SET ?'
                                    req.body.data['member_id'] = req.decoded.data.user_id
                                    params = [req.body.data]
                                }

                                connection.query(bk_query, params, function (error, results, fields) {
                                    if (error) {
                                        throw_error = error
                                        return resolve()
                                    } else {
                                        return resolve()
                                    }
                                })
                            }
                        });
                    })

                    if (throw_error) {
                        return connection.rollback(function () {
                            connection.release()
                            res.status(500).json({ throw_error })
                        });
                    } else {
                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release()
                                    res.status(500).json({ err })
                                });
                            } else {
                                connection.release()
                                res.json({ status: true })
                            }
                        })
                    }
                }
            })
        }
    })
})

module.exports = router
