const express = require('express')
const router = express.Router()

const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
  if (req.decoded.data.type === 2) {
    return next()
  } else {
    return res.json({
      status: false,
      message: "Not permission on this request."
    })
  }
})

router.get('/franchise-list', (req, res) => {
  db.getConnection(async function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let offset = 0,
        limit = 10,
        search = ""

      if (/^10$|^20$|^50$|^100$/.test(req.query.limit)) {
        limit = req.query.limit
      }

      if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
        offset = (parseInt(req.query.page) - 1) * limit
      }

      if (req.query.search) {
        search = req.query.search
      }


      connection.query(
        `SELECT COUNT(*) as tot_rows 
          from franchises as f
                  
          join (
            select 
              crzb_l.id as inner_id,
                get_crzb_rd_code(crzb_l.id) as crzb_code,
              get_crzb_with_p_name(crzb_l.id) as crzb_name
            from crzb_list as crzb_l
          ) as crzb_var
          on f.branch_id = crzb_var.inner_id
          
          join (
            select
              f_l.id as uc_id,
                  concat('UC', (f_l.rd_id * 1)) as uc_code
            from franchises as f_l
          ) as uc_gen
          on f.id = uc_gen.uc_id
          
          where (
            uc_gen.uc_code like '%${search}%' or
              f.name like '%${search}%' or
            crzb_var.crzb_code collate utf8mb4_general_ci like '%${search}%' or
            crzb_var.crzb_name collate utf8mb4_general_ci like '%${search}%'
          )`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `select 
                  f.id, 
                  uc_gen.uc_code,
                  f.name, 
                  f.active,
                  crzb_var.crzb_code as branch_code,
                  crzb_var.crzb_name as branch
                    
                from franchises as f
                
                join (
                  select 
                    crzb_l.id as inner_id,
                      get_crzb_rd_code(crzb_l.id) as crzb_code,
                    get_crzb_with_p_name(crzb_l.id) as crzb_name
                  from crzb_list as crzb_l
                ) as crzb_var
                on f.branch_id = crzb_var.inner_id
                
                join (
                  select
                    f_l.id as uc_id,
                        concat('UC', (f_l.rd_id * 1)) as uc_code
                  from franchises as f_l
                ) as uc_gen
                on f.id = uc_gen.uc_id
                
                where (
                  uc_gen.uc_code like '%${search}%' or
                    f.name like '%${search}%' or
                  crzb_var.crzb_code collate utf8mb4_general_ci like '%${search}%' or
                  crzb_var.crzb_name collate utf8mb4_general_ci like '%${search}%'
                )
                ORDER BY id DESC
                LIMIT ${limit}
                OFFSET ${offset}`,
              function (error, results) {
                connection.release()
                if (error) {
                  res.status(500).json({
                    error
                  })
                } else {
                  res.json({
                    data: results,
                    tot_rows
                  })
                }
              })
          }
        })
    }
  })
})

router.post('/multi-add', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT * FROM franchises where branch_id=${req.body.b_id} order by rd_id desc limit 1`,
          async function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let b_id = req.body.b_id

              let inc_start = result.length > 0 ? parseInt(result[0].rd_id) : 0
              let err = null
              for (let name of req.body.names) {
                inc_start++
                let gen_rd_id = getIntRd(inc_start, 2, "00")
                await new Promise(res2 => {
                  connection.query(
                    `INSERT INTO franchises SET ?`, {
                      name,
                      rd_id: gen_rd_id,
                      branch_id: b_id
                    },
                    function (error, result) {
                      if (error) {
                        err = error
                      }
                      res2()
                    })
                })
                if (err) break
              }
              if (err) {
                err_cb(err)
              }
              resolve()
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

router.post('/tg-act-franchise', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `UPDATE franchises SET ? WHERE id=${req.body.del_id}`, {
            active: !req.body.sts
          },
          function (error, result) {
            if (error) {
              err_cb(error)
            }
            resolve()
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

module.exports = router

function getIntRd(numb_int, min_str, prep_str) {
  let new_val = numb_int.toString()
  new_val = (new_val.length < min_str) ? (prep_str + new_val).substr(-(min_str), min_str) : new_val

  return new_val
}