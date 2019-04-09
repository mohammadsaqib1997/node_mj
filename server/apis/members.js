const express = require('express')
const router = express.Router()
const _ = require('lodash')
const moment = require("moment")
const {
  DateTime
} = require('luxon');

const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.get("/", function (req, res) {
  let offset = 0,
    limit = 10,
    search = "",
    filter_qry = ""
  if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
    limit = req.query.limit
  }

  if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
    offset = (parseInt(req.query.page) - 1) * limit
  }

  if (req.query.search) {
    search = req.query.search
  }

  if (/^[0-9]$|^(unpaid|paid)$|^suspend$/.test(req.query.filter)) {
    filter_qry = `${search !== "" ? 'AND' : ''}`;

    if (/^[0-9]$/.test(req.query.filter)) {
      filter_qry += ` u_var.level='${req.query.filter}'`
    } else if (/^(unpaid|paid)$/.test(req.query.filter)) {
      filter_qry += ` m.is_paid_m='${req.query.filter == 'paid' ? 1 : 0}'`
    } else if (/^suspend$/.test(req.query.filter)) {
      filter_qry += ` m.active_sts=0`
    }
  }


  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query(
        `SELECT COUNT(*) as total_rows 
        FROM members as m
        LEFT JOIN info_var_m as u_var
        ON m.id = u_var.member_id
        LEFT JOIN mem_link_crzb as mem_l_crzb
        ON m.id=mem_l_crzb.member_id
        LEFT JOIN crzb_list as crzb_l
        ON mem_l_crzb.crzb_id=crzb_l.id
        ${(search !== '' || filter_qry !== '') ? 'WHERE' : ''}
        ${(search !== '') ? '(m.user_asn_id LIKE ? OR m.email LIKE ? OR m.full_name LIKE ? OR crzb_l.name LIKE ?)' : ''}
        ${(filter_qry !== '') ? filter_qry : ''}
        `,
        ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
        function (error, results, fields) {
          if (error) {
            connection.release();
            res.status(500).json({
              error
            })
          } else {
            let rows_count = results[0].total_rows
            if (rows_count > 0) {

              connection.query(
                `SELECT 
                  m.id, 
                  m.user_asn_id, 
                  m.email, 
                  m.full_name,
                  m.active_sts, 
                  m.is_paid_m, 
                  crzb_l.name as crzb_name,
                  u_var.level,
                  COUNT(ur.id) as tot_rcp_up 
                FROM members as m
                LEFT JOIN mem_link_crzb as mem_l_crzb
                ON m.id=mem_l_crzb.member_id
                LEFT JOIN crzb_list as crzb_l
                ON mem_l_crzb.crzb_id=crzb_l.id
                LEFT JOIN user_receipts as ur
                ON m.id=ur.ref_id AND ur.type=0 
                LEFT JOIN info_var_m as u_var
                ON m.id = u_var.member_id
                ${(search !== '' || filter_qry !== '') ? 'WHERE' : ''}
                ${(search !== '') ? '(m.user_asn_id LIKE ? OR m.email LIKE ? OR m.full_name LIKE ? OR crzb_l.name LIKE ?)' : ''}
                ${(filter_qry !== '') ? filter_qry : ''}
                GROUP BY m.id
                ORDER BY m.id DESC
                LIMIT ${limit}
                OFFSET ${offset}`,
                ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'],
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
              );

            } else {
              connection.release();
              res.json({
                data: [],
                total_rows: rows_count
              })
            }
          }
        })
    }
  })
})

router.get('/member_info/:id', function (req, res, next) {
  if (req.decoded.data.type > 0) {
    if (/^[0-9]*$/.test(req.params.id)) {
      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({
            error: err
          })
        } else {
          connection.query(
            `SELECT 
              m.id,
              m.active_sts,
              m.address,
              m.cnic_num,
              m.contact_num,
              m.dob,
              m.email,
              m.full_name,
              m.ref_user_asn_id,
              m.user_asn_id,
              prd.id as product_id,
              prd.name as product_name,
              u_var.package_act_date,
              u_var.level,
              u_var.wallet,
              u_var.direct_ref_count as direct_ref,
              u_var.in_direct_ref_count as indirect_ref,
              u_bank.bank_name,
              u_bank.branch_code,
              u_bank.account_number,
              u_bank.account_title,
              u_bank.iban_number,
              u_bank.address as bk_address,
              crzb_l.name as crzb_name
            FROM members as m

            LEFT JOIN mem_link_crzb as mem_l_crzb
            ON m.id=mem_l_crzb.member_id
            LEFT JOIN (
              select
                ls_b.id,
                concat(ls_b.name, ", ", ls_z.name, ", ", ls_r.name, ", ", ls_c.name) as name
              from crzb_list as ls_b
                
              join crzb_list as ls_z
              on ls_b.parent_id = ls_z.id
              join crzb_list as ls_r
              on ls_z.parent_id = ls_r.id
              join crzb_list as ls_c
              on ls_r.parent_id = ls_c.id
                
            ) as crzb_l
            ON mem_l_crzb.crzb_id=crzb_l.id
            
            LEFT JOIN user_product_details as u_prd
            ON m.id = u_prd.member_id
            LEFT JOIN products as prd
            ON u_prd.product_id = prd.id
            LEFT JOIN info_var_m as u_var
            ON m.id = u_var.member_id
            LEFT JOIN user_bank_details as u_bank
            ON m.id = u_bank.member_id
            WHERE m.id=?`,
            req.params.id,
            function (err, results) {
              connection.release()

              if (err) {
                res.status(500).json({
                  error: err
                })
              } else {
                let result = (results.length > 0) ? results[0] : {}
                res.json({
                  result
                })
              }

            }
          )
        }
      })
    } else {
      res.json({
        status: false,
        message: "Invalid id!"
      })
    }
  } else {
    res.json({
      status: false,
      message: "Permission denied!"
    })
  }
})

