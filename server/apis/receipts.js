const express = require('express')
const router = express.Router()
const moment = require("moment")
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
const upload = multer({ storage })

const db = require('../db.js')

router.post("/upload_pd_rcp", upload.single('receipt'), function (req, res) {
    if (/^[0-9]*$/.test(req.body.id)) {
        let id = req.body.id

        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({ error })
            } else {
                connection.query('INSERT INTO user_receipts SET ?', {
                    id: req.body.file_id,
                    member_id: id,
                    file_name: req.body.file_name,
                }, function (error, results) {
                    if (error) {
                        connection.release();
                        res.status(500).json({ error })
                    } else {
                        res.json({ status: true })
                    }
                })
            }
        })
    } else {
        res.json({ status: false, message: 'Invalid parameters!' })
    }
})

router.post("/upload_cm_rcp", upload.single('receipt'), function (req, res) {
    if (/^[0-9]*$/.test(req.body.mem_id) && /^[0-9]*$/.test(req.body.cm_id)) {
        let mem_id = req.body.mem_id
        let cm_id = req.body.cm_id

        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).json({ error })
            } else {
                connection.beginTransaction(async function (error) {
                    if (error) {
                        connection.release()
                        res.status(500).json({ error })
                    } else {
                        let throw_error = null

                        await new Promise(resolve => {
                            connection.query('INSERT INTO user_receipts SET ?', {
                                id: req.body.file_id,
                                member_id: mem_id,
                                file_name: req.body.file_name,
                                type: 1
                            }, function (error, results) {
                                if (error) {
                                    throw_error = error
                                    return resolve()
                                } else {
                                    connection.query("UPDATE commissions SET ? WHERE id=?", [{
                                        receipt_id: req.body.file_id
                                    }, cm_id], function (error, results) {
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
                            connection.commit(function (error) {
                                if (error) {
                                    return connection.rollback(function () {
                                        connection.release()
                                        res.status(500).json({ error })
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
