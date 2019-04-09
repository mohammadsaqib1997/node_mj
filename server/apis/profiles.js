const express = require('express')
const router = express.Router()
const fs = require('fs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const trans_email = require('../e-conf.js')

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
const upload = multer({
  storage
})

const db = require('../db.js')
const db_utils = require('../func/db-util.js')

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
        res.status(500).json({
          err
        })
      } else {
        connection.query(query, req.decoded.data.user_id, function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              name: results[0].full_name
            })
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
    })
  }
})

router.get("/file/:id", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      let opt = {
        sql: `SELECT * FROM u_images WHERE user_id=? AND user_type=?`
      }
      connection.query(opt, [req.decoded.data.user_id, req.decoded.data.type], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({
            error
          })
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
            res.status(404).json({
              message: 'Not found!'
            })
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
        res.status(500).json({
          error
        })
      } else {
        let query = ''
        if (req.decoded.data.type === 0) {
          query = `
            SELECT 
              m.user_asn_id, 
              m.email, 
              m.full_name, 
              m.contact_num, 
              m.cnic_num, 
              m.dob, 
              m.address, 
              m.ref_user_asn_id, 
              m.active_sts,
              crzb_data.*
            FROM members as m
            LEFT JOIN mem_link_crzb as mem_l_crzb
            ON m.id=mem_l_crzb.member_id
            
            left join (
              select
                ls_b.id as crzb_id,
                concat(ls_b.name, ", ", ls_z.name, ", ", ls_r.name, ", ", ls_c.name) as crzb_name,
                concat(ls_z.name, ", ", ls_r.name, ", ", ls_c.name) as crct_name,
                ls_b.parent_id as crct_id
                from crzb_list as ls_b
                  
                join crzb_list as ls_z
                on ls_b.parent_id = ls_z.id
                join crzb_list as ls_r
                on ls_z.parent_id = ls_r.id
                join crzb_list as ls_c
                on ls_r.parent_id = ls_c.id
                
            ) as crzb_data
            on mem_l_crzb.crzb_id = crzb_data.crzb_id
            
            WHERE m.id=?`
        } else if (req.decoded.data.type === 1) {
          query = "SELECT email, full_name, contact_num, cnic_num, address, active_sts FROM moderators WHERE id=?"
        } else {
          query = "SELECT email, full_name, contact_num, cnic_num, address FROM admins WHERE id=?"
        }
        connection.query(query, req.decoded.data.user_id, function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: results[0]
            })
          }

        });
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
    })
  }
})

router.get("/get_comp_prg", function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
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
              res.status(500).json({
                err
              })
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
    res.json({
      status: false,
      message: "No User Data!"
    })
  }
})

router.get("/load_fin_var", (req, res) => {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `select wallet, pending, available, paid_tax from info_var_m where member_id=${req.decoded.data.user_id}`,
          (error, result) => {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                result: result[0]
              })
            }
          }
        )
      }
    })
  } else {
    res.status(500).json({
      error: "Invalid Request!"
    })
  }
})

router.get("/may_i_wallet_req", function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let query = `SELECT m.*, m_bk.bank_name, m_bk.branch_code, m_bk.account_title, m_bk.account_number
                FROM members as m
                LEFT JOIN user_bank_details as m_bk
                ON m.id=m_bk.member_id
                WHERE m.id=?`
        connection.query(query, req.decoded.data.user_id, function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
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
              res.json({
                status: false,
                errors: profile_comp
              })
            } else {
              res.json({
                status: true
              })
            }

          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Data!"
    })
  }
})

