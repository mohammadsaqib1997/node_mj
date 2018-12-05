const express = require('express')
const router = express.Router()
const fs = require('fs')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../uploads/partners_logo')
    },
    filename: function (req, file, cb) {
        let newFile = Date.now() + typeGet(file.mimetype)
        req.body.logo = newFile
        cb(null, newFile)
    }
})
const upload = multer({
    storage
})

const db = require('../db.js')

router.get('/list', function (req, res) {
    if (req.decoded.data.type === 2) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    err
                })
            } else {
                let offset = 0,
                    limit = 10,
                    search = ""
                if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
                    limit = req.query.limit
                }

                if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
                    offset = (parseInt(req.query.page) - 1) * limit
                }

                if (req.query.search) {
                    search = req.query.search
                }

                connection.query(
                    `SELECT COUNT(*) as total_rows 
                    FROM partners
                    ${(search !== '') ? 'WHERE': ''}
                    ${(search !== '') ? '(id LIKE ? OR email LIKE ? OR full_name LIKE ? OR city LIKE ? OR created_at LIKE ?)' : ''}`,
                    [
                        '%' + search + '%',
                        '%' + search + '%',
                        '%' + search + '%',
                        '%' + search + '%',
                        '%' + search + '%'
                    ],
                    function (error, results, fields) {
                        if (error) {
                            connection.release();
                            res.status(500).json({
                                error
                            })
                        } else {
                            let rows_count = results[0].total_rows

                            connection.query(
                                `SELECT id, email, full_name, city, created_at, active FROM \`partners\`
                                ${(search !== '') ? 'WHERE': ''}
                                ${(search !== '') ? '(id LIKE ? OR email LIKE ? OR full_name LIKE ? OR city LIKE ? OR created_at LIKE ?)' : ''}
                                ORDER BY id DESC
                                LIMIT ${limit}
                                OFFSET ${offset}`,
                                [
                                    '%' + search + '%',
                                    '%' + search + '%',
                                    '%' + search + '%',
                                    '%' + search + '%',
                                    '%' + search + '%'
                                ],
                                function (error, results, fields) {
                                    connection.release();
                                    if (error) {
                                        res.status(500).json({
                                            error
                                        })
                                    } else {
                                        res.json({
                                            data: results,
                                            total_rows: rows_count
                                        })
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
})

router.get('/full_info/:id', function (req, res) {
    if (req.decoded.data.type === 2 && /^[0-9]*$/.test(req.params.id)) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    err
                })
            } else {
                connection.query('SELECT * FROM `partners` WHERE `id`=?', [req.params.id], function (error, results, fields) {
                    connection.release();
                    if (error) {
                        res.status(500).json({
                            error
                        })
                    } else {
                        res.json({
                            result: results[0]
                        })
                    }
                })
            }
        })
    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
})

router.get('/logo/:file_name', function (req, res) {
    if (req.decoded.data.type === 2 && req.params.file_name !== '') {
        if (fs.existsSync(__dirname + "/../uploads/partners_logo/" + req.params.file_name)) {
            not_found = false
            let file = fs.readFileSync(__dirname + "/../uploads/partners_logo/" + req.params.file_name)
            return res.send(file)
        } else {
            res.status(404).json({
                message: 'Not found!'
            })
        }
    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
});

router.post("/check_email", function (req, res) {
    if (req.decoded.data.type === 2) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    err
                })
            } else {
                connection.query('SELECT email FROM `partners` where binary `email`=?', [req.body.email], function (error, results, fields) {
                    connection.release();
                    if (error) {
                        res.status(500).json({
                            error
                        })
                    } else {
                        res.json({
                            count: results.length
                        })
                    }
                })
            }
        })
    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
})

router.post('/add', upload.single('logo'), function (req, res) {
    if (req.decoded.data.type === 2) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    err
                })
            } else {
                connection.query('INSERT INTO partners SET ?', req.body, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        res.status(500).json({
                            error
                        })
                    } else {
                        res.json({
                            status: true
                        })
                    }
                })
            }
        })

    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
})

router.post('/update', upload.single('logo'), function (req, res) {
    if (req.decoded.data.type === 2) {
        const updated_id = req.body.update_id;
        delete req.body.update_id;
        if (!req.body.logo && req.body.logo_remove != 'null') {
            if (fs.existsSync(__dirname + "/../uploads/partners_logo/" + req.body.logo_remove)) {
                fs.unlinkSync(__dirname + "/../uploads/partners_logo/" + req.body.logo_remove)
            }
            req.body.logo = null
            delete req.body.logo_remove
        } else if (req.body.logo && req.body.logo_remove) {
            if (fs.existsSync(__dirname + "/../uploads/partners_logo/" + req.body.logo_remove)) {
                fs.unlinkSync(__dirname + "/../uploads/partners_logo/" + req.body.logo_remove)
            }
            delete req.body.logo_remove
        }
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    err
                })
            } else {
                connection.query('UPDATE partners SET ? WHERE id=?', [req.body, updated_id], function (error, results, fields) {
                    connection.release();
                    if (error) {
                        res.status(500).json({
                            error
                        })
                    } else {
                        res.json({
                            status: true
                        })
                    }
                })
            }
        })
    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
})

router.post('/active_change', function (req, res) {
    if (req.decoded.data.type === 2) {
        const updated_id = req.body.update_id;
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    err
                })
            } else {
                connection.query(
                    'UPDATE partners SET ? WHERE id=?', [{
                        active: req.body.sts
                    }, updated_id],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            res.status(500).json({
                                error
                            })
                        } else {
                            res.json({
                                status: true
                            })
                        }
                    })
            }
        })
    } else {
        res.json({
            status: false,
            message: "Permission Denied!"
        })
    }
})

module.exports = router

function typeGet(mimetype) {
    let type = ""
    if (mimetype === "image/png") {
        type = ".png"
    }
    if (mimetype === "image/jpeg") {
        type = ".jpg"
    }
    return type
}