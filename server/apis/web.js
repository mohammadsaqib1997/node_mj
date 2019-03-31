const express = require('express')
const router = express.Router()

const db = require('../db.js')

const config = require("./../config")
const secret = config.secret
const trans_email = require('../e-conf.js')
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const moment = require('moment');
const {
  DateTime
} = require('luxon');
const fs = require('fs');
const gm = require('gm')

router.get("/pk", function (req, res) {
  let data = JSON.parse(fs.readFileSync(__dirname + '/../files/pk.json', 'utf8'))
  let new_data = _.map(data, o => {
    return o.city
  })
  new_data.sort()
  res.json({
    cities: new_data
  })
})

router.get('/tot-mem-count', (req, res) => {
  db.getConnection(function (error, connection) {
    if (error) {
      return res.status(500).json({
        error
      });
    } else {

      connection.query(
        `SELECT COUNT(*) as tot FROM \`members\` WHERE is_paid_m=1`,
        function (error, result) {
          connection.release()
          if (error) {
            return res.status(500).json({
              error
            });
          } else {
            return res.json({
              mems: result[0].tot
            });
          }
        })
    }
  })
})

router.post('/tokenLogin', (req, res) => {
  const token = req.body.token || req.query.token
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({
          status: false,
          message: err.message
        });
      } else {
        db.getConnection(function (error, connection) {
          if (error) {
            return res.status(500).json({
              error
            });
          } else {
            let table = 'members',
              colm = "`email`, `is_paid_m`"
            if (decoded.data.type === 1) {
              table = 'moderators'
              colm = "`email`"
            } else if (decoded.data.type === 2) {
              table = 'admins'
              colm = "`email`"
            }
            connection.query(
              `SELECT ${colm} FROM ${table} WHERE id=?`,
              decoded.data.user_id,
              function (error, result) {
                connection.release()
                if (error) {
                  return res.status(500).json({
                    error
                  });
                } else {
                  let user = {
                    user_id: decoded.data.user_id,
                    email: result[0].email,
                    type: decoded.data.type
                  }
                  if (decoded.data.type === 0) {
                    user['is_paid'] = result[0].is_paid_m
                  }
                  return res.json({
                    status: true,
                    token: token,
                    user
                  });
                }
              })
          }
        })
      }
    });

  } else {
    return res.json({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({
          status: false,
          message: err.message
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.get('/ac_crct_ls/:search', (req, res) => {
  if (req.params.search) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `select * from (
            select 
              concat(ls1.name, 
                if(ls2.name is null, "", concat(", ", ls2.name)),
                if(ls3.name is null, "", concat(", ", ls3.name))
              ) as name, ls1.id
              from crzb_list as ls1
              left join crzb_list as ls2
              on ls1.parent_id = ls2.id
              left join crzb_list as ls3
              on ls2.parent_id = ls3.id
              where ls1.type=2 and ls1.active=1
            ) as tbl1
          where tbl1.name like '%${req.params.search}%'
          limit 10`,
          function (error, result) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                result
              })
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

router.get('/ls_branch/:crct_id', (req, res) => {
  if (req.params.crct_id && /^[0-9]*$/.test(req.params.crct_id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT id, name FROM crzb_list where parent_id=${req.params.crct_id} and active=1;`,
          function (error, result) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                result
              })
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

router.get('/get_list_winners_auto', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 15,
        date = moment(),
        gen_sofm = date.clone().startOf('month').subtract(_.get(req.query, 'prev_mnth_inc', 0), 'M'),
        startM = gen_sofm.format("YYYY-MM-DD HH-mm-ss"),
        endM = gen_sofm.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      let throw_error = null
      let cur_tot = 0
      let prev_tot = 0

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows
          FROM claim_rewards as clm
          WHERE clm.type=0 AND clm.status=1 AND clm.approved_at < '${startM}'
          `,
          function (error, result) {
            if (error) {
              throw_error = error
            } else {
              prev_tot = result[0].tot_rows
            }
            resolve()
          })
      })

      if (throw_error !== null) {
        connection.release()
        return res.status(500).json({
          error: throw_error
        })
      }

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows
          FROM claim_rewards as clm
          WHERE clm.type=0 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
          `,
          function (error, result) {
            if (error) {
              throw_error = error
            } else {
              cur_tot = result[0].tot_rows
            }
            resolve()
          })
      })

      if (throw_error !== null) {
        connection.release()
        return res.status(500).json({
          error: throw_error
        })
      }

      connection.query(
        `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
        FROM claim_rewards as clm
        JOIN members as m
        ON clm.member_id=m.id
        JOIN info_var_m as i_var
        ON m.id=i_var.member_id
        LEFT JOIN u_images as u_img
        ON m.id=u_img.user_id AND u_img.user_type=0
        WHERE clm.type=0 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
        ORDER BY clm.approved_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
        `,
        function (error, result) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              result,
              cur_tot,
              prev_tot,
              gen_my: gen_sofm.format('MMMM YYYY')
            })
          }
        })
    }
  })
})

router.get('/get_list_winners_self', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 15,
        date = moment(),
        // startM = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss"),
        // endM = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")
        gen_sofm = date.clone().startOf('month').subtract(_.get(req.query, 'prev_mnth_inc', 0), 'M'),
        startM = gen_sofm.format("YYYY-MM-DD HH-mm-ss"),
        endM = gen_sofm.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      let throw_error = null
      let cur_tot = 0
      let prev_tot = 0

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows
          FROM claim_rewards as clm
          WHERE clm.type=1 AND clm.status=1 AND clm.approved_at < '${startM}'
          `,
          function (error, result) {
            if (error) {
              throw_error = error
            } else {
              prev_tot = result[0].tot_rows
            }
            resolve()
          })
      })

      if (throw_error !== null) {
        connection.release()
        return res.status(500).json({
          error: throw_error
        })
      }

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows
          FROM claim_rewards as clm
          WHERE clm.type=1 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
          `,
          function (error, result) {
            if (error) {
              throw_error = error
            } else {
              cur_tot = result[0].tot_rows
            }
            resolve()
          })
      })

      if (throw_error !== null) {
        connection.release()
        return res.status(500).json({
          error: throw_error
        })
      }

      connection.query(
        `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
        FROM claim_rewards as clm
        JOIN members as m
        ON clm.member_id=m.id
        JOIN info_var_m as i_var
        ON m.id=i_var.member_id
        LEFT JOIN u_images as u_img
        ON m.id=u_img.user_id AND u_img.user_type=0
        WHERE clm.type=1 AND clm.status=1 AND (clm.approved_at >= '${startM}' AND clm.approved_at <= '${endM}')
        ORDER BY clm.approved_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
        `,
        function (error, result) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              result,
              cur_tot,
              prev_tot,
              gen_my: gen_sofm.format('MMMM YYYY')
            })
          }
        })
    }
  })
})

router.get('/get_winners', function (req, res) {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let throw_error = null,
        data = {
          auto_rewards: [],
          self_rewards: []
        }

      await new Promise(resolve => {
        connection.query(
          `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
          FROM claim_rewards as clm
          JOIN members as m
          ON clm.member_id=m.id
          JOIN info_var_m as i_var
          ON m.id=i_var.member_id
          LEFT JOIN u_images as u_img
          ON m.id=u_img.user_id AND u_img.user_type=0
          WHERE clm.type=0 AND clm.status=1
          ORDER BY clm.approved_at DESC
          LIMIT 4
          `,
          function (error, results, fields) {
            if (error) {
              throw_error = error
            } else {
              data['auto_rewards'] = results
            }
            return resolve()
          })
      })

      if (throw_error !== null) {
        connection.release();
        return res.status(500).json({
          err: throw_error
        })
      }

      await new Promise(resolve => {
        connection.query(
          `SELECT clm.reward_selected, clm.level as rwd_level, m.full_name, u_img.file_name, i_var.level
          FROM claim_rewards as clm
          JOIN members as m
          ON clm.member_id=m.id
          JOIN info_var_m as i_var
          ON m.id=i_var.member_id
          LEFT JOIN u_images as u_img
          ON m.id=u_img.user_id AND u_img.user_type=0
          WHERE clm.type=1 AND clm.status=1
          ORDER BY clm.approved_at DESC
          LIMIT 4
          `,
          function (error, results, fields) {
            if (error) {
              throw_error = error
            } else {
              data['self_rewards'] = results
            }
            return resolve()
          })
      })

      if (throw_error !== null) {
        connection.release();
        res.status(500).json({
          err: throw_error
        })
      } else {
        connection.release();
        res.json({
          data
        })
      }

    }
  })
})

router.get('/list_partner', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 12,
        search = ""

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      if (req.query.search) {
        search = req.query.search
      }

      connection.query(
        `SELECT COUNT(*) as total_rows 
        FROM partners
        WHERE active=1
        ${(search !== '') ? 'AND (discount LIKE ? OR full_name LIKE ? OR city LIKE ?)' : ''}`,
        [
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
              `SELECT id, full_name, email, discount, cont_num, city, address, logo
              FROM partners
              WHERE active=1
              ${(search !== '') ? 'AND (discount LIKE ? OR full_name LIKE ? OR city LIKE ?)' : ''}
              ORDER BY id ASC
              LIMIT ${limit}
              OFFSET ${offset}`,
              [
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
})

router.get('/partner_info/:id', function (req, res) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT id, full_name, email, discount, disc_prds, cont_num, city, address, logo 
          FROM \`partners\` 
          WHERE \`id\`=?`,
          [req.params.id],
          function (error, results, fields) {
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
      message: "Invalid id!"
    })
  }
})

