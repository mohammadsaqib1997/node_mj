const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const trans_email = require('../e-conf.js')
const moment = require('moment')
const Request = require('request')
const fs = require('fs');
const shortId = require('shortid')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../uploads/cvs')
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
const captcha_secret = config.dev ? '6Le-JHcUAAAAAMWQGZRZ8_-WnUcvNyGOT8-2U-CE' : '6LdmTncUAAAAAOPZduWVaGRJ3HcxPrxhN78lEWYN'

const db = require('../db.js')

router.post('/subs_email', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT email FROM `subscribers` where binary `email`=?', [req.body.email], function (error, results, fields) {
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
      });
    }
  })
})

router.post('/subscribe', function (req, res) {
  if (req.body.email && req.body.email !== '') {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        const token = shortId.generate()
        connection.query(
          `INSERT INTO subscribers SET ?`, {
            email: req.body.email,
            unsubscribe_id: token
          },
          function (error, result) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.render('subscribe', {
                host: require('./../config').dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                token: token
              }, function (errPug, html) {
                if (errPug) {
                  res.status(500).json({
                    errPug
                  })
                } else {
                  trans_email.sendMail({
                    from: '"MJ Supreme" <info@mj-supreme.com>',
                    to: req.body.email,
                    subject: 'Thank You For Subscribing!',
                    html: html
                  }, function (err, info) {
                    if (err) {
                      res.status(500).json({
                        err
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
          }
        );
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }
})

router.post('/verify', function (req, res) {
  if (req.decoded.data.type === 0) {
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.beginTransaction(async function (error) {
          if (error) {
            connection.release();
            res.status(500).json({
              error
            })
          } else {
            let throw_error = null

            let temp_data = {}
            let send_email = null
            let insert_id = null

            await new Promise(resolve => {
              connection.query(
                `SELECT full_name, email FROM members WHERE id=${req.decoded.data.user_id}`,
                function (error, result) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    temp_data['name'] = result[0].full_name
                    send_email = result[0].email
                    temp_data['token'] = jwt.sign({
                        data: {
                          email: result[0].email,
                          user_id: req.decoded.data.user_id,
                          type: 0
                        }
                      },
                      config.secret, {
                        expiresIn: "1 day"
                      }
                    )
                    connection.query(
                      `INSERT INTO tokens SET ?`, {
                        type: 0,
                        member_id: req.decoded.data.user_id,
                        token: temp_data['token']
                      },
                      function (error, result) {
                        if (error) {
                          throw_error = error
                        } else {
                          insert_id = result.insertId
                        }
                        return resolve()
                      }
                    )
                  }
                }
              )
            })

            if (throw_error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({
                  throw_error
                })
              })
            } else {
              connection.commit(function (err) {
                if (err) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({
                      err
                    })
                  });
                } else {
                  connection.release()
                  if (send_email !== null) {
                    res.render("verify-token", {
                      host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                      name: temp_data.name,
                      token: temp_data.token
                    }, function (errPug, html) {
                      if (errPug) {
                        last_id_delete_token(insert_id, function (err) {
                          res.json({
                            status: false,
                            message: err ? err.message : errPug.message
                          })
                        })
                      } else {
                        trans_email.sendMail({
                          from: '"MJ Supreme" <info@mj-supreme.com>',
                          to: send_email,
                          subject: 'Verification Token',
                          html: html
                        }, function (err, info) {
                          if (err) {
                            last_id_delete_token(insert_id, function (cb_err) {
                              res.json({
                                status: false,
                                message: cb_err ? cb_err.message : err.message
                              })
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
                      message: "Email not found!"
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Request!"
    })
  }

})

router.post('/forgot-password', function (req, res) {
  if (req.body.email && req.body.email !== '') {
    let email_or_id = req.body.email
    db.getConnection(function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.beginTransaction(async function (error) {
          if (error) {
            connection.release();
            res.status(500).json({
              error
            })
          } else {
            let throw_error = null
            let str_error = null

            let temp_data = {}
            let send_email = null
            let insert_id = null

            await new Promise(resolve => {
              let last_3_hours = moment().subtract(3, 'h').format('YYYY-MM-DD HH-mm-ss')
              connection.query(
                `SELECT m.id, m.full_name, m.email, t.created_at
                FROM members as m
                LEFT JOIN tokens as t
                ON m.id=t.member_id AND t.created_at>'${last_3_hours}' AND t.type=1
                WHERE m.email=? OR m.user_asn_id=?
                ORDER BY t.created_at DESC
                LIMIT 1`,
                [email_or_id, email_or_id],
                function (error, result) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    if (result.length > 0) {
                      if (result[0].created_at !== null) {
                        str_error = "Your request under process please wait..."
                        return resolve()
                      } else {
                        if (result[0].email === null || result[0].email === '') {
                          str_error = "Your e-mail is not found. Contact administrator to add your e-mail."
                          return resolve()
                        } else {
                          temp_data['name'] = result[0].full_name
                          send_email = result[0].email
                          temp_data['token'] = jwt.sign({
                              data: {
                                email: result[0].email,
                                user_id: result[0].id,
                                type: 1
                              }
                            },
                            config.secret, {
                              expiresIn: "3 hours"
                            }
                          )
                          connection.query(
                            `INSERT INTO tokens SET ?`, {
                              type: 1,
                              member_id: result[0].id,
                              token: temp_data['token']
                            },
                            function (error, result) {
                              if (error) {
                                throw_error = error
                              } else {
                                insert_id = result.insertId
                              }
                              return resolve()
                            }
                          )
                        }
                      }
                    } else {
                      str_error = "Invalid E-mail or MJ-ID!"
                      return resolve()
                    }
                  }
                }
              )
            })

            if (throw_error || str_error) {
              return connection.rollback(function () {
                connection.release()
                if (throw_error) {
                  res.status(500).json({
                    throw_error
                  })
                } else {
                  res.json({
                    status: false,
                    message: str_error
                  })
                }
              })
            } else {
              connection.commit(function (err) {
                if (err) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({
                      err
                    })
                  });
                } else {
                  connection.release()
                  res.render("forgot-password", {
                    host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                    name: temp_data.name,
                    token: temp_data.token
                  }, function (errPug, html) {
                    if (errPug) {
                      last_id_delete_token(insert_id, function (err) {
                        res.json({
                          status: false,
                          message: err ? err.message : errPug.message
                        })
                      })
                    } else {
                      trans_email.sendMail({
                        from: '"MJ Supreme" <info@mj-supreme.com>',
                        to: send_email,
                        subject: 'Forgot Password!',
                        html: html
                      }, function (err, info) {
                        if (err) {
                          last_id_delete_token(insert_id, function (cb_err) {
                            res.json({
                              status: false,
                              message: cb_err ? cb_err.message : err.message
                            })
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
            }
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }
})

router.post('/contact', function (req, res) {
  Request.post('https://www.google.com/recaptcha/api/siteverify', {
    form: {
      secret: captcha_secret,
      response: req.body.captcha
    }
  }, function (err, httpRes, body) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let resBody = JSON.parse(body)
      if (resBody.success === true) {
        db.getConnection(function (error, connection) {
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            connection.query(
              `INSERT INTO contact_us SET ?`, {
                full_name: req.body.full_name,
                email: req.body.email,
                cont_number: req.body.cont_number,
                subject: req.body.subject,
                message: req.body.message
              },
              function (error, result) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.render("contact", {
                    host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                    full_name: req.body.full_name,
                    email: req.body.email,
                    cont_number: req.body.cont_number,
                    subject: req.body.subject,
                    message: req.body.message
                  }, function (errPug, html) {
                    if (errPug) {
                      res.json({
                        status: false,
                        message: errPug.message
                      })
                    } else {
                      trans_email.sendMail({
                        from: `"${req.body.full_name}" <${req.body.email}>`,
                        to: 'info@mj-supreme.com',
                        subject: `Contact Subject: ${req.body.subject}`,
                        html: html
                      }, function (err, info) {
                        if (err) {
                          res.json({
                            status: false,
                            message: err.message
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
          }
        })
      } else {
        res.json({
          status: false,
          err_code: '111',
          message: "Invalid Captcha!"
        })
      }

    }
  })
})

router.post('/career', upload.single('cv'), function (req, res) {
  Request.post('https://www.google.com/recaptcha/api/siteverify', {
    form: {
      secret: captcha_secret,
      response: req.body.captcha
    }
  }, function (err, httpRes, body) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let resBody = JSON.parse(body)
      if (resBody.success === true) {
        db.getConnection(function (error, connection) {
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            connection.query(
              `INSERT INTO career SET ?`, {
                full_name: req.body.full_name,
                email: req.body.email,
                cont_number: req.body.cont_number,
                attachment: req.body.file_name
              },
              function (error, result) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.render("career", {
                    host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                    full_name: req.body.full_name,
                    email: req.body.email,
                    cont_number: req.body.cont_number,
                    file: req.body.file_name
                  }, function (errPug, html) {
                    if (errPug) {
                      res.json({
                        status: false,
                        message: errPug.message
                      })
                    } else {
                      trans_email.sendMail({
                        from: `"${req.body.full_name}" <${req.body.email}>`,
                        to: 'info@mj-supreme.com',
                        subject: `Career Form`,
                        html: html,
                        attachments: [{
                          filename: req.body.file_name,
                          content: fs.createReadStream(__dirname + '/../uploads/cvs/' + req.body.file_name)
                        }]
                      }, function (err, info) {
                        if (err) {
                          res.json({
                            status: false,
                            message: err.message
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
          }
        })
      } else {
        res.json({
          status: false,
          err_code: '111',
          message: "Invalid Captcha!"
        })
      }
    }
  })
})

module.exports = router

function last_id_delete_token(lastId, cb) {
  db.getConnection(function (error, connection) {
    if (error) {
      cb(error)
    } else {
      connection.query('DELETE FROM tokens WHERE id=?', lastId, function (error, result) {
        connection.release()
        if (error) {
          cb(error)
        } else {
          cb()
        }
      })
    }
  })
}

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