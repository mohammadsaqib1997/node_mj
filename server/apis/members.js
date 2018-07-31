const express = require('express')
const router = express.Router()


const db = require('../db.js')

router.get("/", function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      connection.query('SELECT `user_asn_id`,`email`,`full_name`,`active_sts` FROM `members`', function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ data: results })
        }

      });
    }
  })
})

router.get("/:id", function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      let options = {sql: `
      SELECT m.*, upd.buyer_pay_type, upd.buyer_qty_prd, upd.buyer_type, upd.product_id, upd.id
      FROM members AS m
      LEFT JOIN user_product_details as upd
      ON m.id=upd.member_id
      WHERE m.user_asn_id=?
      `, nestTables: true}

      connection.query(options, [req.params.id], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ data: results })
        }

      });
    }
  })
})

router.post('/emailCheck', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      connection.query('SELECT email FROM `members` where binary `email`=?', [req.body.email], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ count: results.length })
        }

      });
    }
  })

})

router.post('/mjIdCheck', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      connection.query('SELECT user_asn_id FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          res.json({ count: results.length })
        }

      });
    }
  })
})

router.post('/refIdCheck', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ error })
    } else {
      connection.query('SELECT user_asn_id, full_name FROM `members` where binary `user_asn_id`=?', [req.body.id], function (error, results, fields) {
        connection.release();

        if (error) {
          res.status(500).json({ error })
        } else {
          if (results.length > 0) {
            res.json({ status: true, user: results[0] })
          } else {
            res.json({ status: false, message: "Invalid referral id." })
          }
        }

      });
    }
  })
})

router.post('/add', function (req, res) {

  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ err })
    } else {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release()
          res.status(500).json({ err })
        } else {
          connection.query('INSERT INTO `members` SET ?', req.body.member_data, function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({ error })
              })
            } else {
              req.body.prd_data['member_id'] = results.insertId
              connection.query('INSERT INTO `user_product_details` SET ?', req.body.prd_data, function (error, results, fields) {
                if (error) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({ error })
                  })
                } else {
                  connection.commit(function (err) {
                    if (err) {
                      return connection.rollback(function () {
                        connection.release()
                        res.status(500).json({ err })
                      });
                    } else {
                      connection.release()
                      res.json({ status: true })
                    }
                  })
                }
              })
            }
          });
        }
      })

    }
  })

})

router.post('/update', function (req, res) {
  
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ err })
    } else {
      connection.beginTransaction(function (err) {
        if (err) {
          connection.release()
          res.status(500).json({ err })
        } else {
          connection.query('UPDATE `members` SET ? WHERE id=?', [req.body.member_data, req.body.update_id], function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                connection.release()
                res.status(500).json({ error })
              })
            } else {

              connection.query('SELECT id FROM user_product_details WHERE member_id=?', [req.body.update_id], function (error, results, fields) {
                if (error) {
                  return connection.rollback(function () {
                    connection.release()
                    res.status(500).json({ error })
                  })
                } else {
                  if(results.length > 0) {
                    connection.query('UPDATE `user_product_details` SET ? WHERE member_id=?', [req.body.prd_data, req.body.update_id], function (error, results, fields) {
                      if (error) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({ error })
                        })
                      } else {
                        connection.commit(function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({ err })
                            });
                          } else {
                            connection.release()
                            res.json({ status: true })
                          }
                        })
                      }
                    })
                  }else{
                    req.body.prd_data['member_id'] = req.body.update_id
                    connection.query('INSERT INTO `user_product_details` SET ?', req.body.prd_data, function (error, results, fields) {
                      if (error) {
                        return connection.rollback(function () {
                          connection.release()
                          res.status(500).json({ error })
                        })
                      } else {
                        connection.commit(function (err) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release()
                              res.status(500).json({ err })
                            });
                          } else {
                            connection.release()
                            res.json({ status: true })
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          });
        }
      })

    }
  })

})

module.exports = router