router.get('/partner/logo/:file_name', function (req, res) {
  if (req.params.file_name !== '') {
    if (fs.existsSync(__dirname + "/../uploads/partners_logo/" + req.params.file_name)) {
      gm(__dirname + '/../uploads/partners_logo/' + req.params.file_name)
        .gravity('Center')
        .background('transparent')
        .resize(320, 320)
        .extent(320, 320)
        .stream('jpg', function (err, stdout, stderr) {
          if (err) return res.status(404).json({
            message: "Not Found!"
          })
          stdout.pipe(res)

          stdout.on('error', function (err) {
            return res.status(404).json({
              message: "Not Found!"
            })
          });
        })
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
});

router.get('/user/img/:file_name', function (req, res) {
  if (req.params.file_name !== '') {
    if (fs.existsSync(__dirname + "/../uploads/profile/" + req.params.file_name)) {
      gm(__dirname + '/../uploads/profile/' + req.params.file_name)
        .gravity('Center')
        .background('transparent')
        .resize(180, 180)
        .extent(180, 180)
        .stream('jpg', function (err, stdout, stderr) {
          if (err) return res.status(404).json({
            message: "Not Found!"
          })
          stdout.pipe(res)

          stdout.on('error', function (err) {
            return res.status(404).json({
              message: "Not Found!"
            })
          });
        })
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
});

router.get('/user/thumb/:file_name', function (req, res) {
  if (req.params.file_name !== '') {
    if (fs.existsSync(__dirname + "/../uploads/profile/" + req.params.file_name)) {
      gm(__dirname + '/../uploads/profile/' + req.params.file_name)
        .gravity('Center')
        .background('transparent')
        .resize(50, 50)
        .extent(50, 50)
        .stream('jpg', function (err, stdout, stderr) {
          if (err) return res.status(404).json({
            message: "Not Found!"
          })
          stdout.pipe(res)

          stdout.on('error', function (err) {
            return res.status(404).json({
              message: "Not Found!"
            })
          });
        })
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
});

router.post('/check_email', (req, res) => {

  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.query('SELECT email FROM `members` where binary `email`=?', [req.body.email], function (error, results, fields) {
        if (error) {
          connection.release();
          sendDBError(res, error)
        } else {
          if (results.length > 0) {
            connection.release();
            res.json({
              count: results.length
            })
          } else {
            connection.query('SELECT email FROM `moderators` where binary `email`=?', [req.body.email], function (error, results, fields) {
              if (error) {
                connection.release();
                sendDBError(res, error)
              } else {
                if (results.length > 0) {
                  connection.release();
                  res.json({
                    count: results.length
                  })
                } else {
                  connection.query('SELECT email FROM `admins` where binary `email`=?', [req.body.email], function (error, results, fields) {
                    if (error) {
                      connection.release();
                      sendDBError(res, error)
                    } else {
                      connection.release();
                      res.json({
                        count: results.length
                      })
                    }
                  })
                }
              }
            })
          }
        }
      });

    }
  })

})

router.post('/check_ref_id', (req, res) => {

  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.query('SELECT user_asn_id, full_name FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
        connection.release();
        if (error) {
          sendDBError(res, error)
        } else {
          if (results.length > 0) {
            res.json({
              count: results.length,
              user: results[0]
            })
          } else {
            res.json({
              count: results.length
            })
          }
        }
      });
    }
  })

})

