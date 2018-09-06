const mysql = require("mysql")

const config = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'mj_supreme'
}

const db = mysql.createPool(config)

call()

async function call() {
    return await new Promise(resolve => {
        db.getConnection(async function (err, connection) {
            if (err) {
                console.log(err)
                return resolve()
            } else {
                connection.beginTransaction(async function (err) {
                    if (err) {
                        connection.release()
                        console.log(err)
                        return resolve()
                    } else {
                        let throw_error = null
                        await new Promise(resolve_2 => {

                            connection.query(`
                                SELECT m.user_asn_id, m.id, m.email, iv.wallet
                                FROM info_var_m as iv
                                LEFT JOIN members as m
                                ON iv.member_id = m.id
                            `, async function (err, results) {
                                    if (err) {
                                        throw_error = err
                                        return resolve_2()
                                    } else {
                                        if (results.length > 0) {
                                            for (result of results) {
                                                let mem_wallet = parseInt(result.wallet)
                                                if (mem_wallet === 0) {
                                                    continue
                                                }
                                                let mem_id = result.id
                                                let mem_email = result.email
                                                let mem_asn_id = result.user_asn_id
                                                await new Promise(resolve_3 => {
                                                    connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [{ wallet: 0 }, mem_id], function (error, results, fields) {
                                                        if (error) {
                                                            throw_error = error
                                                            return resolve_3()
                                                        } else {
                                                            connection.query('INSERT INTO `transactions_m` SET ?', {
                                                                member_id: mem_id,
                                                                remarks: "All Commission has been Withdraw.",
                                                                credit: mem_wallet
                                                            }, function (error, results, fields) {
                                                                if (error) {
                                                                    throw_error = error
                                                                    return resolve_3()
                                                                } else {
                                                                    let trans_id = results.insertId

                                                                    connection.query('INSERT INTO `notifications` SET ?', {
                                                                        from_type: 1,
                                                                        to_type: 0,
                                                                        from_id: 1,
                                                                        to_id: mem_id,
                                                                        from_txt: "Admin",
                                                                        message: `Deduct Amount Rs.${mem_wallet}/- in your wallet.`,
                                                                        notify_type: 0
                                                                    }, function (error, results, fields) {
                                                                        if (error) {
                                                                            throw_error = error
                                                                            return resolve_3()
                                                                        } else {
                                                                            connection.query('INSERT INTO `commissions` SET ?', {
                                                                                trans_id: trans_id,
                                                                                member_id: mem_id,
                                                                                remarks: "Withdrawal Request From User ID " + mem_asn_id,
                                                                                amount: mem_wallet,
                                                                                status: 1
                                                                            }, function (error, results, fields) {
                                                                                if (error) {
                                                                                    throw_error = error
                                                                                    return resolve_3()
                                                                                } else {
                                                                                    connection.query('INSERT INTO `notifications` SET ?', {
                                                                                        from_type: 0,
                                                                                        to_type: 1,
                                                                                        from_id: mem_id,
                                                                                        to_id: 1,
                                                                                        from_txt: mem_email,
                                                                                        message: `Withdrawal Request From User ID ${mem_asn_id} Amount Rs.${mem_wallet}/- Transaction ID ${trans_id}`,
                                                                                        notify_type: 2
                                                                                    }, function (error, results, fields) {
                                                                                        if (error) {
                                                                                            throw_error = error
                                                                                        }
                                                                                        return resolve_3()
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
                                                if (throw_error) break
                                            }
                                        }
                                        return resolve_2()
                                    }
                                })


                        })

                        if (throw_error) {
                            connection.rollback(function () {
                                connection.release()
                                console.log(throw_error)
                                return resolve()
                            });
                        } else {
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        connection.release()
                                        console.log(err)
                                        return resolve()
                                    });
                                } else {
                                    connection.release()
                                    console.log("All Done")
                                    return resolve()
                                }
                            })
                        }
                    }
                })
            }
        })
    })
}