router.get("/get_terms_sts", (req, res) => {
  if (req.decoded.data.user_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT accept_sts FROM terms_accept WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let accept_sts = 0
            if (results.length > 0) {
              accept_sts = results[0].accept_sts
            }
            res.json({
              accept_sts
            })
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.post("/terms_accept", (req, res) => {
  if (req.decoded.data.user_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT accept_sts FROM terms_accept WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let query = 0
            if (results.length > 0) {
              query = `UPDATE terms_accept SET accept_sts=1 WHERE member_id=${req.decoded.data.user_id}`
            } else {
              query = `INSERT INTO terms_accept SET member_id=${req.decoded.data.user_id}, accept_sts=1`
            }

            connection.query(query, function (error, result) {
              connection.release()
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
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.get('/get_level_info', function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT h_childs_count, direct_ref_count FROM info_var_m WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (results.length > 0) {
              res.json({
                child_count: results[0].h_childs_count,
                direct_ref: results[0].direct_ref_count
              })
            } else {
              res.json({
                status: false,
                message: "You are not active member!"
              })
            }
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.get('/get_direct_ref_c', function (req, res) {
  if (req.decoded.data.user_id && req.decoded.data.type === 0) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        connection.query("SELECT (SUM(direct_ref_count)+SUM(in_direct_ref_count)) as ref_count FROM info_var_m WHERE member_id=?", req.decoded.data.user_id, function (error, results) {
          connection.release()
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (results.length > 0) {
              res.json({
                ref_count: results[0].ref_count
              })
            } else {
              res.json({
                status: false,
                message: "You are not active member!"
              })
            }
          }
        })
      }
    })
  } else {
    res.json({
      status: false,
      message: "No user found!"
    })
  }
})

router.get('/wallet/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT wallet
        FROM info_var_m
        WHERE member_id=?
        `
        }

        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let wallet = 0
            if (results.length > 0) {
              wallet = results[0].wallet
            }
            res.json({
              data: wallet
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.get('/user_info/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT direct_ref_count, in_direct_ref_count, level, package_act_date, wallet
        FROM info_var_m
        WHERE member_id=?
        `
        }
        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let data = {}
            if (results.length > 0) {
              data = results[0]
            }
            res.json({
              data
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.get('/get_referrals/:id', function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    let grab_months = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {},
      11: {},
      12: {},
    }

    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
        let throw_error = null
        let user_asn_id = null
        let mem_id = req.params.id

        await new Promise(resolve => {
          connection.query('SELECT id, user_asn_id FROM members WHERE id=?', mem_id, function (error, results) {
            if (error) {
              throw_error = error
            } else {
              if (results.length > 0 && results[0].user_asn_id !== null) {
                user_asn_id = results[0].user_asn_id
              }
            }
            resolve()
          })
        })

        if (user_asn_id) {
          let date = moment().set('M', 0).set('Y', moment().get('Y') - 1).endOf('Y')
          for (month in grab_months) {
            await new Promise(resolve => {
              date.add(1, 'month')
              let start = date.clone().startOf('month').format("YYYY-MM-DD HH-mm-ss")
              let end = date.clone().endOf('month').format("YYYY-MM-DD HH-mm-ss")

              connection.query('SELECT COUNT(*) as count FROM members WHERE ref_user_asn_id = ? AND is_paid_m = 1 AND created_at >= ? AND created_at <= ?', [user_asn_id, start, end], function (error, results) {
                if (error) {
                  throw_error = error
                  resolve()
                } else {
                  grab_months[month]['paid'] = results[0].count

                  connection.query('SELECT COUNT(*) as count FROM members WHERE ref_user_asn_id = ? AND is_paid_m = 0 AND created_at >= ? AND created_at <= ?', [user_asn_id, start, end], function (error, results) {
                    if (error) {
                      throw_error = error
                      resolve()
                    } else {
                      grab_months[month]['un_paid'] = results[0].count
                      resolve()
                    }
                  })
                }
              })
            })

            if (throw_error) {
              break
            }
          }
        }
        connection.release();

        if (throw_error) {
          res.status(500).json({
            error: throw_error
          })
        } else {
          res.json({
            data: grab_months
          })
        }



      }
    })
  } else {
    next()
  }
})

