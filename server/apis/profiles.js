const express = require('express')
const router = express.Router()
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
                res.status(500).json({ err })
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
                    query = "SELECT user_asn_id, email, password, full_name, contact_num, cnic_num, dob, address, city, ref_user_asn_id, active_sts FROM members WHERE id=?"
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

router.get("/get_comp_prg", function (req, res) {
    if (req.decoded.data.user_id && req.decoded.data.type === 0) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                connection.query(
                    `SELECT m.full_name, m.dob, m.cnic_num, m.email, m.contact_num, m.address, m.user_asn_id, m_bk.bank_name, m_bk.branch_code, m_bk.account_title, m_bk.account_number
                    FROM members as m
                    LEFT JOIN user_bank_details as m_bk
                    ON m.id=m_bk.member_id
                    WHERE m.id=?`,
                    req.decoded.data.user_id,
                    function (err, result) {
                        connection.release()
                        if (err) {
                            res.status(500).json({ err })
                        } else {
                            if (result.length > 0) {
                                let com_fields = 0
                                for (field in result[0]) {
                                    if (result[0][field] !== null && result[0][field] !== "") {
                                        com_fields++
                                    }
                                }
                                let progress = Math.round((com_fields / Object.keys(result[0]).length) * 100)
                                res.json({
                                    progress
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: "No user found!"
                                })
                            }
                        }
                    })
            }
        })
    } else {
        res.json({ status: false, message: "No User Data!" })
    }
})

router.get("/may_i_wallet_req", function (req, res) {
    if (req.decoded.data.user_id && req.decoded.data.type === 0) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                let query = `SELECT m.*, m_bk.bank_name, m_bk.branch_code, m_bk.account_title, m_bk.account_number
                FROM members as m
                LEFT JOIN user_bank_details as m_bk
                ON m.id=m_bk.member_id
                WHERE m.id=?`
                connection.query(query, req.decoded.data.user_id, function (error, results, fields) {
                    connection.release();

                    if (error) {
                        res.status(500).json({ error })
                    } else {
                        let profile_comp = []
                        // member detail
                        if (results[0].active_sts !== 1) {
                            profile_comp.push({
                                message: "Your account has been suspended.",
                            })
                        }
                        if (results[0].address === "" || results[0].address === null) {
                            profile_comp.push({
                                message: "Provide address.",
                            })
                        }
                        if (results[0].cnic_num === "" || results[0].cnic_num === null) {
                            profile_comp.push({
                                message: "Provide CNIC.",
                            })
                        }
                        if (results[0].contact_num === "" || results[0].contact_num === null) {
                            profile_comp.push({
                                message: "Provide contact number.",
                            })
                        }
                        if (results[0].email === "" || results[0].email === null) {
                            profile_comp.push({
                                message: "Provide email address.",
                            })
                        }
                        if (results[0].full_name === "" || results[0].full_name === null) {
                            profile_comp.push({
                                message: "Provide full name.",
                            })
                        }
                        if (results[0].is_paid_m !== 1) {
                            profile_comp.push({
                                message: "You are unpaid member.",
                            })
                        }

                        //bank detail
                        if (results[0].bank_name === "" || results[0].bank_name === null) {
                            profile_comp.push({
                                message: "Provide bank name.",
                            })
                        }
                        if (results[0].branch_code === "" || results[0].branch_code === null) {
                            profile_comp.push({
                                message: "Provide bank branch code.",
                            })
                        }
                        if (results[0].account_title === "" || results[0].account_title === null) {
                            profile_comp.push({
                                message: "Provide bank account title.",
                            })
                        }
                        if (results[0].account_number === "" || results[0].account_number === null) {
                            profile_comp.push({
                                message: "Provide bank account number.",
                            })
                        }

                        // here is response
                        if (profile_comp.length > 0) {
                            res.json({ status: false, errors: profile_comp })
                        } else {
                            res.json({ status: true })
                        }

                    }
                })
            }
        })
    } else {
        res.json({ status: false, message: "No User Data!" })
    }
})

router.get("/get_prd_detail", function (req, res) {
    if (req.decoded.data.user_id && req.decoded.data.type === 0) {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({ err })
            } else {
                connection.query(
                    `SELECT p_d.product_id, p_d.buyer_type, p_d.buyer_pay_type, p_d.buyer_qty_prd, iv_m.package_act_date
                    FROM user_product_details as p_d
                    LEFT JOIN info_var_m as iv_m
                    ON p_d.member_id = iv_m.member_id
                    WHERE p_d.member_id=?`,
                    req.decoded.data.user_id,
                    function (err, result) {
                        connection.release()
                        if (err) {
                            res.status(500).json({ err })
                        } else {
                            if (result.length > 0) {
                                res.json({
                                    data: result[0]
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: "No user data found!"
                                })
                            }
                        }
                    })
            }
        })
    } else {
        res.json({ status: false, message: "No User Data!" })
    }
})

router.post("/update", function (req, res) {
    if (req.decoded.data.user_id) {
        db.getConnection(async function (err, connection) {
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
                    params["dob"] = req.body.data.dob
                    params["city"] = req.body.data.city

                    let throw_error = null
                    await new Promise(resolve => {
                        connection.query(
                            `SELECT is_paid_m FROM members WHERE id=?`,
                            req.decoded.data.user_id,
                            function (error, result) {
                                if (error) {
                                    throw_error = error
                                    return resolve()
                                } else {
                                    if (result[0].is_paid_m === 0) {
                                        params["ref_user_asn_id"] = req.body.data.ref_code
                                    }/*  else {
                                        delete params['email']
                                    } */
                                    return resolve()
                                }
                            })
                    })
                    if (throw_error) {
                        return res.status(500).json({ throw_error })
                    }

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
