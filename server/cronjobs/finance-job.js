const mysql = require("mysql")
const moment = require('moment')
const cTable = require('console.table')

const config = require('../config.js')

const db = mysql.createPool((config.dev === true) ? config.db.local : config.db.live)
const db_util = require('../func/db-util.js')
let job_inc = 0

call()

async function call() {
  job_inc++
  let job_dat = moment()
  console.log(`Serial:${job_inc} Job Start:`, job_dat.format('YYYY-MM-DD HH:mm:ss'))
  return await new Promise(resolve => {
    db.getConnection(async function (err, connection) {
      if (err) {
        console.log(err)
        return resolve()
      } else {
        let job_done = 0
        db_util.connectTrans(connection, async function (resolve_q, err_cb) {
            connection.query(
              `select
                trans.*,
                ifnull((select sum(debit*1) from transactions_m where member_id=trans.member_id and id<trans.id), 0) as old_debit,
                ifnull((select sum(credit*1) from transactions_m where member_id=trans.member_id and id<trans.id), 0) as old_credit
              from info_var_m as info_mem
              
              join (
                select
                  member_id,
                    sum((debit*1) - (credit*1)) as tot_bal
                from transactions_m
                group by member_id
              ) as tot_trans
              on info_mem.member_id = tot_trans.member_id and tot_trans.tot_bal > 0
                
              join transactions_m as trans
              on info_mem.member_id = trans.member_id and 
              (
                if(info_mem.last_p_tr_id is not null, info_mem.last_p_tr_id <= trans.id, false)
                  OR
                  if(
                  info_mem.last_p_tr_id is null,
                      if(info_mem.last_w_tr_id is not null, info_mem.last_w_tr_id <= trans.id, false),
                      false
                  )
                  OR
                if(
                  info_mem.last_p_tr_id is null and info_mem.last_w_tr_id is null, 
                  if(info_mem.last_a_tr_id is not null, info_mem.last_a_tr_id <= trans.id, (select id from transactions_m where member_id = info_mem.member_id order by id limit 1) <= trans.id), 
                  false)
              )

              order by trans.id
              limit 1`,
              async function (error, result) {
                if (error) {
                  err_cb(error)
                } else {
                  let rows = result.length > 0 ? result : [];
                  let err;

                  loop1: for (let row of rows) {
                    job_done++
                    let mem_id = row.member_id
                    let row_trans_id = row.id
                    let available = 0,
                      wallet = 0,
                      pending = 0,
                      last_w_tr_id = null,
                      last_p_tr_id = null,
                      last_a_tr_id = null,
                      tot_row_debit = parseInt(row.old_debit) + parseInt(row.debit),
                      tot_row_credit = parseInt(row.old_credit) + parseInt(row.credit)

                    let trans_date_diff = job_dat.diff(moment(new Date(row.created_at)), 'd')

                    if (trans_date_diff > 3 && trans_date_diff <= 18) {
                      pending += parseInt(row.debit)
                      last_p_tr_id = row_trans_id
                    } else if (trans_date_diff <= 3) {
                      wallet += parseInt(row.debit)
                      last_w_tr_id = row_trans_id
                    }

                    available = (tot_row_debit - tot_row_credit) - wallet - pending;
                    last_a_tr_id = row_trans_id

                    // if (last_p_tr_id !== null || last_w_tr_id !== null || final_bal === available) {
                    //   last_a_tr_id = null
                    // }

                    // console.table([{
                    //   'member id': mem_id,
                    //   'transaction id': row_trans_id,
                    //   'new wallet': wallet,
                    //   'new pending': pending,
                    //   'new available': available,
                    //   'row balance': (tot_row_debit - tot_row_credit)
                    // }])

                    // update new variables in member info
                    await new Promise(innRes1 => {
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
                          return innRes1()
                        }
                      )
                    })
                    if (err) break loop1; // check has previous query error

                    // check row if next exit to push them into rows
                    await new Promise(innRes1 => {
                      connection.query(
                        `select
                          trans.*,
                          ifnull((select sum(debit*1) from transactions_m where member_id=trans.member_id and id<trans.id), 0) as old_debit,
                          ifnull((select sum(credit*1) from transactions_m where member_id=trans.member_id and id<trans.id), 0) as old_credit
                        from info_var_m as info_mem

                        join (
                          select
                            member_id,
                              sum((debit*1) - (credit*1)) as tot_bal
                          from transactions_m
                          group by member_id
                        ) as tot_trans
                        on info_mem.member_id = tot_trans.member_id and tot_trans.tot_bal > 0
                          
                        join transactions_m as trans
                        on info_mem.member_id = trans.member_id and 
                        (
                          if(info_mem.last_p_tr_id is not null, info_mem.last_p_tr_id <= trans.id, false)
                            OR
                            if(
                            info_mem.last_p_tr_id is null,
                                if(info_mem.last_w_tr_id is not null, info_mem.last_w_tr_id <= trans.id, false),
                                false
                            )
                            OR
                          if(
                            info_mem.last_p_tr_id is null and info_mem.last_w_tr_id is null, 
                            if(info_mem.last_a_tr_id is not null, info_mem.last_a_tr_id <= trans.id, (select id from transactions_m where member_id = info_mem.member_id order by id limit 1) <= trans.id), 
                            false)
                        )

                        where trans.id > ${row_trans_id}

                        order by trans.id
                        limit 1`,
                        async function (error, result) {
                          if (error) {
                            err = error;
                          } else {
                            if (result.length > 0) {
                              rows.push(result[0])
                            }
                          }
                          return innRes1()
                        })
                    })
                    if (err) break loop1; // check has previous query error
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
              console.log(`Serial:${job_inc} Successfully job done ${job_done}. Job End:`, moment().format('YYYY-MM-DD HH:mm:ss'))
              setTimeout(call, 60000)
            }
            return resolve()
          })
      }
    })
  })
}