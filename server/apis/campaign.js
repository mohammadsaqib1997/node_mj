const express = require('express')
const router = express.Router()
const moment = require('moment')
const {
  DateTime
} = require('luxon')

const db = require('../db.js')
const db_util = require('../func/db-util.js')

router.get('/member-tot-ref', (req, res) => {
  if (req.decoded.data.type === 0) {
    db.getConnection(async function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {
        connection.query(
          `select total_ref
          from mem_in_campaign
          where
          member_id=${req.decoded.data.user_id} and campaign_id=1`,
          function (error, result) {
            connection.release()
            if (error) {
              res.status(500).json({
                error
              })
            } else {
              res.json({
                total: result.length ? result[0].total_ref: 0
              })
            }
          })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid User Type!"
    })
  }
})

router.get('/list-team-ref', (req, res) => {
  if (req.decoded.data.type === 0) {
    db.getConnection(async function (error, connection) {
      if (error) {
        res.status(500).json({
          error
        })
      } else {

        let offset = 0,
          limit = 9,
          search = ""

        if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
          offset = (parseInt(req.query.page) - 1) * limit
        }

        if (req.query.search) {
          search = req.query.search
        }
        connection.query(
          `select 
          count(*) as tot_rows
          from mem_in_campaign as mem_camp
                
          join members as m
          on mem_camp.member_id = m.id
          
          join members as team_m
          on m.user_asn_id = team_m.ref_user_asn_id
          
          join mem_in_campaign as team_mem_camp
          on team_m.id = team_mem_camp.member_id and team_mem_camp.campaign_id=1
          
          where mem_camp.member_id=${req.decoded.data.user_id} and mem_camp.campaign_id=1 and (
            team_m.user_asn_id like '%${search}%' or
            team_m.full_name like '%${search}%'
          )`,
          function (error, result) {
            if (error) {
              connection.release()
              res.status(500).json({
                error
              })
            } else {
              if (result.length < 1) {
                connection.release()
                return res.json({
                  data: [],
                  tot_rows: 0
                })
              }
              let tot_rows = result[0].tot_rows
              connection.query(
                `select team_m.user_asn_id as mj_id, team_m.full_name as mj_name, team_mem_camp.total_ref
      
                from mem_in_campaign as mem_camp
                
                join members as m
                on mem_camp.member_id = m.id
                
                join members as team_m
                on m.user_asn_id = team_m.ref_user_asn_id
                
                join mem_in_campaign as team_mem_camp
                on team_m.id = team_mem_camp.member_id and team_mem_camp.campaign_id=1
                
                where mem_camp.member_id=${req.decoded.data.user_id} and mem_camp.campaign_id=1 and (
                  team_m.user_asn_id like '%${search}%' or
                  team_m.full_name like '%${search}%'
                )
                LIMIT ${limit}
                OFFSET ${offset}`,
                function (error, result) {
                  connection.release()
                  if (error) {
                    res.status(500).json({
                      error
                    })
                  } else {
                    res.json({
                      data: result,
                      tot_rows
                    })
                  }
                }
              )
            }
          })
      }
    })
  } else {
    res.json({
      status: false,
      message: "Invalid User Type!"
    })
  }
})

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

router.post('/add', (req, res) => {
  db.getConnection(async function (error, connection) {
    if (error) {
      res.status(500).json({
        error
      })
    } else {
      let str_err = null
      db_util.connectTrans(connection, function (resolve, err_hdl) {
        req.body['start_date'] = moment(req.body['start_date']).format('YYYY-MM-DD HH:mm:ss')
        req.body['end_date'] = moment(req.body['end_date']).format('YYYY-MM-DD HH:mm:ss')
        let curr_date = DateTime.local().setZone("UTC+5").toFormat("yyyy-LL-dd HH:mm:ss")
        connection.query(
          `SELECT count(*) as \`rows\` FROM campaigns WHERE start_date<='${curr_date}' AND end_date>='${curr_date}'`,
          function (error, result) {
            if (error) {
              err_hdl(error)
              resolve()
            } else {
              if (result[0].rows > 0) {
                str_err = "Campaign already in Proccess."
                resolve()
              } else {
                connection.query(
                  `INSERT INTO campaigns SET ?`,
                  req.body,
                  function (error) {
                    if (error) {
                      err_hdl(error)
                    }
                    resolve()
                  }
                )
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
          if (str_err) {
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

module.exports = router