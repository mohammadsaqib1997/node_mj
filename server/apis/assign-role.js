const express = require('express')
const router = express.Router()

const db = require('../db.js')

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

router.get('/list', function (req, res) {
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
        FROM mj_supreme.assign_roles as as_role
        left join members as m
        on as_role.member_id = m.id
        left join crzb_list as crzb_l
        on as_role.crzb_id = crzb_l.id
        where m.full_name like '%${search}%' OR crzb_l.name like '%${search}%';`,
        function (error, result) {
          if (error) {
            connection.release()
            res.status(500).json({
              error
            })
          } else {
            let tot_rows = result[0].tot_rows

            connection.query(
              `SELECT as_role.*, m.full_name, crzb_l.name 
                FROM mj_supreme.assign_roles as as_role
                left join members as m
                on as_role.member_id = m.id
                left join crzb_list as crzb_l
                on as_role.crzb_id = crzb_l.id
                where m.full_name like '%${search}%' OR crzb_l.name like '%${search}%'
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

router.get('/exist-check/:crzb_id', (req, res) => {
  if (req.params.crzb_id) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({
          err
        })
      } else {
        let query = `SELECT member_id, crzb_id FROM \`assign_roles\` where \`crzb_id\`=${req.params.crzb_id}`
        if (req.query.mem_id) {
          query += ` OR member_id=${req.query.mem_id}`
        }
        connection.query(query, function (error, result) {
          connection.release();
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            if (result.length > 0) {
              res.json({
                count: 1,
                result: result[0]
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

router.post('/assign', function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({
        err
      })
    } else {
      connection.query(
        'INSERT INTO `assign_roles` SET ?', {
          member_id: req.body.mem_id,
          crzb_id: req.body.sel_crzb_id
        },
        function (error, results) {
          connection.release();
          if (error) {
            res.status(500).json({
              error
            })
          } else {
            res.json({
              status: true
            })
          }
        });
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
        `DELETE FROM assign_roles 
        WHERE id='${req.body.del_id}'`,
        async function (error, result) {
          connection.release();
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