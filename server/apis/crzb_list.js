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

router.get('/branch-load/:id', (req, res) => {
  if (req.params.id) {

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {

        connection.query(
          `SELECT ls_b.id, ls_b.name, ls_b.description, ls_b.parent_id,
            (SELECT concat(ls_z.name, ", ", ls_r.name, ", ", ls_c.name) as name 
              FROM crzb_list as ls_z
              join crzb_list as ls_r
              on ls_z.parent_id = ls_r.id
              join crzb_list as ls_c
              on ls_r.parent_id = ls_c.id
            where ls_z.id=ls_b.parent_id) as parent_name
          FROM crzb_list as ls_b where id=${req.params.id};`,
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

router.get('/branch-list', (req, res) => {
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
          FROM crzb_list as ls_b
          left join crzb_list as ls_z
          on ls_b.parent_id = ls_z.id
          left join crzb_list as ls_r
          on ls_z.parent_id = ls_r.id
          left join crzb_list as ls_c
          on ls_r.parent_id = ls_c.id
          where ls_b.name like '%${search}%' AND ls_b.type=3;`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `SELECT ls_b.id, ls_b.name, ls_b.description, ls_b.active, concat(ls_c.rd_id, "-", ls_r.rd_id, "-", ls_z.rd_id, "-", ls_b.rd_id) as code
                FROM crzb_list as ls_b
                left join crzb_list as ls_z
                on ls_b.parent_id = ls_z.id
                left join crzb_list as ls_r
                on ls_z.parent_id = ls_r.id
                left join crzb_list as ls_c
                on ls_r.parent_id = ls_c.id
                where ls_b.name like '%${search}%' AND ls_b.type=3
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
              FROM crzb_list as ls2
              join crzb_list as ls3
              on ls2.parent_id = ls3.id
            where ls2.id=ls1.parent_id) as parent_name
          FROM crzb_list as ls1 where ls1.id=${req.params.id}`,
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
          from crzb_list as ls1
          join crzb_list as ls2
          on ls1.parent_id = ls2.id
          join crzb_list as ls3
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
                from crzb_list as ls1
                join crzb_list as ls2
                on ls1.parent_id = ls2.id
                join crzb_list as ls3
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
              from crzb_list as ls1
              join crzb_list as ls2
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

router.get('/exist-check/:crzb_parent_id/:search', (req, res) => {
  if (req.params.search) {

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {

        connection.query(
          `SELECT list.id, list.name FROM crzb_list as list
          WHERE list.name='${req.params.search}' and list.parent_id=${req.params.crzb_parent_id}
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

router.get('/ac_search_zone/:search', (req, res) => {
  if (req.params.search) {

    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let sel_query = `SELECT CONCAT(l_z.name, ", ", l_r.name, ", ", l_c.name) as name, l_z.id FROM crzb_list as l_z`,
          join_b = ` join crzb_list as l_r
          on l_z.parent_id = l_r.id
          join crzb_list as l_c
          on l_r.parent_id = l_c.id`,
          where_b = ` where (l_z.name like '%${req.params.search}%' OR l_r.name like '%${req.params.search}%' OR l_c.name like '%${req.params.search}%') AND l_z.type=2`,
          limit_b = ` LIMIT 10`

        connection.query(sel_query + join_b + where_b + limit_b, function (error, result) {
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

router.get('/ac_search_list/:role/:search', (req, res) => {
  if (req.params.role && req.params.search) {

    if (/^(0|1|2|3)$/.test(req.params.role)) {
      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({
            err
          })
        } else {
          const role = req.params.role

          connection.query(
            `SELECT 
              crzb_var.crzb_name as name, 
              crzb_l.id 
            FROM crzb_list as crzb_l
            join (
              select 
                crzb_l.id,
                get_crzb_with_p_name(crzb_l.id) as crzb_name
              from crzb_list as crzb_l
            ) as crzb_var
            on crzb_l.id = crzb_var.id
            where 
              (crzb_var.crzb_name like '%${req.params.search}%') 
              AND crzb_l.type=${role}
              AND crzb_l.active=1
            ORDER BY crzb_l.id LIMIT 10`,
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
        message: "Invalid Parameters Values!"
      })
    }
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
          `SELECT rd_id FROM crzb_list where parent_id='${req.body.sel_cr_id}' order by id desc limit 1`,
          function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let name_char = (req.body.zone).charAt(0).toUpperCase()
              let last_rd_id = result.length > 0 ? result[0].rd_id : 'P01'
              let split_rd_id = last_rd_id.split("")
              split_rd_id.shift()
              let last_inc_rd_id = parseInt(split_rd_id.join("")) + 1
              let gen_rd_id = name_char + getIntRd(last_inc_rd_id, 2, "00")

              connection.query(
                `INSERT INTO crzb_list SET ?`, {
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
          `SELECT * FROM crzb_list WHERE id=${req.body.update_id}`,
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
                      `SELECT * FROM crzb_list where parent_id='${req.body.sel_cr_id}' order by id desc limit 1`,
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          let name_char = (req.body.zone).charAt(0).toUpperCase()
                          let last_rd_id = result.length > 0 ? result[0].rd_id : 'P00'
                          let split_rd_id = last_rd_id.split("")
                          split_rd_id.shift()
                          let last_inc_rd_id = parseInt(split_rd_id.join("")) + 1
                          gen_rd_id = name_char + getIntRd(last_inc_rd_id, 2, "00")
                        }
                        resp()
                      })
                  })
                }

                connection.query(
                  `UPDATE crzb_list SET ? WHERE id=${req.body.update_id}`, {
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
          `UPDATE crzb_list SET ? WHERE id=${req.body.tgl_id}`, {
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

router.post('/branch-added', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT * FROM crzb_list where parent_id='${req.body.sel_crzb_id}' order by rd_id desc limit 1`,
          function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let last_branch_inc_rd_id = result.length > 0 ? parseInt(result[0].rd_id) + 1 : 1
              let gen_rd_id = getIntRd(last_branch_inc_rd_id, 2, "00")

              connection.query(
                `INSERT INTO crzb_list SET ?`, {
                  name: req.body.branch,
                  description: req.body.branch_desc,
                  rd_id: gen_rd_id,
                  parent_id: req.body.sel_crzb_id,
                  type: 3
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

router.post('/branch-update', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let str_err = null
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT * FROM crzb_list WHERE id=${req.body.update_id}`,
          async function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              if (result.length > 0) {
                const old_data_row = result[0]
                let gen_rd_id = old_data_row.rd_id
                if (old_data_row.parent_id != req.body.sel_crzb_id) {
                  await new Promise(resp => {
                    connection.query(
                      `SELECT * FROM crzb_list where parent_id='${req.body.sel_crzb_id}' order by rd_id desc limit 1`,
                      function (error, result) {
                        if (error) {
                          err_cb(error)
                          resolve()
                        } else {
                          let last_branch_inc_rd_id = result.length > 0 ? parseInt(result[0].rd_id) + 1 : 1
                          gen_rd_id = getIntRd(last_branch_inc_rd_id, 2, "00")
                        }
                        resp()
                      })
                  })
                }

                connection.query(
                  `UPDATE crzb_list SET ? WHERE id=${req.body.update_id}`, {
                    name: req.body.branch,
                    description: req.body.branch_desc,
                    rd_id: gen_rd_id,
                    parent_id: req.body.sel_crzb_id,
                    type: 3
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

router.post('/tg-act-branch', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      let str_err = null
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `UPDATE crzb_list SET ? WHERE id=${req.body.del_id}`, {
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