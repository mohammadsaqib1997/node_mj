const express = require('express')
const router = express.Router()
const moment = require("moment")
const fs = require('fs')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../uploads/profile')
    },
    filename: function (req, file, cb) {
        let newFile = Date.now() + typeGet(file.mimetype)
        req.body.file_name = newFile
        cb(null, newFile)
    }
})
const upload = multer({ storage })

const db = require('../db.js')

router.get("/name", function (req, res) {
    if (req.decoded.data.user_id) {
        let query = ''
        if (req.decoded.data.type === 0) {
            query = "SELECT full_name FROM members WHERE id=?"
        } else if (req.decoded.data.type === 1) {
            query = "SELECT full_name FROM moderators WHERE id=?"
        } else {
            query = "SELECT full_name FROM admins WHERE id=?"
        }
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                connection.query(query, req.decoded.data.user_id, function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ name: results[0].full_name })
                    }
                })
            }
        })
    } else {
        res.json({ status: false, message: "No User Found!" })
    }
})

router.get("/file/:id", function (req, res) {
    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ error })
        } else {
            let opt = {
                sql: `SELECT * FROM u_images WHERE user_id=? AND user_type=?`
            }
            connection.query(opt, [req.decoded.data.user_id, req.decoded.data.type], function (error, results, fields) {
                connection.release();

                if (error) {
                    res.status(500).json({ error })
                } else {
                    let not_found = true
                    if (results.length > 0) {
                        if (fs.existsSync(__dirname + "/../uploads/profile/" + results[0].file_name)) {
                            not_found = false
                            let file = fs.readFileSync(__dirname + "/../uploads/profile/" + results[0].file_name)
                            return res.send(file)
                        }
                    }

                    if (not_found) {
                        res.status(404).json({ message: 'Not found!' })
                    }

                }

            });
        }
    })
})

router.get("/", function (req, res) {

    if (req.decoded.data.user_id) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                let query = ''
                if (req.decoded.data.type === 0) {
                    query = "SELECT user_asn_id, email, password, full_name, contact_num, cnic_num, dob, address, ref_user_asn_id, active_sts FROM members WHERE id=?"
                } else if (req.decoded.data.type === 1) {
                    query = "SELECT email, password, full_name, contact_num, cnic_num, address, active_sts FROM moderators WHERE id=?"
                } else {
                    query = "SELECT email, password, full_name, contact_num, cnic_num, address FROM admins WHERE id=?"
                }
                connection.query(query, req.decoded.data.user_id, function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ data: results[0] })
                    }

                });
            }
        })
    } else {
        res.json({ status: false, message: "No User Found!" })
    }
})

router.post("/update", function (req, res) {
    if (req.decoded.data.user_id) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ error })
            } else {
                let query = '', params = {
                    "address": req.body.data.address,
                    "cnic_num": req.body.data.cnic_num,
                    "contact_num": req.body.data.cont_num,
                    "email": req.body.data.email,
                    "full_name": req.body.data.full_name,
                    "password": req.body.data.password
                }
                if (req.decoded.data.type === 0) {
                    query = "UPDATE members SET ? WHERE id=?"
                    params["dob"] = moment(req.body.data.dob).format("YYYY-MM-DD")

                } else if (req.decoded.data.type === 1) {
                    query = "UPDATE moderators SET ? WHERE id=?"
                } else {
                    query = "UPDATE admins SET ? WHERE id=?"
                }

                connection.query(query, [params, req.decoded.data.user_id], function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        res.json({ status: true })
                    }

                });
            }
        })
    } else {
        res.json({ status: false, message: "No User Found!" })
    }
})

router.post("/image_upload", upload.single('profile'), function (req, res) {
    db.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({ error })
        } else {
            connection.query('SELECT * FROM u_images WHERE user_id=? AND user_type=?', [req.decoded.data.user_id, req.decoded.data.type], function (error, results, fields) {
                if (error) {
                    connection.release();
                    res.status(500).json({ error })
                } else {
                    let up_opt = { sql: `INSERT INTO u_images SET ?` }
                    let params = [{
                        user_id: req.decoded.data.user_id,
                        user_type: req.decoded.data.type,
                        file_name: req.body.file_name,
                    }]
                    if (results.length > 0) {
                        up_opt = { sql: `UPDATE u_images SET ? WHERE id=?` }
                        params = [{
                            file_name: req.body.file_name,
                        }, results[0].id]
                        fs.unlink(__dirname + '/../uploads/profile/' + results[0].file_name, err => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                    connection.query(up_opt, params, function (error, results, fields) {
                        connection.release();
                        if (error) {
                            res.status(500).json({ error })
                        } else {
                            res.json({ status: true })
                        }
                    })

                }
            })
        }
    })
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
