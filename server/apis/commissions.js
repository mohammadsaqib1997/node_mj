const express = require('express')
const router = express.Router()
const moment = require('moment')

const db = require('../db.js')

router.get('/monthly_data', function (req, res) {
    let grab_months = {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
        11: {},
        12: {},
    }
    db.getConnection(async function (err, connection) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            let throw_error = null

            let date = moment().set('M', 0).set('Y', moment().get('Y') - 1).endOf('Y')
            for (month in grab_months) {
                await new Promise(resolve => {
                    date.add(1, 'month')
                    let start = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss")
                    let end = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

                    connection.query('SELECT COUNT(*) as count FROM commissions WHERE status = 1 AND created_at >= ? AND created_at <= ?', [start, end], function (error, results) {
                        if (error) {
                            throw_error = error
                            resolve()
                        } else {
                            grab_months[month]['paid'] = results[0].count

                            connection.query('SELECT COUNT(*) as count FROM commissions WHERE status = 0 AND created_at >= ? AND created_at <= ?', [start, end], function (error, results) {
                                if (error) {
                                    throw_error = error
                                    resolve()
                                } else {
                                    grab_months[month]['un_paid'] = results[0].count
                                    resolve()
                                }
                            })
                        }
                    })
                })

                if (throw_error) {
                    break
                }
            }
            connection.release();

            if (throw_error) {
                res.status(500).json({ error: throw_error })
            } else {
                res.json({
                    data: grab_months
                })
            }
        }
    })
})

router.get("/un_paid", function (req, res) {
    db.getConnection(function (error, connection) {
        if (error) {
            res.status(500).json({ error })
        } else {
            query = `
            SELECT id, member_id, remarks as description, amount, receipt_id as receipt, created_at as date
            FROM commissions
            WHERE status=0
            ORDER BY id DESC
            `
            connection.query(query, function (error, results) {
                connection.release()
                if (error) {
                    res.status(500).json({ error })
                } else {
                    res.json({ data: results })
                }
            })
        }
    })
})

router.get("/paid", function (req, res) {
    db.getConnection(function (error, connection) {
        if (error) {
            res.status(500).json({ error })
        } else {
            query = `
            SELECT id, member_id, remarks as description, amount, receipt_id as receipt, created_at as date
            FROM commissions
            WHERE status=1
            ORDER BY id DESC
            `
            connection.query(query, function (error, results) {
                connection.release()
                if (error) {
                    res.status(500).json({ error })
                } else {
                    res.json({ data: results })
                }
            })
        }
    })
})

router.post('/set_sts', function (req, res) {

    if (/^[0-9]*$/.test(req.body.id) && /^[0|1|2]$/i.test(req.body.type)) {
        let id = req.body.id
        let type = req.body.type

        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({ error })
            } else {

                connection.beginTransaction(async function (err) {
                    if (err) {
                        connection.release()
                        res.status(500).json({ err })
                    } else {
                        let throw_error = null

                        await new Promise(resolve => {
                            connection.query('UPDATE commissions SET ? WHERE id=?', [{
                                status: type
                            }, id], function (error, results) {
                                if (error) {
                                    throw_error = error
                                    return resolve()
                                } else {
                                    if (type === 2) {
                                        connection.query('SELECT member_id, amount FROM commissions WHERE id=?', id, function (error, results) {
                                            if (error) {
                                                throw_error = error
                                                return resolve()
                                            } else {
                                                let mem_id = results[0].member_id
                                                let mem_amount = results[0].amount

                                                connection.query('INSERT INTO transactions_m SET ?', {
                                                    member_id: mem_id,
                                                    remarks: "Your Withdraw Request Has Been Canceled!",
                                                    debit: mem_amount,
                                                }, function (error, results) {
                                                    if (error) {
                                                        throw_error = error
                                                        return resolve()
                                                    } else {
                                                        connection.query('SELECT wallet FROM info_var_m WHERE member_id=?', mem_id, function (error, results) {
                                                            if (error) {
                                                                throw_error = error
                                                                return resolve()
                                                            } else {
                                                                let set_wallet = parseInt(results[0].wallet) + parseInt(mem_amount)
                                                                connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [{
                                                                    wallet: set_wallet
                                                                }, mem_id], function (error, results) {
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
                                    } else {
                                        return resolve()
                                    }
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
        res.json({ status: false, message: 'Invalid parameters!' })
    }

})

router.post('/user_id_check', function (req, res) {
    if (/^[0-9]*$/.test(req.body.user_id) && /^[0-9]*$/.test(req.body.recv_user_ans_id)) {
        let user_id = req.body.user_id
        let recv_u_asn_id = req.body.recv_user_ans_id

        db.getConnection(function (error, connection) {
            if (error) {
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

router.post("/withdraw", function (req, res) {
    let id = req.body.id
    let amount = parseInt(req.body.amount)

    db.getConnection(function (error, connection) {
        if (error) {
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
                            sql: `SELECT ivm.wallet, m.user_asn_id
                            FROM info_var_m as ivm
                            INNER JOIN members as m
                            ON ivm.member_id=m.id
                            WHERE ivm.member_id=?`
                        }
                        connection.query(mem_opt, id, function (error, results, fields) {
                            if (error) {
                                throw_error = error
                                return resolve()
                            } else {
                                let mem_wallet = results[0].wallet
                                let mem_asn_id = results[0].user_asn_id

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
                                                return resolve()
                                            } else {

                                                connection.query('INSERT INTO `commissions` SET ?', {
                                                    member_id: id,
                                                    remarks: "Withdraw Request From User ID " + mem_asn_id,
                                                    amount: amount
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

            db.getConnection(function (error, connection) {
                if (error) {
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