router.get("/user_id/:id", function (req, res, next) {
  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
        SELECT user_asn_id
        FROM members
        WHERE id=?
        `
        }
        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (results.length > 0 && results[0].user_asn_id !== null) {
              res.json({
                user_asn_id: results[0].user_asn_id
              })
            } else {
              res.status(404).json({
                message: "Not Found Id!"
              })
            }
          }
        });
      }
    })
  } else {
    next()
  }
})

router.get("/:id", function (req, res, next) {

  if (/^[0-9]*$/.test(req.params.id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let options = {
          sql: `
          SELECT m.*, upd.product_id, crzb_data.*
          FROM members AS m

          LEFT JOIN user_product_details as upd
          ON m.id=upd.member_id
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

          WHERE m.id=?
        `
        }

        connection.query(options, [req.params.id], function (error, results, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              data: results
            })
          }

        });
      }
    })
  } else {
    next()
  }
})

router.post("/add_referral", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query(
          'SELECT COUNT(*) as count FROM members WHERE id=? AND user_asn_id=?',
          [req.decoded.data.user_id, req.body.member_data.ref_user_asn_id],
          function (error, results) {
            if (error) {
              err_hdl(error)
              resolve()
            } else {
              if (results[0].count > 0) {
                connection.query(
                  `SELECT reg_amount FROM products WHERE id=?`,
                  req.body.ext_data.product_id,
                  async function (error, result) {
                    if (error) {
                      err_hdl(error)
                      resolve()
                    } else {
                      if (result.length > 0) {
                        let prd_reg_amount = result[0].reg_amount

                        let throw_error;
                        let promotion_id;
                        await new Promise(promResolve => {
                          let curr_date = moment(DateTime.local()
                            .setZone("UTC+5")
                            .toString()).format("YYYY-MM-DD HH-mm-ss")
                          connection.query(
                            `SELECT id, disc_percent FROM disc_promotions WHERE prd_id = ${req.body.ext_data.product_id} AND (start_prom_dt<='${curr_date}' AND end_prom_dt>='${curr_date}') limit 1`,
                            function (error, result) {
                              if (error) {
                                throw_error = error
                                return promResolve()
                              } else {
                                if (result.length > 0) {
                                  promotion_id = result[0].id
                                  prd_reg_amount = parseInt(prd_reg_amount) - parseInt((parseInt(prd_reg_amount) * result[0].disc_percent) / 100)
                                }
                                return promResolve()
                              }
                            }
                          )
                        })
                        if (throw_error) {
                          err_hdl(throw_error)
                          resolve()
                        }

                        // deduct amount from wallet
                        connection.query(
                          'SELECT wallet, pending FROM `info_var_m` WHERE member_id=?',
                          req.decoded.data.user_id,
                          function (error, results) {
                            if (error) {
                              err_hdl(error)
                              resolve()
                            } else {
                              let amount_wp = 0

                              let wallet = 0,
                                pending = 0
                              if (results.length) {
                                wallet = results[0].wallet ? parseInt(results[0].wallet) : 0
                                pending = results[0].pending ? parseInt(results[0].pending) : 0
                              }
                              amount_wp = wallet + pending

                              if (amount_wp >= prd_reg_amount) {
                                wallet -= prd_reg_amount
                                if (wallet < 0) {
                                  pending -= -(wallet)
                                  wallet = 0
                                }
                                let set_w_params = {
                                  wallet,
                                  pending
                                }
                                connection.query(
                                  'UPDATE info_var_m SET ? WHERE member_id=?',
                                  [set_w_params, req.decoded.data.user_id],
                                  function (error, results) {
                                    if (error) {
                                      err_hdl(error)
                                      resolve()
                                    } else {
                                      // grab last user asn id
                                      connection.query(
                                        'SELECT user_asn_id FROM `members` ORDER BY user_asn_id DESC LIMIT 1',
                                        function (error, results) {
                                          if (error) {
                                            err_hdl(error)
                                            resolve()
                                          } else {
                                            req.body.member_data['is_paid_m'] = 1
                                            req.body.member_data['active_sts'] = 1

                                            // id increament with last id
                                            let new_inc = (parseInt(results[0].user_asn_id) + 1).toString()
                                            new_inc = (new_inc.length < 9) ? ("000000000" + new_inc).substr(-9, 9) : new_inc
                                            req.body.member_data['user_asn_id'] = new_inc

                                            // insert member for new data
                                            connection.query(
                                              'INSERT INTO members SET ?',
                                              req.body.member_data,
                                              async function (error, results) {
                                                if (error) {
                                                  err_hdl(error)
                                                  resolve()
                                                } else {
                                                  let mem_id = results.insertId

                                                  if (promotion_id) {
                                                    let throw_error;
                                                    await new Promise(promResolve => {
                                                      connection.query(
                                                        `INSERT INTO mem_in_prom SET ?`, {
                                                          member_id: mem_id,
                                                          disc_prom_id: promotion_id
                                                        },
                                                        function (error) {
                                                          if (error) {
                                                            throw_error = error
                                                          }
                                                          return promResolve()
                                                        }
                                                      )
                                                    })
                                                    if (throw_error) {
                                                      err_hdl(throw_error)
                                                      resolve()
                                                    }
                                                  }


                                                  connection.query(
                                                    'INSERT INTO `user_product_details` SET ?', {
                                                      product_id: req.body.ext_data.product_id,
                                                      member_id: mem_id
                                                    },
                                                    function (error, results) {
                                                      if (error) {
                                                        err_hdl(error)
                                                        resolve()
                                                      } else {
                                                        connection.query(
                                                          'INSERT INTO `mem_link_crzb` SET ?', {
                                                            member_id: mem_id,
                                                            crzb_id: req.body.ext_data.crzb_id,
                                                            linked_mem_type: 1
                                                          },
                                                          async function (error, results) {
                                                            if (error) {
                                                              err_hdl(error)
                                                              resolve()
                                                            } else {

                                                              connection.query(
                                                                'INSERT INTO `transactions_m` SET ?', {
                                                                  member_id: req.decoded.data.user_id,
                                                                  remarks: "Create New Referral Fees Deduct Amount In Your Wallet - User ID " + req.body.member_data['user_asn_id'],
                                                                  credit: prd_reg_amount
                                                                },
                                                                function (error, results) {
                                                                  if (error) {
                                                                    err_hdl(error)
                                                                    resolve()
                                                                  } else {
                                                                    connection.query('INSERT INTO `notifications` SET ?', {
                                                                      from_type: 1,
                                                                      to_type: 0,
                                                                      from_id: 1,
                                                                      to_id: req.decoded.data.user_id,
                                                                      message: "Create New Referral Fees Deduct Amount In Your Wallet - User ID " + req.body.member_data['user_asn_id'],
                                                                      notify_type: 0
                                                                    }, function (error, results) {
                                                                      if (error) {
                                                                        err_hdl(error)
                                                                        resolve()
                                                                      } else {
                                                                        after_paid_member(connection, mem_id, req.body.member_data['user_asn_id'], function (err) {
                                                                          if (err) {
                                                                            err_hdl(err)
                                                                          }
                                                                          resolve()
                                                                        })
                                                                      }
                                                                    })
                                                                  }
                                                                })
                                                            }
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
                                err_hdl(`You have not Rs. ${prd_reg_amount}/- in your account!`)
                                resolve()
                              }
                            }
                          })
                      } else {
                        err_hdl("Invalid Product Selected!")
                        resolve()
                      }
                    }
                  }
                )
              } else {
                err_hdl("Invalid User!")
                resolve()
              }
            }
          })
      }, function (error) {
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
})

router.post('/mjIdCheck', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query('SELECT user_asn_id FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
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

router.post('/add', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query('INSERT INTO `members` SET ?', req.body.member_data, async function (error, results, fields) {
          if (error) {
            err_hdl(error)
            resolve()
          } else {
            let mem_id = results.insertId

            let throw_error;
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
              err_hdl(throw_error)
              resolve()
            }


            connection.query('INSERT INTO `user_product_details` SET ?', {
              product_id: req.body.ext_data.prd_id,
              member_id: mem_id
            }, function (error, results, fields) {
              if (error) {
                err_hdl(error)
                resolve()
              } else {
                connection.query('INSERT INTO `mem_link_crzb` SET ?', {
                  member_id: mem_id,
                  crzb_id: req.body.ext_data.crzb_id,
                  linked_mem_type: 1
                }, async function (error, results, fields) {
                  if (error) {
                    err_hdl(error)
                    resolve()
                  } else {

                    if (_.get(req.body.member_data, 'is_paid_m', 0) === 1) {
                      after_paid_member(connection, mem_id, req.body.member_data.user_asn_id, function (err) {
                        if (err) {
                          err_hdl(err)
                        }
                        return resolve()
                      })
                    } else {
                      resolve()
                    }

                  }
                })
              }
            })
          }
        })
      }, function (error) {
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

})

router.post('/update', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_hdl) {
        connection.query('UPDATE `members` SET ? WHERE id=?', [req.body.member_data, req.body.update_id], function (error, results, fields) {
          if (error) {
            err_hdl(error)
            resolve()
          } else {
            connection.query('SELECT member_id FROM user_product_details WHERE member_id=?', [req.body.update_id], function (error, results, fields) {
              if (error) {
                err_hdl(error)
                resolve()
              } else {
                let query = 'UPDATE `user_product_details` SET ? WHERE member_id=?'
                let params = [{
                  product_id: req.body.ext_data.product_id
                }, req.body.update_id]

                if (results.length < 1) {
                  query = 'INSERT INTO `user_product_details` SET ?'
                  params = [{
                    product_id: req.body.ext_data.product_id,
                    member_id: req.body.update_id
                  }]
                }
                connection.query(query, params, function (error, results, fields) {
                  if (error) {
                    err_hdl(error)
                    resolve()
                  } else {
                    connection.query(
                      `SELECT link_mem.member_id, m.is_paid_m FROM members as m
                      LEFT JOIN mem_link_crzb as link_mem
                      ON m.id = link_mem.member_id
                      WHERE m.id=?`,
                      [req.body.update_id],
                      function (error, results, fields) {
                        if (error) {
                          err_hdl(error)
                          resolve()
                        } else {
                          let query = 'UPDATE `mem_link_crzb` SET ? WHERE member_id=?'
                          let params = [{
                            crzb_id: req.body.ext_data.crzb_id
                          }, req.body.update_id]

                          if (results.length && results[0].member_id == null) {
                            query = 'INSERT INTO `mem_link_crzb` SET ?'
                            params = [{
                              crzb_id: req.body.ext_data.crzb_id,
                              member_id: req.body.update_id,
                              linked_mem_type: results[0].is_paid_m == 0 ? 1 : 0
                            }]
                          }
                          connection.query(query, params, async function (error, results, fields) {
                            if (error) {
                              err_hdl(error)
                              resolve()
                            } else {
                              if (_.get(req.body.member_data, 'is_paid_m', 0) === 1) {
                                after_paid_member(connection, req.body.update_id, req.body.member_data.user_asn_id, function (err) {
                                  if (err) {
                                    err_hdl(err)
                                  }
                                  resolve()
                                })
                              } else {
                                resolve()
                              }
                            }
                          })
                        }
                      })
                  }
                })
              }
            })
          }
        })
      }, function (error) {
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

})

router.post('/pay_user', function (req, res) {
  if (/^[0-9]*$/.test(req.body.id)) {

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let mem_id = req.body.id

        db_util.connectTrans(connection, function (resolve, err_hdl) {
          connection.query('SELECT user_asn_id FROM `members` ORDER BY user_asn_id DESC LIMIT 1', function (error, result) {
            if (error) {
              err_hdl(error)
              resolve()
            } else {
              let params_set = {
                is_paid_m: 1
              }
              // if not find it first id assign
              if (result[0].user_asn_id === null) {
                params_set['user_asn_id'] = '000010001'
              } else {
                // id increament with last id
                let new_inc = (parseInt(result[0].user_asn_id) + 1).toString()
                new_inc = (new_inc.length < 9) ? ("000000000" + new_inc).substr(-9, 9) : new_inc
                params_set['user_asn_id'] = new_inc
              }

              // first change status is_paid_m=1 and assign id
              connection.query('UPDATE `members` SET ? WHERE id=?', [params_set, mem_id], function (error, result) {
                if (error) {
                  err_hdl(error)
                  return resolve()
                } else {
                  after_paid_member(connection, mem_id, params_set['user_asn_id'], function (err) {
                    if (err) {
                      err_hdl(err)
                    }
                    return resolve()
                  })
                }
              })

            }
          })
        }, function (error) {
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

async function after_paid_member(connection, mem_id, mem_asn_id, cb) {
  let throw_error = null
  // initial product amount member which was registered in it
  let add_to_c_wallet = 0
  let prd_id = null
  await new Promise(resolve => {
    connection.query(
      `SELECT prd.reg_amount, prd.id 
      FROM user_product_details as u_prd_det
      LEFT JOIN products as prd
      ON u_prd_det.product_id = prd.id
      WHERE u_prd_det.member_id=${mem_id}`,
      function (error, result) {
        if (error) {
          throw_error = error
          return resolve()
        } else {
          let prd_det = result[0]
          prd_id = prd_det.id
          add_to_c_wallet = prd_det.reg_amount
          connection.query(
            `select 
                disc_promotions.disc_percent
              from mem_in_prom
              join disc_promotions
              on mem_in_prom.disc_prom_id = disc_promotions.id and disc_promotions.prd_id = ${prd_det.id}
              where mem_in_prom.member_id=${mem_id}`,
            function (error, result) {
              if (error) {
                throw_error = error
              } else {
                if (result.length > 0) {
                  add_to_c_wallet = parseInt(prd_det.reg_amount) - parseInt((parseInt(prd_det.reg_amount) * result[0].disc_percent) / 100)
                }
              }
              return resolve()
            }
          )
        }
      })
  })

  if (throw_error) {
    return cb(throw_error)
  }

  // apply fees - transaction into company wallet
  await new Promise(resolve => {
    connection.query('INSERT INTO `transactions_comp` SET ?', {
      remarks: "Activation Fees From User ID " + mem_asn_id,
      debit: add_to_c_wallet
    }, function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        connection.query('INSERT INTO `notifications` SET ?', {
          from_type: 0,
          to_type: 1,
          from_id: mem_id,
          to_id: 1,
          message: "Activation Fees From User ID " + mem_asn_id,
          notify_type: 0
        }, function (error, results, fields) {
          if (error) {
            throw_error = error
          }
          return resolve()
        })
      }
    })
  })
  if (throw_error) {
    return cb(throw_error)
  }

  // insert member variable
  await new Promise(resolve => {
    connection.query('INSERT INTO `info_var_m` SET ?', {
      member_id: mem_id
    }, async function (error, results, fields) {
      if (error) {
        throw_error = error
      }
      return resolve()
    })
  })
  if (throw_error) {
    return cb(throw_error)
  }

  // count and add in hierarchy and assign parent id here
  await new Promise(resolve => {
    connection.query('SELECT COUNT(*) AS total_rows FROM `hierarchy_m`', function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        let h_params = {
          id: results[0].total_rows + 1,
          member_id: mem_id,
          parent_id: Math.ceil(results[0].total_rows / 4)
        }
        let grab_parent_ids = [h_params.parent_id]

        // insert hierarchy tree member
        connection.query('INSERT INTO `hierarchy_m` SET ?', h_params, async function (error, results, fields) {
          if (error) {
            throw_error = error
            return resolve()
          } else {

            // here is parents level increament
            for (parent_id of grab_parent_ids) {
              let exist_row = true

              await new Promise(resolve2 => {
                if (parent_id > 0) {

                  // select hierarchy id and grab row
                  connection.query('SELECT member_id, parent_id FROM `hierarchy_m` WHERE id=?', parent_id, function (error, results, fields) {
                    if (error) {
                      throw_error = error
                      return resolve2()
                    } else {
                      // found the parent id and next parent id grab
                      if (results.length > 0) {
                        if (results[0].parent_id > 0) {
                          grab_parent_ids.push(results[0].parent_id)
                        }

                        // select parent selected info variables
                        connection.query('SELECT * FROM `info_var_m` WHERE member_id=?', results[0].member_id, function (error, results, fields) {
                          if (error) {
                            throw_error = error
                            return resolve2()
                          } else {
                            let old_level = results[0].level
                            let i_mem_id = results[0].member_id

                            // update the info variables
                            let set_info_params = {
                              h_childs_count: parseInt(results[0].h_childs_count) + 1,
                              level: get_level(parseInt(results[0].h_childs_count) + 1)
                            }
                            connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_info_params, i_mem_id], function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve2()
                              } else {
                                if (old_level < set_info_params.level) {
                                  connection.query('INSERT INTO `notifications` SET ?', {
                                    from_type: 1,
                                    to_type: 0,
                                    from_id: 1,
                                    to_id: i_mem_id,
                                    from_txt: 'Admin',
                                    message: "Successfully Upgrade Your Level Up -> " + set_info_params.level,
                                    notify_type: 0
                                  }, function (error, results, fields) {
                                    if (error) {
                                      throw_error = error
                                    }
                                    return resolve2()
                                  })
                                } else {
                                  return resolve2()
                                }

                              }
                            })

                          }
                        })
                      } else {
                        exist_row = false
                        return resolve2()
                      }
                    }
                  })
                } else {
                  exist_row = false
                  return resolve2()
                }
              })
              if (throw_error || exist_row === false) break
            }
            return resolve()
          }
        })

      }
    })
  })
  if (throw_error) {
    return cb(throw_error)
  }

  // now finance goes here
  await new Promise(resolve => {
    // select ref user and apply comissions and set wallet and direct or indirect count increament
    connection.query('SELECT user_asn_id, ref_user_asn_id FROM `members` WHERE id=?', mem_id, async function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {

        if (results[0].ref_user_asn_id == null) {
          results[0].ref_user_asn_id = '000000022'
          await new Promise(resolve2 => {
            connection.query(
              `UPDATE members SET ? WHERE id=?`,
              [{
                ref_user_asn_id: '000000022'
              }, mem_id],
              function (error, result) {
                if (error) {
                  throw_error = error
                }
                return resolve2()
              }
            )
          })
          if (throw_error) {
            return resolve()
          }
        }

        if (results[0].ref_user_asn_id !== null) {
          let grab_ref_usr_ids = [results[0].ref_user_asn_id]

          let direct_inc = 0
          for (ref_usr_asn_id of grab_ref_usr_ids) {
            await new Promise(resolve2 => {

              connection.query(
                `SELECT m.id, m.full_name, m.ref_user_asn_id, m.active_sts, iv.direct_ref_count, iv.in_direct_ref_count, iv.wallet, iv.level
                FROM \`members\` as m
                LEFT JOIN info_var_m as iv
                ON m.id = iv.member_id
                WHERE user_asn_id=?`,
                ref_usr_asn_id,
                async function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve2()
                  } else {
                    if (results[0].ref_user_asn_id !== null) {
                      grab_ref_usr_ids.push(results[0].ref_user_asn_id)
                    }
                    if(results[0].active_sts !== 1) {
                      return resolve2()
                    }

                    direct_inc++
                    let ref_mem_id = results[0].id

                    // campaign process goes here -- start
                    if (direct_inc <= 9) {
                      await new Promise(resolveCamp => {
                        let curr_date = DateTime.local()
                          .setZone("UTC+5")
                          .toFormat("yyyy-LL-dd HH:mm:ss")
                        connection.query(
                          `select id from campaigns where start_date <= '${curr_date}' and end_date >= '${curr_date}' limit 1`,
                          function (error, result) {
                            if (error) {
                              throw_error = error
                              return resolveCamp()
                            } else {
                              if (result.length > 0) {
                                let camp_id = result[0].id
                                connection.query(
                                  `select id, total_ref from mem_in_campaign where member_id=${ref_mem_id} and campaign_id=${camp_id}`,
                                  async function (error, result) {
                                    if (error) {
                                      throw_error = error
                                      return resolveCamp()
                                    } else {
                                      let mem_in_camp_id, mem_tot_ref = 1
                                      if (result.length > 0) {
                                        mem_in_camp_id = result[0].id
                                        mem_tot_ref = parseInt(result[0].total_ref) + 1
                                        connection.query(
                                          `update mem_in_campaign set ? where id=${mem_in_camp_id}`, {
                                            total_ref: mem_tot_ref
                                          },
                                          function (error) {
                                            if (error) {
                                              throw_error = error
                                            }
                                            return resolveCamp()
                                          }
                                        )
                                      } else {
                                        connection.query(
                                          `insert into mem_in_campaign set ?`, {
                                            member_id: ref_mem_id,
                                            campaign_id: camp_id,
                                            total_ref: mem_tot_ref
                                          },
                                          function (error) {
                                            if (error) {
                                              throw_error = error
                                            }
                                            return resolveCamp()
                                          }
                                        )
                                      }

                                    }
                                  }
                                )
                              } else {
                                return resolveCamp()
                              }
                            }
                          }
                        )
                      })
                      if (throw_error) {
                        return resolve2()
                      }
                    }
                    // campaign process goes here -- end


                    let set_param = {}
                    let commission_amount = 0

                    if (direct_inc === 1) {
                      set_param['direct_ref_count'] = parseInt(results[0].direct_ref_count) + 1
                      commission_amount = (prd_id && prd_id == 2) ? 1500 : 1000

                    } else if (direct_inc === 2) {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                      commission_amount = 300

                    } else if (direct_inc <= 9) {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                      commission_amount = 200
                    }
                    //  else {
                    //   set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                    // }

                    // Check ref user has 4 direct members or active this account this month
                    if (direct_inc > 1) {
                      await new Promise(in_res => {
                        connection.query(
                          `select 
                            h_m.created_at as join_member,
                            m_info.direct_ref_count as direct_ref
                          from hierarchy_m as h_m 
                          join info_var_m as m_info
                          on h_m.member_id = m_info.member_id
                          where h_m.member_id=${ref_mem_id}`,
                          function (error, result) {
                            if (error) {
                              throw_error = error
                            } else {
                              if (result.length > 0 && result[0]) {
                                let now = moment(DateTime.local()
                                  .setZone("UTC+5")
                                  .toString())
                                let old = moment(result[0].join_member)
                                let dur = Math.floor((moment.duration(now.diff(old))).asMonths())
                                if (dur > 1 && parseInt(result[0].direct_ref) < 4) {
                                  commission_amount = 0
                                }
                              }
                            }
                            return in_res()
                          }
                        )
                      })
                      if (throw_error) {
                        return resolve2()
                      }
                    }

                    if (commission_amount > 0) {
                      set_param['wallet'] = parseInt(results[0].wallet) + commission_amount
                    }

                    if (_.isEmpty(set_param)) {
                      return resolve2()
                    } else {
                      connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_param, ref_mem_id], function (error, results, fields) {
                        if (error) {
                          throw_error = error
                          return resolve2()
                        } else {

                          // notify query add direct or indirect
                          connection.query('INSERT INTO `notifications` SET ?', {
                            from_type: 1,
                            to_type: 0,
                            from_id: 1,
                            to_id: ref_mem_id,
                            from_txt: 'Admin',
                            message: `Add Your ${(direct_inc === 1) ? 'Direct' : 'In-Direct'} Refferral in Hierarchy - User ID ${mem_asn_id}`,
                            notify_type: 0
                          }, function (error, results, fields) {
                            if (error) {
                              throw_error = error
                              return resolve2()
                            } else {
                              if (commission_amount > 0) {

                                add_to_c_wallet = add_to_c_wallet - commission_amount

                                // apply commission - transaction
                                connection.query('INSERT INTO `transactions_m` SET ?', {
                                  member_id: ref_mem_id,
                                  remarks: "Issued Commission From User ID " + mem_asn_id,
                                  debit: commission_amount
                                }, function (error, results, fields) {
                                  if (error) {
                                    throw_error = error
                                    return resolve2()
                                  } else {
                                    // notify query issued commission to user
                                    connection.query('INSERT INTO `notifications` SET ?', {
                                      from_type: 1,
                                      to_type: 0,
                                      from_id: 1,
                                      to_id: ref_mem_id,
                                      from_txt: 'Admin',
                                      message: "Issued Commission From User ID " + mem_asn_id + " Amount Rs." + commission_amount + "/-",
                                      notify_type: 0
                                    }, function (error, results, fields) {
                                      if (error) {
                                        throw_error = error
                                        return resolve2()
                                      } else {

                                        // transaction insert in company
                                        connection.query('INSERT INTO `transactions_comp` SET ?', {
                                          remarks: "Issued Commission To User ID " + ref_usr_asn_id,
                                          credit: commission_amount
                                        }, function (error, results, fields) {
                                          if (error) {
                                            throw_error = error
                                            return resolve2()
                                          } else {
                                            // notify admin issued commission to user
                                            connection.query('INSERT INTO `notifications` SET ?', {
                                              from_type: 0,
                                              to_type: 1,
                                              from_id: ref_mem_id,
                                              to_id: 1,
                                              message: "Issued Commission To User ID " + ref_usr_asn_id + " Amount Rs." + commission_amount + "/-",
                                              notify_type: 0
                                            }, function (error, results, fields) {
                                              if (error) {
                                                throw_error = error
                                              }
                                              return resolve2()
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })

                              } else {
                                return resolve2()
                              }
                            }
                          })
                        }
                      })
                    }
                  }
                }
              )
            })
            if (throw_error) break
          }
          return resolve()

        } else {
          return resolve()
        }
      }
    })
  })
  if (throw_error) {
    return cb(throw_error)
  }

  // Country Region Zone and Branch commission goes here
  await new Promise(resolve => {
    // select ref user and apply comissions and set wallet and direct or indirect count increament
    connection.query('SELECT crzb_id FROM mem_link_crzb WHERE member_id=?', mem_id, async function (error, results, fields) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        if (results.length > 0 && results[0].crzb_id !== null) {
          let grab_crzb_ids = [results[0].crzb_id]

          for (crzb_id of grab_crzb_ids) {
            await new Promise(resolve2 => {

              connection.query(
                `SELECT 
                  crzb_l.id, 
                  crzb_l.parent_id, 
                  crzb_l.type as crzb_type,
                  asn_role.id as asn_role_id, 
                  asn_role.member_id,
                  iv_mem.wallet,
                  m.user_asn_id
                FROM crzb_list as crzb_l
                LEFT JOIN assign_roles as asn_role
                ON crzb_l.id = asn_role.crzb_id AND asn_role.role_status=1
                LEFT JOIN info_var_m as iv_mem
                ON asn_role.member_id = iv_mem.member_id
                LEFT JOIN members as m
                ON asn_role.member_id = m.id
                WHERE crzb_l.id=?`,
                crzb_id,
                async function (error, results) {
                  if (error) {
                    throw_error = error
                    return resolve2()
                  } else {
                    if (results[0].parent_id > 0 && results[0].parent_id !== null) {
                      grab_crzb_ids.push(results[0].parent_id)
                    }

                    let asn_role_id = results[0].asn_role_id
                    let asn_role_mem_id = results[0].member_id
                    let asn_role_mem_wallet = parseInt(results[0].wallet)
                    let asn_role_mem_asn_id = results[0].user_asn_id
                    let crzb_type = results[0].crzb_type

                    if (asn_role_mem_id !== null) {
                      let set_param = {}
                      let commission_amount = 0

                      if (crzb_type === 2) {
                        // Zonal commission
                        commission_amount = 300

                        await new Promise(resolve3 => {
                          let curr_date = moment(DateTime.local()
                            .setZone("UTC+5")
                            .toString())
                          let start_of_m = curr_date.startOf('m')
                          let end_of_m = curr_date.endOf('m')
                          connection.query(
                            `select 
                              count(id) as tot_sale_m
                            from assign_roles_trans as asn_r_tr 
                            where 
                              asn_r_tr.member_id=${asn_role_mem_id} and 
                              asn_r_tr.crzb_id=${crzb_id} and 
                              (asn_r_tr.created_at >= '${start_of_m}' and asn_r_tr.created_at <= '${end_of_m}')`,
                            async function (error, results, fields) {
                              if (error) {
                                throw_error = error
                                return resolve3()
                              } else {
                                if (results.length > 0 && results[0].tot_sale_m > 0) {
                                  let m_sales = results[0].tot_sale_m
                                  let g_sales = m_sales > 0 ? m_sales - 1 : 0
                                  let rot_sale_max = 30
                                  let even_sales = Math.floor(g_sales / rot_sale_max) % 2; // means after 30sales commission 1300 and after 60sales return to 300
                                  commission_amount = even_sales === 1 ? commission_amount + 1000 : commission_amount;
                                }
                                return resolve3()
                              }
                            })
                        })
                        if (throw_error) {
                          return resolve2()
                        }

                      } else if (crzb_type === 1) {
                        // Sales Coordinator/Regional commission
                        commission_amount = 150
                      } else if (crzb_type === 0) {
                        // Country Manager commission
                        commission_amount = 100
                      }

                      set_param['wallet'] = asn_role_mem_wallet + commission_amount

                      add_to_c_wallet = add_to_c_wallet - commission_amount

                      let crz_names = ['Country', 'Sales Coordinator', 'Zone']

                      connection.query('UPDATE `info_var_m` SET ? WHERE member_id=?', [set_param, asn_role_mem_id], function (error, results) {
                        if (error) {
                          throw_error = error
                          return resolve2()
                        } else {

                          // save commission - transaction in assign role transaction
                          connection.query('INSERT INTO `assign_roles_trans` SET ?', {
                            member_id: asn_role_mem_id,
                            crzb_id,
                            asn_role_id,
                            linked_member_id: mem_id,
                            amount: commission_amount
                          }, function (error, results, fields) {
                            if (error) {
                              throw_error = error
                              return resolve2()
                            } else {
                              // apply commission - transaction
                              connection.query('INSERT INTO `transactions_m` SET ?', {
                                member_id: asn_role_mem_id,
                                remarks: `Issued Commission For ${crz_names[crzb_type]} From User ID ${mem_asn_id}`,
                                debit: commission_amount
                              }, function (error, results, fields) {
                                if (error) {
                                  throw_error = error
                                  return resolve2()
                                } else {
                                  // notify query issued commission to user
                                  connection.query('INSERT INTO `notifications` SET ?', {
                                    from_type: 1,
                                    to_type: 0,
                                    from_id: 1,
                                    to_id: asn_role_mem_id,
                                    from_txt: 'Admin',
                                    message: `Issued Commission For ${crz_names[crzb_type]} From User ID ${mem_asn_id} Amount Rs.${commission_amount}/-`,
                                    notify_type: 0
                                  }, function (error, results, fields) {
                                    if (error) {
                                      throw_error = error
                                      return resolve2()
                                    } else {
                                      // transaction insert in company
                                      connection.query('INSERT INTO `transactions_comp` SET ?', {
                                        remarks: `Issued Commission For ${crz_names[crzb_type]} To User ID ${asn_role_mem_asn_id}`,
                                        credit: commission_amount
                                      }, function (error, results, fields) {
                                        if (error) {
                                          throw_error = error
                                          return resolve2()
                                        } else {
                                          // notify admin issued commission to user
                                          connection.query('INSERT INTO `notifications` SET ?', {
                                            from_type: 0,
                                            to_type: 1,
                                            from_id: asn_role_mem_id,
                                            to_id: 1,
                                            message: `Issued Commission For ${crz_names[crzb_type]} To User ID ${asn_role_mem_asn_id} Amount Rs.${commission_amount}/-`,
                                            notify_type: 0
                                          }, function (error, results, fields) {
                                            if (error) {
                                              throw_error = error
                                            }
                                            return resolve2()
                                          })
                                        }
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
                      return resolve2()
                    }
                  }
                }
              )
            })
            if (throw_error) break
          }
          return resolve()

        } else {
          return resolve()
        }
      }
    })
  })
  if (throw_error) {
    return cb(throw_error)
  }

  // add amount to company wallet after all commission issued
  await new Promise(resolve => {
    connection.query('SELECT wallet FROM company_var WHERE id=1', function (error, results) {
      if (error) {
        throw_error = error
        return resolve()
      } else {
        let is_add = add_to_c_wallet > 0 ? true : false
        let g_wallet = parseInt(results[0].wallet) + (add_to_c_wallet)

        connection.query('UPDATE company_var SET wallet=? WHERE id=1', g_wallet, function (error, results) {
          if (error) {
            throw_error = error
            return resolve()
          } else {
            if (add_to_c_wallet > 0 || add_to_c_wallet < 0) {
              // notify admin after pay member and wallet amount add or deduct
              connection.query('INSERT INTO `notifications` SET ?', {
                from_type: 0,
                to_type: 1,
                from_id: mem_id,
                to_id: 1,
                message: `${(is_add) ? "Add" : "Deduct"} Amount Rs.${add_to_c_wallet}/- From Wallet After Paid Member`,
                notify_type: 0
              }, function (error, results, fields) {
                if (error) {
                  throw_error = error
                }
                return resolve()
              })
            } else {
              return resolve()
            }
          }
        })
      }
    })
  })
  if (throw_error) {
    return cb(throw_error)
  }

  // notify paid member after paid
  await new Promise(resolve => {
    connection.query('INSERT INTO `notifications` SET ?', {
      from_type: 1,
      to_type: 0,
      from_id: 1,
      to_id: mem_id,
      from_txt: "Admin",
      message: `Your Payment Has Been Approved.`,
      notify_type: 0
    }, function (error, results, fields) {
      if (error) {
        throw_error = error
      }
      return resolve()
    })
  })
  return cb(throw_error)
}

function get_level(childs) {
  let level = 0,
    l_rows = 1,
    c_rows = 1;
  while (childs > c_rows) {
    level++;
    l_rows = l_rows * 4;
    c_rows += l_rows;
  }
  return level;
}