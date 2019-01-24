const express = require('express')
const router = express.Router()
const moment = require('moment')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const _ = require('lodash')

const db = require('../db.js')

router.get('/member/:start/:end', function (req, res) {
  let start_at = moment(new Date(req.params.start)).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
    end_at = moment(new Date(req.params.end)).endOf('d').format('YYYY-MM-DD HH:mm:ss')
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query(
        `SELECT m.created_at, m.user_asn_id, m.full_name, m.ref_user_asn_id, m.email, m.cnic_num, m.contact_num, m.dob, m.address, get_crzbf_name_type(ifnull(mem_lk_fr.franchise_id, mem_lk_crzb.crzb_id), if(mem_lk_fr.franchise_id is null, 3, 4)) as fr_name, prd.name as prd_name, iv.level, iv.wallet
                FROM members as m
                LEFT JOIN info_var_m as iv
                ON m.id = iv.member_id
                left join user_product_details as u_prd
                on m.id = u_prd.member_id
                left join products as prd
                on u_prd.product_id = prd.id
                left join mem_link_franchise as mem_lk_fr
                on m.id = mem_lk_fr.member_id
                left join mem_link_crzb as mem_lk_crzb
                on m.id = mem_lk_crzb.member_id
                WHERE m.created_at >= '${start_at}' AND m.created_at <= '${end_at}'`,
        function (err, result) {
          connection.release()
          if (err) {
            res.status(500).json({
              err
            })
          } else {
            let file_name = (new Date()).getTime() + '.csv'
            const csvWriter = createCsvWriter({
              path: __dirname + '/../uploads/reports/' + file_name,
              header: [{
                  id: 'created_at',
                  title: 'Date'
                },
                {
                  id: 'user_asn_id',
                  title: 'MJ ID'
                },
                {
                  id: 'full_name',
                  title: 'Client Name'
                },
                {
                  id: 'ref_user_asn_id',
                  title: 'Refferal ID'
                },
                {
                  id: 'email',
                  title: 'Email ID'
                },
                {
                  id: 'cnic_num',
                  title: 'CNIC #'
                },
                {
                  id: 'contact_num',
                  title: 'Contact #'
                },
                {
                  id: 'dob',
                  title: 'D.O.B'
                },
                {
                  id: 'address',
                  title: 'Address'
                },
                {
                  id: 'fr_name',
                  title: 'Franchise Address'
                },
                {
                  id: 'prd_name',
                  title: 'Selected Product'
                },
                {
                  id: 'level',
                  title: 'Level'
                },
                {
                  id: 'wallet',
                  title: 'Wallet'
                }
              ]
            });

            let new_res = []
            for (row of result) {
              row['created_at'] = moment(new Date(row['created_at'])).format("DD-MMM-YYYY")
              if (row['dob']) {
                row['dob'] = moment(new Date(row['dob'])).format("DD-MMM-YYYY")
              }

              new_res.push(row)
            }

            csvWriter.writeRecords(new_res)
              .then(() => {
                let file = __dirname + "/../uploads/reports/" + file_name
                res.download(file)
              }).catch(err => {
                res.json({
                  status: false,
                  message: "Download error."
                })
              })

          }
        }
      )
    }
  })
})

