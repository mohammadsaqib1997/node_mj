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

router.get('/zone-load/:id', (req, res) => {
  if (req.params.id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT ls1.id, ls1.name, ls1.description, ls1.parent_id,
            (SELECT concat(ls2.name, ", ", ls3.name) as name 
              FROM crc_list as ls2
              join crc_list as ls3
              on ls2.parent_id = ls3.id
            where ls2.id=ls1.parent_id) as parent_name
          FROM crc_list as ls1 where ls1.id=${req.params.id}`,
          function (error, result) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                res.json({
                  result: result[0]
                })
              } else {
                res.json({
                  status: false,
                  result: {}
                })
              }
            }
          });
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }
})

router.get('/zone-list', (req, res) => {
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
        `select COUNT(*) as tot_rows from (
          select 
            ls1.name,
            concat(ls3.rd_id, "-", ls2.rd_id, "-", ls1.rd_id) as code 
          from crc_list as ls1
          join crc_list as ls2
          on ls1.parent_id = ls2.id
          join crc_list as ls3
          on ls2.parent_id = ls3.id
          where ls1.type=2
        ) as tbl1
        where (tbl1.name like '%${search}%' OR tbl1.code like '%${search}%')`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `select * from (
                select 
                  ls1.id, 
                  ls1.name,
                  ls1.description, 
                  ls1.active, 
                  concat(ls3.rd_id, "-", ls2.rd_id, "-", ls1.rd_id) as code 
                from crc_list as ls1
                join crc_list as ls2
                on ls1.parent_id = ls2.id
                join crc_list as ls3
                on ls2.parent_id = ls3.id
                where ls1.type=2
              ) as tbl1
              where (tbl1.name like '%${search}%' OR tbl1.code like '%${search}%')
              ORDER BY tbl1.id DESC
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

router.get('/exist-check/:cr_parent_id/:search', (req, res) => {
  if (req.params.search && /^[0-9]*$/.test(req.params.cr_parent_id)) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        connection.query(
          `SELECT list.id, list.name FROM crc_list as list
          WHERE list.name='${req.params.search}' and list.parent_id=${req.params.cr_parent_id}
          LIMIT 1`,
          function (error, result) {
            connection.release();
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              if (result.length > 0) {
                res.json({
                  count: 1
                })
              } else {
                res.json({
                  count: 0
                })
              }
            }
          });
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid Parameters!"
    })
  }
})

router.get('/ac_search_cr/:search', (req, res) => {
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
              concat(ls1.name, ', ', ls2.name) as name, ls1.id
              from crc_list as ls1
              join crc_list as ls2
              on ls1.parent_id = ls2.id
              where ls1.type=1
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

router.get('/ac_search_list/:type/:search', (req, res) => {
  if (req.params.search && /^(0|1|2)$/.test(req.params.type)) {
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
              from crc_list as ls1
              left join crc_list as ls2
              on ls1.parent_id = ls2.id
              left join crc_list as ls3
              on ls2.parent_id = ls3.id
              where ls1.type=${req.params.type} and ls1.active=1
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

router.post('/zone-add', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT rd_id FROM crc_list where parent_id='${req.body.sel_cr_id}' order by id desc limit 1`,
          function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let last_inc_rd_id = result.length > 0 ? parseInt(result[0].rd_id) + 1 : 1
              let gen_rd_id = getIntRd(last_inc_rd_id, 2, "00")

              connection.query(
                `INSERT INTO crc_list SET ?`, {
                  name: req.body.zone,
                  description: req.body.desc,
                  rd_id: gen_rd_id,
                  parent_id: req.body.sel_cr_id,
                  type: 2
                },
                function (error, result) {
                  if (error) {
                    err_cb(error)
                  }
                  resolve()
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

router.post('/zone-update', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let str_err = null
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT * FROM crc_list WHERE id=${req.body.update_id}`,
          async function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              if (result.length > 0) {
                const old_data_row = result[0]
                let gen_rd_id = old_data_row.rd_id
                if (old_data_row.parent_id != req.body.sel_cr_id) {
                  await new Promise(resp => {
                    connection.query(
                      `SELECT * FROM crc_list where parent_id='${req.body.sel_cr_id}' order by id desc limit 1`,
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          let last_inc_rd_id = result.length > 0 ? parseInt(result[0].rd_id) + 1 : 1
                          gen_rd_id = getIntRd(last_inc_rd_id, 2, "00")
                        }
                        resp()
                      })
                  })
                }

                connection.query(
                  `UPDATE crc_list SET ? WHERE id=${req.body.update_id}`, {
                    name: req.body.zone,
                    description: req.body.desc,
                    rd_id: gen_rd_id,
                    parent_id: req.body.sel_cr_id
                  },
                  function (error, result) {
                    if (error) {
                      err_cb(error)
                    }
                    resolve()
                  })

              } else {
                str_err = "Invalid Update ID!"
                resolve()
              }
            }
          }
        )
      }, function (error) {
        if (error) {
          res.status(500).json({
            error
          })
        } else {
          if (str_err !== null) {
            res.json({
              status: false,
              message: str_err
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
})

router.post('/tg-act-zone', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let str_err = null
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `UPDATE crc_list SET ? WHERE id=${req.body.tgl_id}`, {
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
          if (str_err) {
            res.json({
              message: str_err,
              status: false
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
})

module.exports = router

function getIntRd(numb_int, min_str, prep_str) {
  let new_val = numb_int.toString()
  new_val = (new_val.length < min_str) ? (prep_str + new_val).substr(-(min_str), min_str) : new_val

  return new_val
}