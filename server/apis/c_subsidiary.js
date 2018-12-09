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

router.get("/subs_name/:id", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `SELECT name
        FROM c_subsidiary
        WHERE id=${req.params.id}`,
        function (error, result, fields) {
          connection.release();

          if (error) {
            res.status(500).json({
              error
            })
          } else {
            let name = ''
            if (result.length > 0) {
              name = result[0].name
            }
            res.json({
              name
            })
          }

        });
    }
  })
})

router.get("/list_controllers", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `SELECT c_s.id, c_s.code, c_s.name
        FROM c_subsidiary as c_s
        WHERE c_s.type=0`,
        function (error, result, fields) {
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

        });
    }
  })
})

router.get("/list", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `SELECT c_s.id, c_s.name, c_s2.name as p_name, c_s2.code as p_code
        FROM c_subsidiary as c_s
        LEFT JOIN c_subsidiary as c_s2
        ON c_s.parent_code = c_s2.code
        WHERE c_s.type=1
        ORDER BY c_s.id`,
        function (error, result, fields) {
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

        });
    }
  })
})

router.get("/subs/:search", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `SELECT id, name
        FROM c_subsidiary
        WHERE type=1 AND name LIKE '%${req.params.search}%'
        ORDER BY id LIMIT 10`,
        function (error, result, fields) {
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

        });
    }
  })
})

router.post("/add", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT code 
          FROM c_subsidiary 
          WHERE parent_code='${req.body.sel_control}' 
          ORDER BY code DESC LIMIT 1`,
          function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let new_inc = result.length > 0 ? (parseInt(result[0].code) + 1).toString() : '1'
              new_inc = (new_inc.length < 4) ? ("0000" + new_inc).substr(-4, 4) : new_inc

              connection.query(
                `INSERT INTO c_subsidiary SET ?`, {
                  code: new_inc,
                  name: req.body.subs_name,
                  type: 1,
                  parent_code: req.body.sel_control
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

router.post("/update", function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      db_util.connectTrans(connection, function (resolve, err_cb) {
        connection.query(
          `SELECT * 
          FROM c_subsidiary 
          WHERE id='${req.body.update_id}'`,
          async function (error, result) {
            if (error) {
              err_cb(error)
              resolve()
            } else {
              let p_code = result[0].parent_code
              let code = result[0].code
              if (p_code !== req.body.sel_control) {
                let thr_err = null
                await new Promise(resolve2 => {
                  connection.query(
                    `SELECT code 
                    FROM c_subsidiary 
                    WHERE parent_code='${req.body.sel_control}' 
                    ORDER BY code DESC LIMIT 1`,
                    function (error, result) {
                      if (error) {
                        thr_err = error
                        return resolve2()
                      } else {
                        let new_inc = result.length > 0 ? (parseInt(result[0].code) + 1).toString() : '1'
                        code = (new_inc.length < 4) ? ("0000" + new_inc).substr(-4, 4) : new_inc
                        return resolve2()
                      }
                    }
                  )
                })
                if (thr_err) {
                  err_cb(thr_err)
                  return resolve()
                }
              }

              connection.query(
                `UPDATE c_subsidiary SET ? WHERE id=?`, [{
                  code: code,
                  name: req.body.subs_name,
                  type: 1,
                  parent_code: req.body.sel_control
                }, req.body.update_id],
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

router.post('/delete', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        error
      })
    } else {
      connection.query(
        `DELETE FROM c_subsidiary WHERE id=?`,
        req.body.del_id,
        function (error, result) {
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
        }
      )
    }
  })
})


module.exports = router