router.get('/finance/:start/:end', function (req, res) {
  let start_at = moment(new Date(req.params.start)).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
    end_at = moment(new Date(req.params.end)).endOf('d').format('YYYY-MM-DD HH:mm:ss')
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {

      let throw_err = null,
        trans_tot_rows = 0,
        coms_tot_rows = 0

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows 
                    FROM transactions_comp 
                    WHERE created_at >= '${start_at}' AND created_at <= '${end_at}'`,
          function (err, result) {
            if (err) {
              throw_err = err
            } else {
              trans_tot_rows = result[0].tot_rows
            }
            return resolve()
          })
      })
      if (throw_err) {
        connection.release()
        return res.status(500).json({
          throw_err
        })
      }

      await new Promise(resolve => {
        connection.query(
          `SELECT COUNT(*) as tot_rows 
                    FROM commissions 
                    WHERE created_at >= '${start_at}' AND created_at <= '${end_at}'`,
          function (err, result) {
            if (err) {
              throw_err = err
            } else {
              coms_tot_rows = result[0].tot_rows
            }
            return resolve()
          })
      })
      if (throw_err) {
        connection.release()
        return res.status(500).json({
          throw_err
        })
      }

      let max_rows = coms_tot_rows > trans_tot_rows ? coms_tot_rows : trans_tot_rows,
        limit = 200,
        limit_inc = 0,
        loop_ind = 0,
        grab_offsets = [0],
        data = []

      for (offset of grab_offsets) {
        loop_ind++
        limit_inc += limit
        // next offset grab
        if (max_rows > limit_inc) {
          grab_offsets.push(loop_ind * limit)
        }

        if (offset < coms_tot_rows) {
          await new Promise(resolve => {
            connection.query(
              `SELECT trans_id as id, remarks, 
                            '0' as debit,
                            (CASE 
                                WHEN status=1 THEN amount
                                WHEN status=2 THEN amount
                                ELSE 0
                            END) as credit,
                            (CASE 
                                WHEN status=1 THEN 'Paid'
                                WHEN status=2 THEN 'Canceled'
                                ELSE 'UnPaid'
                            END) as status,
                            created_at, 'Paid Commission' as p_r
                            FROM commissions 
                            WHERE created_at >= '${start_at}' AND created_at <= '${end_at}'
                            LIMIT ${limit}
                            OFFSET ${offset}`,
              function (err, result) {
                if (err) {
                  throw_err = err
                } else {
                  data.push(result)
                }
                return resolve()
              }
            )
          })
        }
        if (throw_err) {
          break
        }

        if (offset < trans_tot_rows) {
          await new Promise(resolve => {
            connection.query(
              `SELECT *, 'Finance Details' as p_r
                            FROM transactions_comp 
                            WHERE created_at >= '${start_at}' AND created_at <= '${end_at}'
                            LIMIT ${limit}
                            OFFSET ${offset}`,
              function (err, result) {
                if (err) {
                  throw_err = err
                } else {
                  data.push(result)
                }
                return resolve()
              }
            )
          })
        }
        if (throw_err) {
          break
        }
      }

      if (throw_err) {
        connection.release()
        return res.status(500).json({
          throw_err
        })
      } else {
        connection.release()
        data = _.sortBy(_.flatten(data), ['created_at'])
        let tot_cr = 0,
          tot_dr = 0
        _.map(data, o => {
          tot_cr += parseInt(o.credit)
          tot_dr += parseInt(o.debit)
          o['created_at'] = moment(new Date(o['created_at'])).format("DD-MMM-YYYY hh:mm:ss")
          return o
        })

        let file_name = (new Date()).getTime() + '.csv'
        const csvWriter = createCsvWriter({
          path: __dirname + '/../uploads/reports/' + file_name,
          header: [{
              id: 'created_at',
              title: 'Date'
            },
            {
              id: 'id',
              title: 'ID'
            },
            {
              id: 'p_r',
              title: 'P/R'
            },
            {
              id: 'remarks',
              title: 'Description'
            },
            {
              id: 'status',
              title: 'Status'
            },
            {
              id: 'debit',
              title: 'Debit (DR)'
            },
            {
              id: 'credit',
              title: 'Credit (CR)'
            },
            {
              id: 'balance',
              title: ''
            }
          ]
        });

        data.push({
          remarks: 'Total',
          debit: tot_dr,
          credit: tot_cr,
          balance: tot_dr - tot_cr
        })

        csvWriter.writeRecords(data)
          .then(() => {
            let file = __dirname + "/../uploads/reports/" + file_name
            res.download(file)
          }).catch(err => {
            res.json({
              status: false,
              message: "Download error."
            })
          })
      }
    }
  })
})

router.get('/exp_vch_report/:start/:end/:type', function (req, res) {
  if (req.decoded.data.type === 2) {
    const start_at = moment(new Date(req.params.start)).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
      end_at = moment(new Date(req.params.end)).endOf('d').format('YYYY-MM-DD HH:mm:ss'),
      type = req.params.type;


    db.getConnection(async function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {

        let throw_err = null,
          max_rows = 0;

        await new Promise(resolve => {
          connection.query(
            `SELECT COUNT(*) as tot_rows 
                            FROM transactions_comp 
                            WHERE (created_at >= '${start_at}' AND created_at <= '${end_at}') AND type=${type}`,
            function (err, result) {
              if (err) {
                throw_err = err
              } else {
                max_rows = result[0].tot_rows
              }
              return resolve()
            })
        })
        if (throw_err) {
          connection.release()
          return res.status(500).json({
            throw_err
          })
        }

        let limit = 200,
          limit_inc = 0,
          loop_ind = 0,
          grab_offsets = [0],
          data = []

        for (offset of grab_offsets) {
          loop_ind++
          limit_inc += limit
          // next offset grab
          if (max_rows > limit_inc) {
            grab_offsets.push(loop_ind * limit)
          }

          if (offset < max_rows) {
            await new Promise(resolve => {
              connection.query(
                `SELECT *
                            FROM transactions_comp 
                            WHERE (created_at >= '${start_at}' AND created_at <= '${end_at}') AND type=${type}
                            LIMIT ${limit}
                            OFFSET ${offset}`,
                function (err, result) {
                  if (err) {
                    throw_err = err
                  } else {
                    data.push(result)
                  }
                  return resolve()
                }
              )
            })
          }
          if (throw_err) {
            break
          }
        }

        if (throw_err) {
          connection.release()
          return res.status(500).json({
            throw_err
          })
        } else {
          connection.release()
          data = _.sortBy(_.flatten(data), ['created_at'])
          let tot_cr = 0,
            tot_dr = 0
          _.map(data, o => {
            tot_cr += parseInt(o.credit)
            tot_dr += parseInt(o.debit)
            o['created_at'] = moment(new Date(o['created_at'])).format("DD-MMM-YYYY hh:mm:ss")
            delete o['type']
            return o
          })

          let file_name = (new Date()).getTime() + '.csv'
          const csvWriter = createCsvWriter({
            path: __dirname + '/../uploads/reports/' + file_name,
            header: [{
                id: 'created_at',
                title: 'Date'
              },
              {
                id: 'id',
                title: 'ID'
              },
              {
                id: 'remarks',
                title: 'Description'
              },
              {
                id: 'debit',
                title: 'Debit (DR)'
              },
              {
                id: 'credit',
                title: 'Credit (CR)'
              },
              {
                id: 'balance',
                title: ''
              }
            ]
          });

          data.push({
            remarks: 'Total',
            debit: tot_dr,
            credit: tot_cr,
            balance: tot_dr - tot_cr
          })

          csvWriter.writeRecords(data)
            .then(() => {
              let file = __dirname + "/../uploads/reports/" + file_name
              res.download(file)
            }).catch(err => {
              res.json({
                status: false,
                message: "Download error."
              })
            })
        }

      }
    })

  } else {
    res.json({
      status: false,
      message: "Permission denied!"
    })
  }
})

module.exports = router