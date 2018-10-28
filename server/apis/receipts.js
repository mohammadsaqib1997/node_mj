const express = require('express')
const router = express.Router()
const fs = require('fs')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../uploads/receipts')
    },
    filename: function (req, file, cb) {
        let file_id = Date.now()
        let newFile = file_id + typeGet(file.mimetype)
        req.body.file_id = file_id
        req.body.file_name = newFile
        cb(null, newFile)
    }
})
const upload = multer({
    storage
})

const db = require('../db.js')

router.get('/get_invoices', function (req, res) {
    if (req.decoded.data.type === 0) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    error
                })
            } else {
                let offset = 0,
                    limit = 10

                if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
                    limit = req.query.limit
                }

                if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
                    offset = (parseInt(req.query.page) - 1) * limit
                }

                connection.query(
                    `SELECT COUNT(*) as tot_rows
                    FROM user_receipts
                    WHERE member_id=?`,
                    req.decoded.data.user_id,
                    function (error, results) {
                        if (error) {
                            connection.release();
                            res.status(500).json({
                                error
                            })
                        } else {
                            let tot_rows = results[0].tot_rows
                            connection.query(
                                `SELECT u_rpt.id as file_id, u_rpt.file_name, u_rpt.created_at as date, u_rpt.ref_id as id, u_rpt.type
                                FROM user_receipts as u_rpt
                                WHERE u_rpt.member_id=?
                                ORDER BY u_rpt.created_at DESC
                                LIMIT ${limit}
                                OFFSET ${offset}`,
                                req.decoded.data.user_id,
                                function (error, results, fields) {
                                    connection.release();

                                    if (error) {
                                        res.status(500).json({
                                            error
                                        })
                                    } else {
                                        res.json({
                                            result: results,
                                            tot_rows
                                        })
                                    }

                                }
                            );
                        }
                    }
                )
            }
        })
    } else {
        res.json({
            status: false,
            message: 'Invalid User!'
        })
    }
})

router.get('/dn_file/:file_id/:type', function (req, res) {
    if (/^[0-9]*$/.test(req.params.file_id) && /^[0|1]$/.test(req.params.type)) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    error
                })
            } else {
                connection.query(
                    `SELECT file_name FROM user_receipts WHERE id=? AND type=?
                    ${(req.decoded.data.type === 0) ? ' AND member_id="' + req.decoded.data.user_id + '"' : ''}`,
                    [req.params.file_id, req.params.type],
                    function (error, results, fields) {
                        connection.release();

                        if (error) {
                            res.status(500).json({
                                error
                            })
                        } else {
                            if (results.length > 0) {
                                if (fs.existsSync(__dirname + "/../uploads/receipts/" + results[0].file_name)) {
                                    let file = fs.readFileSync(__dirname + "/../uploads/receipts/" + results[0].file_name)
                                    res.send(file)
                                } else {
                                    res.status(404).json({
                                        message: 'Not found!'
                                    })
                                }
                            } else {
                                res.status(404).json({
                                    message: 'Not found!'
                                })
                            }
                        }

                    }
                );
            }
        })
    } else {
        res.json({
            status: false,
            message: 'Invalid parameters!'
        })
    }
})

router.get('/get_list', function (req, res) {
    if (/^[0-9]*$/.test(req.query.ref_id) && /^[0|1]$/.test(req.query.type)) {
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({
                    error
                })
            } else {
                connection.query(
                    'SELECT id, file_name, created_at as date FROM user_receipts WHERE ref_id=? AND type=?',
                    [req.query.ref_id, req.query.type],
                    function (error, results) {
                        connection.release();
                        if (error) {
                            res.status(500).json({
                                error
                            })
                        } else {
                            res.json({
                                results
                            })
                        }
                    }
                )
            }
        })
    } else {
        res.json({
            status: false,
            message: 'Invalid parameters!'
        })
    }
})

router.post('/delete', function (req, res) {
    if (/^[0-9]*$/.test(req.body.id) && req.decoded.data.type !== 0) {
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({
                    error
                })
            } else {
                connection.query(
                    'SELECT file_name FROM user_receipts WHERE id=?',
                    req.body.id,
                    function (error, result) {
                        if (error) {
                            connection.release();
                            res.status(500).json({
                                error
                            })
                        } else {
                            let file_name = result[0].file_name
                            connection.query(
                                'DELETE FROM user_receipts WHERE id=?',
                                req.body.id,
                                function (error, results) {
                                    connection.release();
                                    if (error) {
                                        res.status(500).json({
                                            error
                                        })
                                    } else {
                                        if (fs.existsSync(__dirname + "/../uploads/receipts/" + file_name)) {
                                            fs.unlinkSync(__dirname + "/../uploads/receipts/" + file_name)
                                        }

                                        res.json({
                                            status: true
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
            message: 'Invalid parameters!'
        })
    }
})

router.post('/upload', upload.single('receipt'), function (req, res) {
    if (/^[0-9]*$/.test(req.body.mem_id) && /^[0-9]*$/.test(req.body.ref_id) && /^[0|1]$/.test(req.body.type)) {
        let ref_id = req.body.ref_id,
            mem_id = req.body.mem_id,
            type = req.body.type
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({
                    error
                })
            } else {
                connection.query('INSERT INTO user_receipts SET ?', {
                    id: req.body.file_id,
                    member_id: mem_id,
                    file_name: req.body.file_name,
                    type,
                    ref_id
                }, function (error, results) {
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
            message: 'Invalid parameters!'
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
    if (mimetype === "application/pdf") {
        type = ".pdf"
    }
    if (mimetype === "application/msword") {
        type = ".doc"
    }
    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        type = ".docx"
    }
    if (mimetype === "application/rtf") {
        type = ".rtf"
    }
    if (mimetype === "text/plain") {
        type = ".txt"
    }
    if (mimetype === "image/photoshop" ||
        mimetype === "image/x-photoshop" ||
        mimetype === "image/psd" ||
        mimetype === "application/photoshop" ||
        mimetype === "application/psd" ||
        mimetype === "zz-application/zz-winassoc-psd") {
        type = ".psd"
    }
    return type
}