router.post("/admin/login", (req, res) => {
  db.getConnection(async function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      let throw_error = null
      let resp = null

      // moderator check
      await new Promise(resolve => {
        connection.query(
          'SELECT id, email, active_sts FROM `moderators` WHERE BINARY `email`=? and BINARY `password`=?',
          [req.body.email, req.body.password],
          function (error, results) {
            if (error) {
              throw_error = error;
              return resolve()
            } else {
              if (results.length === 1) {
                if (results[0].active_sts === 1) {
                  resp = {
                    status: true,
                    token: tokenGen(results[0], 1),
                    user: userData(results[0], 1)
                  }
                } else {
                  resp = {
                    status: false,
                    message: "Your account has bees Suspended. Contact your administrator."
                  }
                }
              }
              return resolve()
            }
          })
      })

      if (resp) {
        connection.release();
        return res.json(resp)
      } else if (throw_error) {
        connection.release();
        return sendDBError(res, throw_error)
      }

      // admin check
      await new Promise(resolve => {
        connection.query(
          'SELECT id, email FROM `admins` where BINARY `email`=? and BINARY `password`=?',
          [req.body.email, req.body.password],
          function (error, results) {
            if (error) {
              throw_error = error;
              return resolve()
            } else {
              if (results.length === 1) {
                resp = {
                  status: true,
                  token: tokenGen(results[0], 2),
                  user: userData(results[0], 2)
                }
              } else {
                resp = {
                  status: false,
                  message: "Sorry, the specified combination do not match. Reset your credentials if required."
                }
              }
              return resolve()
            }
          })
      })

      if (resp) {
        connection.release();
        return res.json(resp)
      } else if (throw_error) {
        connection.release();
        return sendDBError(res, throw_error)
      }
    }
  })
})

