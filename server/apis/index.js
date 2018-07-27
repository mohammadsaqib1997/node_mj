const express = require('express')
const router = express.Router()
const cors = require('cors')

let whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://144.208.75.78:3000']
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback('Invalid CORS! '+origin)
    }
  }
}

router.use("/web", cors(corsOptions), require('./web.js'))

router.use("/member", cors(corsOptions), require('./members.js'))
router.use("/moderator", cors(corsOptions), require('./moderator.js'))
router.use("/admin", cors(corsOptions), require('./admin.js'))

router.all("*", function (req, res) {
  res.status(403).json({ error: 'Invalid Request!' })
})

module.exports = router


