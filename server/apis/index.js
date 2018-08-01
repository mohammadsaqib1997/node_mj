const express = require('express')
const router = express.Router()
const cors = require('cors')
const config = require('../config.js')

let corsOptions = {
  optionsSuccessStatus: 200,
  origin: (config.dev) ? 'http://127.0.0.1:3000' : 'http://144.208.75.78:3000'
}

router.use("/web", cors(corsOptions), require('./web.js'))

router.use("/product", cors(corsOptions), require('./products.js'))
router.use("/member", cors(corsOptions), require('./members.js'))
router.use("/moderator", cors(corsOptions), require('./moderator.js'))
router.use("/admin", cors(corsOptions), require('./admin.js'))

router.all("*", function (req, res) {
  res.status(403).json({ error: 'Invalid Request!' })
})

module.exports = router


