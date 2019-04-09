const mysql = require("mysql")
const moment = require('moment')
const _cliProgress = require('cli-progress')

const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic)

const config = require('../config.js')

const db = mysql.createPool((config.dev === true) ? config.db.local : config.db.live)
const db_util = require('../func/db-util.js')

call()


async function call() {
  let today_date = moment('2018', 'YYYY').endOf('year')
  return await new Promise(resolve => {
    db.getConnection(async function (err, connection) {
      if (err) {
        console.log(err)
        return resolve()
      } else {
        db_util.connectTrans(connection, async function (resolve_q, err_cb) {
            connection.query(`select count(*) as tot from info_var_m`, async function (error, result) {
              if (error) {
                err_cb(error)
              } else {
                let tot_mem = result.length > 0 ? result[0].tot : 0
                let err;
                f1: for (let i = 0; i < tot_mem; i++) {
                  await new Promise(innRes => {
                    connection.query(
                      `select 
                        * 
                      from info_var_m
                      limit 1
                      offset ${i}`,
                      function (error, result) {
                        if (error) {
                          err = error
                          return innRes()
                        } else {
                          if (result.length > 0) {
                            let mem_id = result[0].member_id
                            connection.query(
                              `select 
                                count(*) as tot
                              from transactions_m
                              where member_id=${mem_id}`,
                              async function (error, result) {
                                if (error) {
                                  err = error
                                  return innRes()
                                } else {
                                  let tot_trans = result.length > 0 ? result[0].tot : 0
                                  let wallet = 0,
                                    pending = 0,
                                    available = 0,
                                    tot_credit = 0,
                                    last_w_tr_id = null,
                                    last_p_tr_id = null,
                                    last_a_tr_id = null
                                  console.log("total trans", tot_trans, "member", mem_id)
                                  bar.start(tot_trans, 0)
                                  f2: for (let i2 = 0; i2 < tot_trans; i2++) {
                                    await new Promise(innRes2 => {
                                      connection.query(
                                        `select 
                                            *
                                          from transactions_m
                                          where member_id=${mem_id}
                                          order by created_at
                                          limit 1
                                          offset ${i2}`,
                                        function (error, result) {
                                          if (error) {
                                            err = error
                                            return innRes2()
                                          } else {
                                            if (result.length > 0) {
                                              bar.update(i2 + 1)
                                              tot_credit += parseInt(result[0].credit)
                                              let trans_date_diff = today_date.diff(moment(new Date(result[0].created_at)), 'd')
                                              if (trans_date_diff > 18) {
                                                available += parseInt(result[0].debit)
                                                last_a_tr_id = result[0].id
                                              } else if (trans_date_diff > 3 && trans_date_diff <= 18) {
                                                pending += parseInt(result[0].debit)
                                                if (last_p_tr_id == null) {
                                                  last_p_tr_id = result[0].id
                                                }
                                              } else {
                                                wallet += parseInt(result[0].debit)
                                                if (last_w_tr_id == null) {
                                                  last_w_tr_id = result[0].id
                                                }
                                              }
                                            }
                                            return innRes2()
                                          }
                                        }
                                      )
                                    })
                                    if (err) break f2;
                                  }
                                  bar.stop()
                                  console.log('wallet:', wallet, '\t', 'pending', pending, '\t', 'available', available, '\t', 'tot_credit', tot_credit)
                                  available = available - tot_credit
                                  if (available < 0) {
                                    pending += available
                                    available = 0
                                    if (pending < 0) {
                                      wallet += pending
                                      pending = 0
                                    }
                                  }
                                  console.log('After deduct credit')
                                  console.log('wallet:', wallet, '\t', 'pending', pending, '\t', 'available', available)

                                  connection.query(
                                    `update info_var_m set ? where member_id=${mem_id}`, {
                                      wallet,
                                      pending,
                                      available,
                                      last_p_tr_id,
                                      last_w_tr_id,
                                      last_a_tr_id
                                    },
                                    function (error) {
                                      if (error) {
                                        err = error
                                      }
                                      return innRes()
                                    }
                                  )
                                }
                              }
                            )
                          } else {
                            return innRes()
                          }
                        }
                      }
                    )
                  })
                  if (err) break f1;
                  // if (i === 0) break f1;
                }
                if (err) {
                  err_cb(err)
                }
              }
              return resolve_q()
            })

          },
          function (error) {
            if (error) {
              console.log(error)
            } else {
              console.log("Successfully job done.")
            }
            return resolve()
          })
      }
    })
  })
}