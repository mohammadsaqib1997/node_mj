const express = require('express')
const router = express.Router()


const db = require('../db.js')

router.get("/", function (req, res) {

    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ error })
        } else {
            connection.query('SELECT `id`,`email`,`full_name`,`active_sts` FROM `moderators`', function (error, results, fields) {
                connection.release();

                if (error) {
                    res.status(500).json({ error })
                } else {
                    res.json({ data: results })
                }

            });
        }
    })
})

router.get("/:id", function (req, res) {

    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ error })
        } else {
            connection.query('SELECT * FROM moderators WHERE id=?', [req.params.id], function (error, results, fields) {
                connection.release();

                if (error) {
                    res.status(500).json({ error })
                } else {
                    res.json({ data: results })
                }

            });
        }
    })
})

router.post('/add', function (req, res) {

    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ err })
        } else {
            connection.query('INSERT INTO `moderators` SET ?', req.body, function (error, results, fields) {
                connection.release()
                if (error) {
                    res.status(500).json({ error })
                } else {
                    res.json({ status: true })
                }
            });
        }
    })

})


router.post('/update', function (req, res) {

    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ err })
        } else {
            connection.query('UPDATE `moderators` SET ? WHERE id=?', [req.body.data, req.body.update_id], function (error, results, fields) {
                connection.release()
                if (error) {
                    res.status(500).json({ error })
                } else {
                    res.json({ status: true })
                }
            });
        }
    })

})

module.exports = router
