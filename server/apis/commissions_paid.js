const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')

router.post('/user_id_check', function (req, res) {
    if (/^[0-9]*$/.test(req.body.user_id) && /^[0-9]*$/.test(req.body.recv_user_ans_id)) {
        let user_id = req.body.user_id
        let recv_u_asn_id = req.body.recv_user_ans_id

        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                connection.query('SELECT count(*) as count FROM members WHERE user_asn_id=? AND id<>?', [recv_u_asn_id, user_id], function (error, results, fields) {
                    connection.release();
                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ count: results[0].count })
                    }
                })
            }
        })
    } else {
        res.json({ status: false, message: 'Invalid parameters!' })
    }
})

router.get("/:id", function (req, res, next) {
    if (/^[0-9]*$/.test(req.params.id)) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                connection.query('SELECT SUM(amount) AS total FROM commission_paid_m WHERE member_id=?', req.params.id, function (error, results, fields) {
                    if (error) {
                        connection.release();
                        res.status(500).json({ error })
                    } else {
                        let total = results[0].total
                        let opt = {
                            sql: `SELECT id, remarks AS description, amount, created_at AS date 
                            FROM commission_paid_m
                            WHERE member_id=?
                            ORDER BY id DESC`
                        }
                        connection.query(opt, req.params.id, function (error, results, fields) {
                            connection.release();
                            if (error) {
                                res.status(500).json({ error })
                            } else {
                                res.json({ data: results, total })
                            }
                        })
                    }
                })
            }
        })
    } else {
        next()
    }
})

router.post("/withdraw", function (req, res) {
    let id = req.body.id
    let amount = parseInt(req.body.amount)

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

                        let mem_opt = {
                            sql: `SELECT ivm.wallet
                            FROM info_var_m as ivm
                            WHERE ivm.member_id=?`
                        }
                        connection.query(mem_opt, id, function (error, results, fields) {
                            if (error) {
                                throw_error = error
                                return resolve()
                            } else {
                                let mem_wallet = results[0].wallet

                                let info_param = {
                                    wallet: parseInt(mem_wallet) - amount
                                }
                                connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [info_param, id], function (error, results, fields) {
                                    if (error) {
                                        throw_error = error
                                        return resolve()
                                    } else {

                                        connection.query('INSERT INTO `transactions_m` SET ?', {
                                            member_id: id,
                                            remarks: "Withdraw Amount From Wallet",
                                            credit: amount
                                        }, function (error, results, fields) {
                                            if (error) {
                                                throw_error = error
                                            }
                                            return resolve()
                                        })
                                    }
                                })
                            }
                        })

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

router.post("/transfer_funds", function (req, res) {

    if (/^[0-9]*$/.test(req.body.id) && /^[0-9]*$/.test(req.body.user_asn_id) && /^[0-9]*$/.test(req.body.amount)) {
        let id = req.body.id
        let recv_user_asn_id = req.body.user_asn_id
        let amount = parseInt(req.body.amount)

        if (amount >= 100) {

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

                                let sender_opt = {
                                    sql: `SELECT ivm.wallet, m.user_asn_id
                                    FROM members as m
                                    JOIN info_var_m as ivm
                                    ON m.id=ivm.member_id
                                    WHERE m.id=?`
                                }
                                connection.query(sender_opt, id, function (error, results, fields) {
                                    if (error) {
                                        throw_error = error
                                        return resolve()
                                    } else {
                                        let sender_user_asn_id = results[0].user_asn_id
                                        let sender_wallet = results[0].wallet

                                        let recv_opt = {
                                            sql: `SELECT ivm.wallet, ivm.member_id
                                            FROM members as m
                                            JOIN info_var_m as ivm
                                            ON m.id=ivm.member_id
                                            WHERE m.user_asn_id=?`
                                        }

                                        connection.query(recv_opt, recv_user_asn_id, function (error, results, fields) {
                                            if (error) {
                                                throw_error = error
                                                return resolve()
                                            } else {
                                                let recv_id = results[0].member_id
                                                let recv_wallet = results[0].wallet
                                                let recv_params = {
                                                    wallet: parseInt(recv_wallet) + amount
                                                }

                                                connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [recv_params, recv_id], function (error, results, fields) {
                                                    if (error) {
                                                        throw_error = error
                                                        return resolve()
                                                    } else {
                                                        let sender_params = {
                                                            wallet: parseInt(sender_wallet) - amount,
                                                        }

                                                        connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [sender_params, id], function (error, results, fields) {
                                                            if (error) {
                                                                throw_error = error
                                                                return resolve()
                                                            } else {

                                                                connection.query('INSERT INTO `transactions_m` SET ?', {
                                                                    member_id: id,
                                                                    remarks: "Funds Transfered To User ID " + recv_user_asn_id,
                                                                    credit: amount
                                                                }, function (error, results, fields) {
                                                                    if (error) {
                                                                        throw_error = error
                                                                        return resolve()
                                                                    } else {

                                                                        connection.query('INSERT INTO `transactions_m` SET ?', {
                                                                            member_id: recv_id,
                                                                            remarks: "Funds Received From User ID " + sender_user_asn_id,
                                                                            debit: amount
                                                                        }, function (error, results, fields) {
                                                                            if (error) {
                                                                                throw_error = error
                                                                            }
                                                                            return resolve()
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
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

        } else {
            res.json({ status: false, message: 'Minimum transfer funds send 100.' })
        }
    } else {
        res.json({ status: false, message: 'Invalid parameters!' })
    }
})

module.exports = router
