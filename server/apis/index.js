const express = require('express')
const router = express.Router()

router.use("/web", require('./web.js'))

router.use("/member", require('./members.js'))
router.use("/moderator", require('./moderator.js'))
router.use("/admin", require('./admin.js'))

router.all("*", function (req, res) {
  res.status(403).json({ error: 'Invalid Request!' })
})

module.exports = router


