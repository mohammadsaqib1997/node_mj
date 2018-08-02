const express = require('express')
const router = express.Router()
const cors = require('cors')
const config = require('../config.js')
const jwt = require('jsonwebtoken')

let corsOptions = {
  optionsSuccessStatus: 200,
  origin: (config.dev) ? 'http://127.0.0.1:3000' : 'http://144.208.75.78:3000'
}

router.use("/web", cors(corsOptions), require('./web.js'))

router.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(403).json({ status: false, message: err.message });
      } else {
        req.decoded = decoded;
        // res.json(decoded)
        next();
      }
    });

  } else {
    return res.status(403).json({
      status: false,
      message: 'No token provided.'
    });
  }
})

router.use("/product", cors(corsOptions), require('./products.js'))
router.use("/member", cors(corsOptions), require('./members.js'))
router.use("/moderator", cors(corsOptions), require('./moderators.js'))
router.use("/admin", cors(corsOptions), require('./admin.js'))

router.all("*", function (req, res) {
  res.status(403).json({ error: 'Invalid Request!' })
})

module.exports = router


