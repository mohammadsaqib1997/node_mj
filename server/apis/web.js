const express = require('express')
const router = express.Router()

const db = require('../db.js')

const secret = require("./../config").secret
const jwt = require('jsonwebtoken')

router.post('/tokenLogin', (req, res) => {
  const token = req.body.token || req.query.token
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({ status: false, message: err.message });
      } else {
        return res.json({ status: true, token: token });
      }
    });

  } else {
    return res.json({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({ status: false, message: err.message });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.post('/login', (req, res) => {
  db.getConnection(function (err, connection) {
    if (err) {
      sendDBError(res, err)
    } else {
      connection.query('SELECT * FROM `admins` where BINARY `email`=? and BINARY `password`=?', [req.body.email, req.body.password], function (error, results, fields) {
        connection.release();

        if (error) {
          sendDBError(res, error)
        } else {
          if (results.length === 1) {
            let token = jwt.sign({
              data: {
                email: results[0].email,
                user_id: results[0].id
              }
            }, secret, {
                expiresIn: "5 minutes"
              })
            res.json({
              status: true,
              login_token: token
            })
          } else {
            res.json({
              status: false,
              message: "Invalid Credentials!"
            })
          }
        }
      });
    }
  })

})

module.exports = router

function sendDBError (res, err) {
  res.status(500).json({
    success: false,
    message: "DB Error: "+err.message
  })
}