router.post('/login', (req, res) => {
  db.getConnection(async function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      let throw_error = null
      let resp = null

      // member check
      await new Promise(resolve => {
        connection.query(
          'SELECT id, email, active_sts, is_paid_m FROM `members` WHERE BINARY (`email`=? OR `user_asn_id`=?) AND BINARY `password`=?',
          [req.body.email, req.body.email, req.body.password],
          function (error, results) {
            if (error) {
              throw_error = error;
              return resolve()
            } else {
              if (results.length === 1) {
                if (results[0].active_sts === 1) {
                  user = userData(results[0], 0)
                  user['is_paid'] = results[0].is_paid_m
                  resp = {
                    status: true,
                    token: tokenGen(results[0], 0),
                    user
                  }
                } else {
                  resp = {
                    status: false,
                    message: "Your account has bees Suspended. Contact your administrator."
                  }
                }
              } else {
                resp = {
                  status: false,
                  message: "Sorry, the specified combination do not match. Reset your credentials if required."
                }
              }
              return resolve()
            }
          })
      })

      if (resp) {
        connection.release();
        return res.json(resp)
      } else if (throw_error) {
        connection.release();
        return sendDBError(res, throw_error)
      }

    }
  })

})

router.post('/signup', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.beginTransaction(async function (err) {
        if (err) {
          connection.release();
          sendDBError(res, err)
        } else {
          let throw_error = null
          let mem_id = null
          let email_grab_data = {
            template_data: {},
            email: null,
            token_id: null
          }

          await new Promise(resolve => {
            req.body.member_data['active_sts'] = 1
            connection.query('INSERT INTO `members` SET ?', req.body.member_data, async function (error, results, fields) {
              if (error) {
                throw_error = error
                return resolve()
              } else {
                mem_id = results.insertId
                // req.body.prd_data['member_id'] = mem_id
                // req.body.bank_data['member_id'] = mem_id

                email_grab_data['email'] = req.body.member_data.email
                email_grab_data['template_data']['name'] = req.body.member_data.full_name
                email_grab_data['template_data']['token'] = jwt.sign({
                    data: {
                      email: req.body.member_data.email,
                      user_id: mem_id,
                      type: 0
                    }
                  },
                  secret, {
                    expiresIn: "1 day"
                  }
                )

                await new Promise(tokenResolve => {
                  connection.query(
                    `INSERT INTO tokens SET ?`, {
                      type: 0,
                      member_id: mem_id,
                      token: email_grab_data['template_data']['token']
                    },
                    function (error, result) {
                      if (error) {
                        throw_error = error
                      } else {
                        email_grab_data['token_id'] = result.insertId
                      }
                      tokenResolve()
                    }
                  )
                })
                if (throw_error) {
                  return resolve()
                }

                // check member select promotion and if exist any promotion
                if (req.body.ext_data.promotion === true) {
                  let curr_date = moment(DateTime.local()
                    .setZone("UTC+5")
                    .toString()).format("YYYY-MM-DD HH-mm-ss")
                  await new Promise(promResolve => {
                    connection.query(
                      `SELECT id FROM disc_promotions WHERE prd_id = ${req.body.ext_data.prd_id} AND (start_prom_dt<='${curr_date}' AND end_prom_dt>='${curr_date}') limit 1`,
                      function (error, result) {
                        if (error) {
                          throw_error = error
                          return promResolve()
                        } else {
                          if (!result.length) {
                            return promResolve()
                          } else {
                            let prom_id = result[0].id
                            connection.query(
                              `INSERT INTO mem_in_prom SET ?`, {
                                member_id: mem_id,
                                disc_prom_id: prom_id
                              },
                              function (error) {
                                if (error) {
                                  throw_error = error
                                }
                                return promResolve()
                              }
                            )
                          }
                        }
                      }
                    )
                  })
                  if (throw_error) {
                    return resolve()
                  }
                }


                connection.query(`INSERT INTO terms_accept SET member_id=${mem_id}, accept_sts=1`, function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve()
                  } else {
                    connection.query('INSERT INTO `user_product_details` SET ?', {
                      product_id: req.body.ext_data.prd_id,
                      member_id: mem_id
                    }, function (error, results, fields) {
                      if (error) {
                        throw_error = error
                        return resolve()
                      } else {
                        connection.query('INSERT INTO `mem_link_crzb` SET ?', {
                          member_id: mem_id,
                          crzb_id: req.body.ext_data.brn_id,
                          linked_mem_type: 1
                        }, async function (error, results, fields) {
                          if (error) {
                            throw_error = error
                            return resolve()
                          } else {
                            connection.query('INSERT INTO `notifications` SET ?', {
                              from_type: 0,
                              to_type: 1,
                              from_id: mem_id,
                              to_id: 1, // admin id
                              message: "New member added in members list. Approve it.",
                              notify_type: 1
                            }, function (error, results, fields) {
                              if (error) {
                                throw_error = error
                              }
                              return resolve()
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          })

          if (throw_error) {
            return connection.rollback(function () {
              connection.release()
              sendDBError(res, throw_error)
            })
          } else {
            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  connection.release()
                  sendDBError(res, err)
                });
              } else {
                connection.release()

                res.render("verify-token", {
                  host: config.dev ? 'http://127.0.0.1:3000' : 'https://mj-supreme.com',
                  name: email_grab_data['template_data']['name'],
                  token: email_grab_data['template_data']['token']
                }, function (errPug, html) {
                  if (errPug) {
                    last_id_delete_token(email_grab_data['token_id'], function (err) {
                      res.json({
                        status: false,
                        message: err ? err.message : errPug.message
                      })
                    })
                  } else {
                    trans_email.sendMail({
                      from: '"MJ Supreme" <info@mj-supreme.com>',
                      to: email_grab_data['email'],
                      subject: 'Verification Token',
                      html: html
                    }, function (err, info) {
                      if (err) {
                        last_id_delete_token(email_grab_data['token_id'], function (cb_err) {
                          res.json({
                            status: false,
                            message: cb_err ? cb_err.message : err.message
                          })
                        })
                      } else {
                        res.json({
                          status: true,
                          token: tokenGen({
                            email: email_grab_data['email'],
                            type: 0,
                            id: mem_id,
                          }, 0),
                          user: {
                            email: email_grab_data['email'],
                            type: 0,
                            user_id: mem_id,
                            is_paid: 0
                          }
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
})

module.exports = router

function sendDBError(res, err) {
  res.status(500).json({
    success: false,
    message: "DB Error: " + err.message
  })
}

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

function tokenGen(data, type) {
  let token = jwt.sign({
      data: {
        email: data.email,
        user_id: data.id,
        type: type
      }
    },
    secret, {
      expiresIn: "1 days"
    })
  return token
}

function userData(data, type) {
  return {
    email: data.email,
    type: type,
    user_id: data.id
  }
}