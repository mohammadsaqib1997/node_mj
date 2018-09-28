const fs = require('fs');
const mysql = require("mysql")
const _ = require('lodash')
const config = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'mj_supreme'
}

const db = mysql.createPool(config)

fs.readFile(__dirname + '/sheet#1 - Sheet1.csv', 'utf8', async function (err, data) {
  if (err) {
    console.log(err)
  } else {
    let split_data = data.split("\n")
    split_data.shift()

    db.getConnection(async function (err, connection) {
      if (err) {
        console.log(err)
        return
      } else {
        let throw_err = null

        let inc = 0
        for (line of split_data) {
          inc++
          let spt_row = []
          if (line.indexOf('"') < 0) {
            spt_row = line.split(",")
            spt_row[spt_row.length - 1] = ''
          } else {
            let sep_qur = line.split('"')
            spt_row = sep_qur[0].split(",")
            spt_row[spt_row.length - 1] = sep_qur[1]
          }
          await new Promise(resolve => {

            let user_data = {}
            user_data['user_asn_id'] = _.join(_.split(spt_row[0], "-"), "")
            user_data['full_name'] = spt_row[1]
            let gen_ref_id = _.join(_.split(spt_row[2], "-"), "")
            user_data['ref_user_asn_id'] = gen_ref_id !== "" ? gen_ref_id : null
            user_data['email'] = spt_row[3] !== "" ? spt_row[3] : null
            user_data['password'] = '123456'
            user_data['cnic_num'] = _.join(_.split(spt_row[4], "-"), "")
            let gen_cont_num = _.join(_.split(spt_row[5], "-"), "")
            user_data['contact_num'] = gen_cont_num !== "" ? gen_cont_num : null
            user_data['address'] = spt_row[7]
            user_data['is_paid_m'] = 1
            user_data['active_sts'] = 1

            let prd_data = {
              product_id: 1,
              buyer_type: null,
              buyer_pay_type: null,
              buyer_qty_prd: 0
            }

            connection.beginTransaction(async function (err) {
              if (err) {
                connection.release()
                throw_err = err
                return resolve()
              } else {
                let mem_id = null
                await new Promise(inn_resolve => {
                  connection.query('INSERT INTO `members` SET ?', user_data, function (error, results, fields) {
                    if (error) {
                      throw_err = error
                    } else {
                      mem_id = results.insertId
                    }
                    return inn_resolve()
                  })
                })

                if (throw_err) {
                  connection.rollback(function () {
                    connection.release()
                  });
                  return resolve()
                }

                await new Promise(inn_resolve => {
                  prd_data['member_id'] = mem_id
                  connection.query('INSERT INTO `user_product_details` SET ?', prd_data, function (error, results, fields) {
                    if (error) {
                      throw_err = error
                    }
                    return inn_resolve()
                  })
                })

                if (throw_err) {
                  connection.rollback(function () {
                    connection.release()
                  });
                  return resolve()
                }

                return after_paid_member(connection, mem_id, user_data.user_asn_id, function (err) {
                  if (err) {
                    connection.rollback(function () {
                      connection.release()
                    });
                    return resolve()
                  } else {
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          connection.release()
                        });
                      } else {
                        console.log("insert " + inc)
                      }
                      return resolve()
                    })
                  }
                })

              }
            })

          })
          if (throw_err) break
        }

        connection.release()
        if (throw_err) {
          console.log(throw_err)
        } else {
          console.log("all done")
        }

      }
    })
  }
})


async function after_paid_member(connection, mem_id, mem_asn_id, cb) {
  let throw_error = null
  // initial amount wallet company
  let add_to_c_wallet = 5000

  await new Promise(resolve => {
    // apply fees - transaction
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

  await new Promise(resolve => {
    // insert member variable
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

  await new Promise(resolve => {
    // count and add in hierarchy and assign parent id here
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
        if (results[0].ref_user_asn_id !== null) {
          let grab_ref_usr_ids = [results[0].ref_user_asn_id]

          let direct_inc = 0
          for (ref_usr_asn_id of grab_ref_usr_ids) {
            await new Promise(resolve2 => {

              connection.query(
                `SELECT m.id, m.full_name, m.ref_user_asn_id , iv.direct_ref_count, iv.in_direct_ref_count, iv.wallet, iv.level
                FROM \`members\` as m
                LEFT JOIN info_var_m as iv
                ON m.id = iv.member_id
                WHERE user_asn_id=?`,
                ref_usr_asn_id,
                function (error, results, fields) {
                  if (error) {
                    throw_error = error
                    return resolve2()
                  } else {
                    if (results[0].ref_user_asn_id !== null) {
                      grab_ref_usr_ids.push(results[0].ref_user_asn_id)
                    }

                    let ref_mem_id = results[0].id

                    direct_inc++
                    let set_param = {}
                    let commission_amount = 0

                    if (direct_inc === 1) {
                      set_param['direct_ref_count'] = parseInt(results[0].direct_ref_count) + 1
                      commission_amount = 1000
                      set_param['wallet'] = parseInt(results[0].wallet) + commission_amount

                    } else if (direct_inc === 2) {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                      commission_amount = 300
                      set_param['wallet'] = parseInt(results[0].wallet) + commission_amount

                    } else if (direct_inc <= 9) {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                      commission_amount = 200
                      set_param['wallet'] = parseInt(results[0].wallet) + 200

                    } else {
                      set_param['in_direct_ref_count'] = parseInt(results[0].in_direct_ref_count) + 1
                    }

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
                message: `${(is_add) ? "Add" : "Deduct"} Amount Rs.${add_to_c_wallet}/- From Wallet After Paid Member.`,
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
  let level = 0, l_rows = 1, c_rows = 1;
  while (childs > c_rows) {
    level++;
    l_rows = l_rows * 4;
    c_rows += l_rows;
  }
  return level;
}


