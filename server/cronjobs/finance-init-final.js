const mysql = require("mysql")
const moment = require('moment')
const _cliProgress = require('cli-progress')

const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic)

const config = require('../config.js')

const db = mysql.createPool((config.dev === true) ? config.db.local : config.db.live)
const db_util = require('../func/db-util.js')

let init_pend_job_done = false // false if init is call
let init_avlb_job_done = false // false if init is call
let jobs_errors = null

init()
pend_job()
avlb_job()

async function init() {
  let cronjob_init_at_s = moment().format('YYYY-MM-DD HH:mm:ss')
  // let cronjob_init_at_e = moment('2019-04-05 09:10:39').format('YYYY-MM-DD HH:mm:ss')
  return await new Promise(resolve => {
    db.getConnection(async function (err, connection) {
      if (err) {
        console.log(err)
        jobs_errors = err
        return resolve()
      } else {
        db_util.connectTrans(connection, async function (resolve_q, err_cb) {
          connection.query(`select count(*) as tot from info_var_m`, async function (error, result) {
            if (error) {
              err_cb(error)
            } else {
              let tot_mem = result.length > 0 ? result[0].tot : 0
              // console.log("total members:", tot_mem)
              let err;
              bar.start(tot_mem, 0)
              f1: for (let i = 0; i < tot_mem; i++) {
                await new Promise(innRes => {
                  connection.query(
                    `select 
                        * 
                      from info_var_m
                      limit 1
                      offset ${i}`,
                    async function (error, result) {
                      if (error) {
                        err = error
                        return innRes()
                      } else {
                        if (result.length > 0) {
                          let mem_var = result[0]
                          let mem_id = mem_var.member_id

                          connection.query(
                            `select
                                sum((debit*1) - (credit*1)) as tot_bal
                              from transactions_m where member_id=${mem_id}`,
                            (error, result) => {
                              if (error) {
                                err = error
                                return innRes()
                              } else {
                                let gen_wallet = result.length > 0 ? (result[0].tot_bal ? result[0].tot_bal : 0) : 0
                                const deduct_w = gen_wallet >= 500 ? 500 : gen_wallet
                                gen_wallet -= deduct_w
                                let available = deduct_w

                                // const init_time = moment(randomDate(new Date(cronjob_init_at_s), new Date(cronjob_init_at_e))).format('YYYY-MM-DD HH:mm:ss')
                                connection.query(
                                  `update info_var_m set ? where member_id=${mem_id}`, {
                                    wallet: gen_wallet,
                                    pending: 0,
                                    available,
                                    last_tranf_pend_at: cronjob_init_at_s,
                                    has_avlb_at: null,
                                    max_trans_limit: 500,
                                    last_pend_trans_limit: 500
                                  },
                                  (error) => {
                                    bar.update(i + 1)
                                    if (error) err = error
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
              bar.stop()
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
              jobs_errors = error
            } else {
              console.log("Successfully init job done.")
              init_pend_job_done = true
            }
            return resolve()
          })
      }
    })
  })
}

async function pend_job() {
  setTimeout(async function () {
    if (init_pend_job_done) {
      let cronjob_pend_at = moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss') // diffrence in 1 min but change to 15 days for pending
      let pend_mem = 0
      await new Promise(resolve => {
        db.getConnection(async function (err, connection) {
          if (err) {
            console.log(err)
            jobs_errors = err
            return resolve()
          } else {
            db_util.connectTrans(connection,
              (resolve_q, err_cb) => {
                connection.query(
                  `select 
                    count(*) as tot 
                  from info_var_m as im
                  where im.wallet>0 and im.last_tranf_pend_at < '${cronjob_pend_at}'`,
                  async function (error, result) {
                    if (error) {
                      err_cb(error)
                    } else {
                      let tot_mem = result.length > 0 ? result[0].tot : 0
                      pend_mem = tot_mem
                      // console.log("total selected members:", tot_mem)
                      const init_time = moment().format('YYYY-MM-DD HH:mm:ss')
                      let err;
                      // bar.start(tot_mem, 0)
                      f1: for (let i = 0; i < tot_mem; i++) {
                        await new Promise(innRes => {
                          connection.query(
                            `select 
                              im.* 
                            from info_var_m as im
                            where im.wallet>0 and im.last_tranf_pend_at < '${cronjob_pend_at}'
                            limit 1
                            offset ${i}`,
                            async function (error, result) {
                              if (error) {
                                err = error
                                return innRes()
                              } else {
                                if (result.length > 0) {
                                  let mem_id = result[0].member_id
                                  let wallet = result[0].wallet ? parseInt(result[0].wallet) : 0
                                  let pending = result[0].pending ? parseInt(result[0].pending) : 0
                                  let last_pend_trans_limit = result[0].last_pend_trans_limit ? parseInt(result[0].last_pend_trans_limit) : 0
                                  last_pend_trans_limit += 500

                                  const deduct_w = wallet >= last_pend_trans_limit ? last_pend_trans_limit : wallet
                                  wallet -= deduct_w
                                  pending += deduct_w

                                  connection.query(
                                    `update info_var_m set ? where member_id=${mem_id}`, {
                                      wallet,
                                      pending,
                                      last_tranf_pend_at: init_time,
                                      last_pend_trans_limit
                                    },
                                    (error) => {
                                      // bar.update(i + 1)
                                      if (error) err = error
                                      return innRes()
                                    }
                                  )
                                } else {
                                  return innRes()
                                }
                              }
                            })
                        })
                        if (err) break f1;
                      }
                      // bar.stop()
                      if (err) {
                        err_cb(err)
                      }
                      resolve_q()
                    }
                  }
                )
              },
              error => {
                if (error) {
                  console.log(error)
                  jobs_errors = error
                } else {
                  console.log("Successfully loop pending job done:", pend_mem)
                  init_avlb_job_done = true
                }
                return resolve()
              })
          }
        })
      })
    }

    if (!jobs_errors) {
      pend_job()
    } else {
      throw new Error("Error: " + jobs_errors)
    }

  }, 1000 * 60) // 1000 * 60 * 5  = 5 minutes
}

async function avlb_job() {
  setTimeout(async function () {
    if (init_avlb_job_done) {
      let cronjob_avlb_at = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss') // diffrence in 1 min but change to 24 hours for available
      let avlb_mem = 0
      await new Promise(resolve => {
        db.getConnection(async function (err, connection) {
          if (err) {
            console.log(err)
            jobs_errors = err
            return resolve()
          } else {
            db_util.connectTrans(connection,
              (resolve_q, err_cb) => {
                connection.query(
                  `select 
                    count(*) as tot 
                  from info_var_m as im
                  where im.pending>0 and im.has_avlb_at < '${cronjob_avlb_at}'`,
                  async function (error, result) {
                    if (error) {
                      err_cb(error)
                    } else {
                      let tot_mem = result.length > 0 ? result[0].tot : 0
                      avlb_mem = tot_mem
                      // console.log("total selected members:", tot_mem)
                      const init_time = moment().format('YYYY-MM-DD HH:mm:ss')
                      let err;
                      // bar.start(tot_mem, 0)
                      f1: for (let i = 0; i < tot_mem; i++) {
                        await new Promise(innRes => {
                          connection.query(
                            `select 
                              im.* 
                            from info_var_m as im
                            where im.pending>0 and im.has_avlb_at < '${cronjob_avlb_at}'
                            limit 1
                            offset ${i}`,
                            async function (error, result) {
                              if (error) {
                                err = error
                                return innRes()
                              } else {
                                if (result.length > 0) {
                                  let mem_id = result[0].member_id
                                  let available = result[0].available ? parseInt(result[0].available) : 0
                                  let pending = result[0].pending ? parseInt(result[0].pending) : 0
                                  let max_trans_limit = result[0].max_trans_limit ? parseInt(result[0].max_trans_limit) : 0

                                  const deduct_w = pending >= max_trans_limit ? max_trans_limit : pending
                                  pending -= deduct_w
                                  available += deduct_w

                                  connection.query(
                                    `update info_var_m set ? where member_id=${mem_id}`, {
                                      pending,
                                      available,
                                      has_avlb_at: null
                                    },
                                    (error) => {
                                      // bar.update(i + 1)
                                      if (error) err = error
                                      return innRes()
                                    }
                                  )
                                } else {
                                  return innRes()
                                }
                              }
                            })
                        })
                        if (err) break f1;
                      }
                      // bar.stop()
                      if (err) {
                        err_cb(err)
                      }
                      resolve_q()
                    }
                  }
                )
              },
              error => {
                if (error) {
                  console.log(error)
                  jobs_errors = error
                } else {
                  console.log("Successfully loop available job done: ", avlb_mem)
                }
                return resolve()
              })
          }
        })
      })
    }

    if (!jobs_errors) {
      avlb_job()
    } else {
      throw new Error("Error: " + jobs_errors)
    }

  }, 1000 * 60) // 1000 * 60 * 5  = 5 minutes
}