router.get("/get_prd_detail", function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT p_d.product_id, p.name, p.reg_amount, iv_m.package_act_date, p_d.created_at as sel_prd_date
            FROM user_product_details as p_d
            LEFT JOIN products as p
            ON p_d.product_id = p.id
            LEFT JOIN info_var_m as iv_m
            ON p_d.member_id = iv_m.member_id
            WHERE p_d.member_id=?`,
          req.decoded.data.user_id,
          function (err, result) {
            connection.release()
            if (err) {
              res.status(500).json({
                err
              })
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
    res.json({
      status: false,
      message: "No User Data!"
    })
  }
})

router.post("/update", function (req, res) {
  if (req.decoded.data.user_id) {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          error
        })
      } else {
        let str_err = null
        db_utils.connectTrans(connection, async function (resolve, err_hdl) {
          let query = '',
            params = {
              "address": req.body.data.address,
              "cnic_num": req.body.data.cnic_num,
              "contact_num": req.body.data.cont_num,
              "email": req.body.data.email,
              "full_name": req.body.data.full_name,
              "password": req.body.data.password
            },
            secure_form = {},
            send_email = null

          if (req.decoded.data.type === 0) {
            query = "UPDATE members SET ? WHERE id=?"
            params["dob"] = req.body.data.dob
            delete params['password']

            // if any pincode and verified pin than this work
            if (req.body.data.secure === true) {
              delete params['contact_num']
              delete params['email']
            }

            let throw_error = null
            await new Promise(inner_resolve => {
              connection.query(
                `SELECT is_paid_m, email, contact_num FROM members WHERE id=?`,
                req.decoded.data.user_id,
                function (error, result) {
                  if (error) {
                    throw_error = error
                    return inner_resolve()
                  } else {
                    if (req.body.data.secure === true) {
                      if (req.body.data.cont_num !== result[0].contact_num) {
                        secure_form['contact_num'] = req.body.data.cont_num
                      }
                      if (req.body.data.email !== result[0].email) {
                        secure_form['email'] = req.body.data.email
                      }
                      if (result[0].email && result[0].email !== null && result[0].email !== '') {
                        send_email = result[0].email
                      }
                    }
                    if (req.body.data.secure !== true && result[0].email !== params['email']) {
                      params["email_v_sts"] = 0
                    }
                    if (result[0].is_paid_m === 0) {
                      params["ref_user_asn_id"] = req.body.data.ref_code
                    }
                    return inner_resolve()
                  }
                })
            })
            if (throw_error) {
              err_hdl(throw_error)
              resolve()
            }

          } else if (req.decoded.data.type === 1) {
            query = "UPDATE moderators SET ? WHERE id=?"
          } else {
            query = "UPDATE admins SET ? WHERE id=?"
          }

          connection.query(query, [params, req.decoded.data.user_id], async function (error, results, fields) {
            if (error) {
              err_hdl(error)
              resolve()
            } else {
              if (req.decoded.data.type === 0) {
                let throw_error = null
                await new Promise(inner_resolve => {
                  connection.query(
                    `SELECT mem_lk.member_id, m.is_paid_m
                      FROM mem_link_crzb as mem_lk
                      right join members as m
                      on mem_lk.member_id = m.id
                      WHERE m.id=?`,
                    req.decoded.data.user_id,
                    function (error, results, fields) {
                      if (error) {
                        throw_error = error
                        inner_resolve()
                      } else {
                        let query = 'UPDATE `mem_link_crzb` SET ? WHERE member_id=?'
                        let params = [{
                          crzb_id: req.body.ext_data.crzb_id
                        }, req.decoded.data.user_id]

                        if (results.length && results[0].member_id == null) {
                          query = 'INSERT INTO `mem_link_crzb` SET ?'
                          params = [{
                            crzb_id: req.body.ext_data.crzb_id,
                            member_id: req.decoded.data.user_id,
                            linked_mem_type: results[0].is_paid_m == 0 ? 1 : 0
                          }]
                        }
                        connection.query(query, params, function (error, results, fields) {
                          if (error) {
                            throw_error = error
                          }
                          inner_resolve()
                        })
                      }
                    })
                })
                if (throw_error) {
                  err_hdl(throw_error)
                  resolve()
                }
              }

              if (req.body.data.secure === true && send_email !== null) {

                let token = jwt.sign({
                  data: {
                    user_id: req.decoded.data.user_id,
                    form_data: secure_form,
                    type: 3
                  }
                }, config.secret, {
                    expiresIn: "1 day"
                  })
                connection.query(
                  `INSERT INTO tokens SET ?`, {
                    type: 3,
                    member_id: req.decoded.data.user_id,
                    token: token
                  },
                  function (error, results) {
                    if (error) {
                      err_hdl(error)
                      resolve()
                    } else {
                      res.render("verify-token", {
                        host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                        name: "Member",
                        token: token
                      }, function (errPug, html) {
                        if (errPug) {
                          str_err = "Error render in pug file!"
                          err_hdl(true)
                          resolve()
                        } else {
                          trans_email.sendMail({
                            from: '"MJ Supreme" <info@mj-supreme.com>',
                            to: send_email,
                            subject: 'Verification Token',
                            html: html
                          }, function (err, info) {
                            if (err) {
                              str_err = "Error in sending an email!"
                              err_hdl(true)
                              resolve()
                            } else {
                              resolve()
                            }
                          })
                        }
                      })
                    }
                  })
              } else {
                resolve()
              }
            }
          })

        },
          function (error) {
            if (str_err) {
              res.status(500).json({
                message: str_err
              })
            } else if (error) {
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
      message: "No User Found!"
    })
  }
})

router.post("/image_upload", upload.single('profile'), function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT * FROM u_images WHERE user_id=? AND user_type=?', [req.decoded.data.user_id, req.decoded.data.type], function (error, results, fields) {
        if (error) {
          connection.release();
          res.status(500).json({
            error
          })
        } else {
          let up_opt = {
            sql: `INSERT INTO u_images SET ?`
          }
          let params = [{
            user_id: req.decoded.data.user_id,
            user_type: req.decoded.data.type,
            file_name: req.body.file_name,
          }]
          if (results.length > 0) {
            up_opt = {
              sql: `UPDATE u_images SET ? WHERE id=?`
            }
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
    }
  })
})

router.get('/is_pin', function (req, res) {
  if (req.decoded.data.type === 0) {
    let user_id = req.decoded.data.user_id
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT pin, active_sts, last_pin
                    FROM pincodes
                    WHERE member_id=?`,
          user_id,
          function (error, results) {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              let is_pin = false,
                is_pin_act = false,
                last_pin = false
              if (results.length > 0) {
                is_pin = true
                if (results[0].active_sts === 1) {
                  is_pin_act = true
                }
                if (results[0].last_pin && results[0].last_pin !== null) {
                  last_pin = true
                }
              }
              res.json({
                is_pin,
                is_pin_act,
                last_pin
              })
            }
          })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid User Type!"
    })
  }
})

