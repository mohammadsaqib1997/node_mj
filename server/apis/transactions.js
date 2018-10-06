const express = require('express')
const router = express.Router()

const db = require('../db.js')

router.get("/:id", function (req, res, next) {

    if (/^[0-9]*$/.test(req.params.id)) {
        let offset = 0, limit = 10, search = ""

        if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
            limit = req.query.limit
        }

        if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
            offset = (parseInt(req.query.page) - 1) * limit
        }

        if (req.query.search) {
            search = req.query.search
        }

        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                connection.query(`
                SELECT SUM(debit) - SUM(credit) as tot_balance
                FROM transactions_m
                WHERE member_id=? 
                `, [req.params.id], function (error, result) {
                        if (error) {
                            connection.release();
                            res.status(500).json({ error })
                        } else {
                            let tot_balance = result[0].tot_balance

                            connection.query(`
                            SELECT COUNT(*) as tot_rows 
                            FROM transactions_m
                            WHERE member_id=? 
                            ${(search !== '') ? 'AND (id LIKE ? OR remarks LIKE ? OR debit LIKE ? OR credit LIKE ? OR created_at LIKE ?)' : ''}
                            `,
                                [req.params.id, '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
                                function (error, result) {
                                    if (error) {
                                        connection.release();
                                        res.status(500).json({ error })
                                    } else {
                                        let tot_rows = result[0].tot_rows
                                        let opt = {
                                            sql: `SELECT trans.id, trans.remarks as description, trans.debit, trans.credit, trans.created_at as date
                                        FROM transactions_m as trans
                                        LEFT JOIN commissions as cm
                                        ON trans.id=cm.trans_id
                                        WHERE trans.member_id=? 
                                        ${(search !== '') ? 'AND (trans.id LIKE ? OR trans.remarks LIKE ? OR trans.debit LIKE ? OR trans.credit LIKE ? OR trans.created_at LIKE ?)' : ''}
                                        ORDER BY trans.id DESC
                                        LIMIT ${limit}
                                        OFFSET ${offset}`
                                        }
                                        connection.query(opt,
                                            [req.params.id, '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
                                            function (error, results, fields) {
                                                connection.release();

                                                if (error) {
                                                    res.status(500).json({ error })
                                                } else {
                                                    res.json({ data: results, tot_rows, tot_balance })
                                                }

                                            });
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

module.exports = router
