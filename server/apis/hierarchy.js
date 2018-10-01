const express = require('express')
const router = express.Router()
const _ = require('lodash')

const db = require('../db.js')

router.post("/", function (req, res) {
    let id = req.body.id

    if (!/^[0-9]*$/.test(id)) {
        res.status(403).json({ error: { message: "Invalid parameter!" } })
    } else {
        db.getConnection(async function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                h_users(connection, id, function (err, result) {
                    connection.release()
                    if (err) {
                        res.status(500).json({ err })
                    } else {
                        res.json({ data: result })
                    }
                })
            }
        })
    }
})

router.get('/first_user', function (req, res) {
    db.getConnection(async function (err, connection) {
        if (err) {
            res.status(500).json({ error })
        } else {
            connection.query(`SELECT member_id FROM hierarchy_m WHERE id=1`, function (error, results, fields) {
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

router.get('/refl/direct/:id', function (req, res) {
    if (/^[0-9]*$/.test(req.params.id)) {

        db.getConnection(async function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                let member = {}
                await new Promise(resolve => {
                    connection.query(gen_h_sql('member_id', req.params.id, 1), async function (error, results, fields) {
                        if (error) {
                            connection.release();
                            resolve()
                            res.status(500).json({ error })
                        } else {
                            if (results.length > 0) {
                                member = results[0]
                            } else {
                                connection.release();
                            }
                            resolve()
                        }
                    })
                })

                if (!_.isEmpty(member)) {
                    let grab_results = []
                    await new Promise(resolve => {
                        let opt = {
                            sql: `SELECT m.id, m.user_asn_id, m.full_name, m.ref_user_asn_id, hm.id as hm_id, hm.parent_id, ivm.level, ivm.direct_ref_count, ivm.in_direct_ref_count
                                FROM members as m
                                LEFT JOIN hierarchy_m AS hm
                                ON m.id=hm.member_id
                                LEFT JOIN info_var_m AS ivm
                                ON m.id=ivm.member_id
                                WHERE m.ref_user_asn_id = ${member.user_asn_id} AND m.is_paid_m=1
                                ORDER BY hm_id ASC LIMIT 20`
                        }
                        connection.query(opt, async function (error, results, fields) {
                            connection.release();
                            if (error) {
                                resolve()
                                res.status(500).json({ error })
                            } else {
                                if (results.length > 0) {
                                    let i = -1
                                    grab_results = await _.groupBy(results, function (o) {
                                        i++
                                        return Math.floor(i / 4)
                                    })
                                }
                                resolve()
                            }
                        })
                    })

                    // create tree
                    for (ind in grab_results) {
                        let i = -1
                        for (item of grab_results[ind]) {
                            i++
                            if (ind < 1) {
                                item['directRef'] = true
                                _.set(member, ['childrens', i], item)
                            } else {
                                item['directRef'] = true
                                _.set(member, ['childrens', ind - 1, 'childrens', i], item)
                            }

                        }
                    }
                    let tree = [member]

                    res.json({ status: true, results: tree })
                } else {
                    res.json({ status: false, message: 'No member found!' })
                }
            }
        })


    } else {
        res.json({ status: false, message: 'Invalid parameters!' })
    }

})

router.get('/find/:param', function (req, res) {
    let is_user = false, user_id = null
    if (req.decoded.data.user_id && req.decoded.data.type === 0) {
        is_user = true
        user_id = req.decoded.data.user_id
    }
    let param = req.params.param
    db.getConnection(async function (err, connection) {
        if (err) {
            res.status(500).json({ err })
        } else {
            if (is_user === true) {

                connection.query(
                    `WITH RECURSIVE cte (id, user_asn_id, full_name, email) AS
                    (
                     SELECT h_m.member_id as id, m.user_asn_id, m.full_name, m.email
                     FROM hierarchy_m AS h_m
                     LEFT JOIN members AS m
                     ON h_m.member_id = m.id
                     WHERE m.id = ${user_id}
                     
                     UNION ALL
                     
                     SELECT h_m.member_id as id, m.user_asn_id, m.full_name, m.email
                     FROM hierarchy_m AS h_m
                     LEFT JOIN members AS m
                     ON h_m.member_id = m.id
                     INNER JOIN cte
                     ON m.ref_user_asn_id = cte.user_asn_id
                    )
                    SELECT * FROM cte 
                    WHERE id <> ${user_id} 
                    AND (user_asn_id LIKE ? OR full_name LIKE ? OR email LIKE ?)
                    ORDER BY id
                    LIMIT 10;`,
                    ['%' + param + '%', '%' + param + '%', '%' + param + '%'],
                    function (err, result) {
                        connection.release()
                        if (err) {
                            res.status(500).json({ err })
                        } else {
                            res.json({ result: result })
                        }
                    }
                )
                
            } else {
                connection.query(`
                SELECT h_m.member_id AS id, m.email, m.user_asn_id, m.full_name
                FROM hierarchy_m AS h_m
                LEFT JOIN members AS m
                ON h_m.member_id = m.id
                WHERE 
                (m.user_asn_id LIKE ?
                OR
                m.email LIKE ?
                OR
                m.full_name LIKE ?)
                ORDER BY h_m.id DESC
                LIMIT 10
                `, ['%' + param + '%', '%' + param + '%', '%' + param + '%'], function (err, result) {
                        connection.release()
                        if (err) {
                            res.status(500).json({ err })
                        } else {
                            res.json({ result: result })
                        }
                    })
            }

        }
    })
})

module.exports = router

async function h_users(connection, id, cb) {
    let g_results = [];
    let grab_data = [];
    let throw_err = null


    await new Promise(resolve => {
        connection.query(gen_h_sql('member_id', id, 1), async function (error, results, fields) {
            if (error) {
                throw_err = error
                resolve()
            } else {
                if (results.length > 0) {
                    g_results.push(results)
                }
                resolve()
            }
        })
    })

    if (throw_err) {
        return cb(throw_err, grab_data)
    }

    for (result of g_results) {
        let is_full = false
        await new Promise(async resolve => {
            row_loop: for (row of result) {
                grab_data.push(row)
                if (grab_data.length < 21) {
                    await new Promise(resolve2 => {
                        connection.query(gen_h_sql('parent_id', row.hm_id, (21 - grab_data.length)), async function (error, results, fields) {
                            if (error) {
                                throw_err = error
                                resolve2()
                            } else {
                                if (results.length > 0) {
                                    g_results.push(results)
                                }
                                resolve2()
                            }
                        })
                    })
                    if (throw_err) {
                        resolve()
                        break row_loop
                    }
                } else {
                    is_full = true
                    resolve()
                    break row_loop
                }
            }
            resolve()
        })
        if (throw_err || is_full) {
            break
        }
    }
    return cb(throw_err, grab_data)
}

function gen_h_sql(param, id, limit) {
    return {
        sql: `SELECT m.id, m.user_asn_id, m.full_name, m.ref_user_asn_id, hm.id as hm_id, hm.parent_id, ivm.level, ivm.direct_ref_count, ivm.in_direct_ref_count
            FROM hierarchy_m AS hm
            LEFT JOIN members AS m
            ON hm.member_id=m.id
            LEFT JOIN info_var_m AS ivm
            ON m.id=ivm.member_id
            WHERE hm.${param} = ${id}
            LIMIT ${limit}`
    }
}