router.post('/verify_pin', function (req, res) {
  if (req.decoded.data.type === 0) {
    let user_id = req.decoded.data.user_id
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT active_sts
                    FROM pincodes
                    WHERE member_id=? AND BINARY pin=?`,
          [user_id, req.body.pin],
          function (error, results) {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              if (results.length > 0) {
                if (results[0].active_sts === 1) {
                  res.json({
                    status: true
                  })
                } else {
                  res.json({
                    status: false,
                    message: 'Your pincode is not verify. Verify your pin code using an email!'
                  })
                }

              } else {
                res.json({
                  status: false,
                  message: 'Invalid PinCode!'
                })
              }
            }
          })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid User Type!"
    })
  }
})

router.post('/add_pincode', function (req, res) {
  if (req.decoded.data.type === 0) {
    let user_id = req.decoded.data.user_id
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT m.email, pin.pin, m.full_name 
                    FROM members as m
                    LEFT JOIN pincodes as pin
                    ON m.id = pin.member_id
                    WHERE m.id=? AND BINARY m.password=?`,
          [user_id, req.body.password],
          function (error, results) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (results.length > 0) {
                if (results[0].pin !== null) {
                  connection.release()
                  res.json({
                    status: false,
                    message: "You have already add pin code!"
                  })
                } else {
                  if (results[0].email && results[0].email !== null && results[0].email !== '') {
                    let token = null,
                      full_name = results[0].full_name,
                      send_email = results[0].email

                    db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler
                      connection.query(
                        `INSERT INTO pincodes SET ?`, {
                          member_id: user_id,
                          pin: req.body.pin
                        },
                        function (error, results) {
                          if (error) {
                            err_cb(error)
                            resolve()
                          } else {
                            token = jwt.sign({
                              data: {
                                user_id,
                                new_pin: req.body.pin,
                                type: 2
                              }
                            }, config.secret, {
                                expiresIn: "1 day"
                              })
                            connection.query(
                              `INSERT INTO tokens SET ?`, {
                                type: 2,
                                member_id: user_id,
                                token: token
                              },
                              function (error, results) {
                                if (error) {
                                  err_cb(error)
                                }
                                resolve()
                              })
                          }
                        })
                    }, function (error) { // this is finalize response handler
                      if (error) {
                        res.status(500).json({
                          error
                        })
                      } else {
                        //sending an email in here
                        if (token !== null) {
                          res.render("verify-token", {
                            host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                            name: full_name,
                            token: token
                          }, function (errPug, html) {
                            if (errPug) {
                              res.json({
                                status: false,
                                message: "Error render in pug file!"
                              })
                            } else {
                              trans_email.sendMail({
                                from: '"MJ Supreme" <info@mj-supreme.com>',
                                to: send_email,
                                subject: 'Verification Token',
                                html: html
                              }, function (err, info) {
                                if (err) {
                                  res.json({
                                    status: false,
                                    message: "Error in sending an email!"
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
                            message: "Token generated error!"
                          })
                        }

                      }
                    })
                  } else {
                    connection.release()
                    res.json({
                      status: false,
                      message: "Please first enter your email!"
                    })
                  }
                }

              } else {
                connection.release()
                res.json({
                  status: false,
                  message: "Invalid Password!"
                })
              }
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid User Type!"
    })
  }

})

router.post('/update_pincode', function (req, res) {
  if (req.decoded.data.type === 0) {
    let user_id = req.decoded.data.user_id
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT pin.id, pin.pin, m.email, m.full_name  
                    FROM members as m
                    LEFT JOIN pincodes as pin
                    ON m.id = pin.member_id
                    WHERE m.id=? AND BINARY m.password=?`,
          [user_id, req.body.password],
          function (error, results) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (results.length > 0) {
                if (results[0].pin == req.body.old_pin) {
                  let token = null,
                    full_name = results[0].full_name,
                    send_email = results[0].email
                  db_utils.connectTrans(connection, function (resolve, err_cb) { // this is in query promise handler
                    connection.query(
                      `UPDATE pincodes SET ? WHERE id=?`, [{
                        pin: req.body.pin,
                        last_pin: results[0].pin,
                        active_sts: 0
                      }, results[0].id],
                      function (error, results) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          token = jwt.sign({
                            data: {
                              user_id,
                              new_pin: req.body.pin,
                              type: 2
                            }
                          }, config.secret, {
                              expiresIn: "1 day"
                            })
                          connection.query(
                            `INSERT INTO tokens SET ?`, {
                              type: 2,
                              member_id: user_id,
                              token: token
                            },
                            function (error, results) {
                              if (error) {
                                err_cb(error)
                              }
                              resolve()
                            })
                        }
                      })
                  }, function (error) { // this is finalize response handler
                    if (error) {
                      res.status(500).json({
                        error
                      })
                    } else {
                      //sending an email in here
                      if (token !== null) {
                        res.render("verify-token", {
                          host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                          name: full_name,
                          token: token
                        }, function (errPug, html) {
                          if (errPug) {
                            res.json({
                              status: false,
                              message: "Error render in pug file!"
                            })
                          } else {
                            trans_email.sendMail({
                              from: '"MJ Supreme" <info@mj-supreme.com>',
                              to: send_email,
                              subject: 'Verification Token',
                              html: html
                            }, function (err, info) {
                              if (err) {
                                res.json({
                                  status: false,
                                  message: "Error in sending an email!"
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
                          message: "Token generated error!"
                        })
                      }
                    }
                  })
                } else {
                  connection.release()
                  res.json({
                    status: false,
                    message: "Invalid old pin code!"
                  })
                }

              } else {
                connection.release()
                res.json({
                  status: false,
                  message: "Invalid Password!"
                })
              }
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid User Type!"
    })
  }

})

router.post('/update_password', function (req, res) {
  if (req.decoded.data.user_id) {
    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          error
        })
      } else {
        let table = 'members',
          params = {
            "password": req.body.pass
          },
          secure_form = {},
          send_email = null,
          throw_error = null,
          str_error = null

        if (req.decoded.data.type === 1) {
          table = 'moderators'
        } else if (req.decoded.data.type === 2) {
          table = 'admins'
        }

        await new Promise(resolve => {
          connection.query(
            `SELECT email FROM ${table} WHERE id=? AND BINARY password=?`,
            [req.decoded.data.user_id, req.body.cur_pass],
            async function (error, result) {
              if (error) {
                throw_error = error
                return resolve()
              } else {
                if (result.length > 0) {
                  if (req.body.secure === true) {
                    secure_form['password'] = req.body.pass
                    if (result[0].email && result[0].email !== null && result[0].email !== '') {
                      send_email = result[0].email

                      await new Promise(resolve2 => {
                        let token = jwt.sign({
                          data: {
                            user_id: req.decoded.data.user_id,
                            form_data: secure_form,
                            type: 4
                          }
                        }, config.secret, {
                            expiresIn: "1 day"
                          })
                        connection.query(
                          `INSERT INTO tokens SET ?`, {
                            type: 4,
                            member_id: req.decoded.data.user_id,
                            token: token
                          },
                          function (error, results) {
                            if (error) {
                              throw_error = error
                              return resolve2()
                            } else {
                              res.render("verify-token", {
                                host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                                name: "Member",
                                token: token
                              }, function (errPug, html) {
                                if (errPug) {
                                  str_error = "Error render in pug file!"
                                  return resolve2()
                                } else {
                                  trans_email.sendMail({
                                    from: '"MJ Supreme" <info@mj-supreme.com>',
                                    to: send_email,
                                    subject: 'Verification Token',
                                    html: html
                                  }, function (err, info) {
                                    if (err) {
                                      throw_error = err
                                    }
                                    return resolve2()
                                  })
                                }
                              })
                            }
                          })
                      })
                    }
                    return resolve()
                  } else {
                    connection.query(
                      `UPDATE ${table} SET ? WHERE id=?`,
                      [params, req.decoded.data.user_id],
                      function (error, result) {
                        if (error) {
                          throw_error = error
                        }
                        return resolve()
                      }
                    )
                  }
                } else {
                  str_error = "Current password is not match!"
                  return resolve()
                }
              }
            })
        })

        if (throw_error) {
          connection.release();
          return res.status(500).json({
            throw_error
          })
        }

        if (str_error) {
          connection.release();
          return res.json({
            status: false,
            message: str_error
          })
        }

        res.json({
          status: true
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
    })
  }
})

router.get('/get-process-detail', function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT 
            m.email, 
            m.full_name, 
            m.contact_num, 
            m.cnic_num, 
            m.dob, 
            m.address, 
            m.is_paid_m, 
            bk.id as bk_id, 
            bk.bank_name, 
            bk.branch_code, 
            bk.account_title, 
            bk.account_number, 
            prd.reg_amount as prd_reg_amount
          FROM members as m
          LEFT JOIN user_bank_details as bk
          ON m.id = bk.member_id
          LEFT JOIN user_product_details as prd_det
          ON m.id = prd_det.member_id
          LEFT JOIN products as prd
          ON prd_det.product_id = prd.id
          WHERE m.id=${req.decoded.data.user_id}`,
          function (error, result) {
            connection.release();

            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                result: result[0]
              })
            }
          }
        )
      }
    })
  } else {
    res.json({
      status: false,
      message: "No User Found!"
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