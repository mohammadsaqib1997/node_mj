const express = require('express')
const router = express.Router()

const db = require('../db.js')

router.get("/", function (req, res, next) {
    if (req.decoded.data.user_id) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                connection.query(
                    `SELECT * FROM claim_rewards WHERE member_id=?`,
                    req.decoded.data.user_id,
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            res.status(500).json({ error })
                        } else {
                            res.json({ results })
                        }
                    })
            }
        })
    } else {
        res.json({ status: false, message: "No User Found!" })
    }
})

router.post('/claim', function (req, res) {
    if (req.decoded.data.user_id) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                connection.beginTransaction(async function (err) {
                    if (err) {
                        connection.release()
                        res.status(500).json({ err })
                    } else {
                        let throw_error = null

                        await new Promise(resolve => {

                            connection.query(
                                `INSERT INTO claim_rewards SET ?`,
                                {
                                    member_id: req.decoded.data.user_id,
                                    type: req.body.type,
                                    level: req.body.level
                                },
                                function (error, results, fields) {
                                    if (error) {
                                        throw_error = error
                                        return resolve()
                                    } else {
                                        connection.query(`SELECT user_asn_id, email FROM members WHERE id=${req.decoded.data.user_id}`, function (error, result) {
                                            if (error) {
                                                throw_error = error
                                                return resolve()
                                            } else {
                                                connection.query('INSERT INTO `notifications` SET ?', {
                                                    from_type: 0,
                                                    from_txt: result[0].email,
                                                    to_type: 1,
                                                    from_id: req.decoded.data.user_id,
                                                    to_id: 1,
                                                    message: "Claim Request From User ID " + result[0].user_asn_id + " Reward Level -> " + req.body.level,
                                                    notify_type: 3
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
    } else {
        res.json({ status: false, message: "No User Found!" })
    }
})

router.post('/re-claim', function (req, res) {
    if (req.decoded.data.user_id) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                connection.beginTransaction(async function (err) {
                    if (err) {
                        connection.release()
                        res.status(500).json({ err })
                    } else {
                        let throw_error = null

                        await new Promise(resolve => {

                            connection.query(
                                `UPDATE claim_rewards SET ? WHERE member_id=? AND level=?`,
                                [
                                    {
                                        type: req.body.type,
                                        status: 0
                                    },
                                    req.decoded.data.user_id,
                                    req.body.level
                                ],
                                function (error, results, fields) {
                                    if (error) {
                                        throw_error = error
                                        return resolve()
                                    } else {
                                        connection.query(`SELECT user_asn_id, email FROM members WHERE id=${req.decoded.data.user_id}`, function (error, result) {
                                            if (error) {
                                                throw_error = error
                                                return resolve()
                                            } else {
                                                connection.query('INSERT INTO `notifications` SET ?', {
                                                    from_type: 0,
                                                    from_txt: result[0].email,
                                                    to_type: 1,
                                                    from_id: req.decoded.data.user_id,
                                                    to_id: 1,
                                                    message: "Re-Claim Request From User ID " + result[0].user_asn_id + " Reward Level -> " + req.body.level,
                                                    notify_type: 3
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
    } else {
        res.json({ status: false, message: "No User Found!" })
    }
})

router.post("/sts_change", function (req, res) {
    if (req.decoded.data.type > 0) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                connection.beginTransaction(async function (err) {
                    if (err) {
                        connection.release()
                        res.status(500).json({ err })
                    } else {
                        let throw_error = null

                        await new Promise(resolve => {
                            let notify_msg = `Your Claim Request has been ${req.body.sts === 1 ? 'Accepted' : 'Canceled'} Reward Level -> ${req.body.lvl}.`,
                                params = {
                                    status: req.body.sts
                                }

                            if (req.body.sts === 2) {
                                notify_msg += " Reason is: " + req.body.reason
                                params['cancel_reason'] = req.body.reason
                            }

                            connection.query(
                                `UPDATE claim_rewards SET ? WHERE member_id=? AND level=?`,
                                [
                                    params,
                                    req.body.mem_id,
                                    req.body.lvl,
                                ],
                                function (error, results, fields) {
                                    if (error) {
                                        throw_error = error
                                        return resolve()
                                    } else {
                                        connection.query('INSERT INTO `notifications` SET ?', {
                                            from_type: 1,
                                            from_txt: "Admin",
                                            to_type: 0,
                                            from_id: 1,
                                            to_id: req.body.mem_id,
                                            message: notify_msg,
                                            notify_type: 0
                                        }, function (error, results, fields) {
                                            if (error) {
                                                throw_error = error
                                            }
                                            return resolve()
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
        res.json({ status: false, message: "No Admin Found!" })
    }
})

module.exports = router
