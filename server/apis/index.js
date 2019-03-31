const express = require('express')
const router = express.Router()
const cors = require('cors')
const config = require('../config.js')
const jwt = require('jsonwebtoken')

let corsOptions = {
  optionsSuccessStatus: 200,
  origin: (config.dev) ? 'http://127.0.0.1:3000' : ['https://mj-supreme.com', 'https://www.mj-supreme.com']
}

router.use("/verify-token", cors(corsOptions), require('./verify-tokens.js'))
router.use("/web", cors(corsOptions), require('./web.js'))

router.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: false,
          message: err.message
        });
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

router.use("/hierarchy", cors(corsOptions), require('./hierarchy.js'))
router.use("/product", cors(corsOptions), require('./products.js'))
router.use("/member", cors(corsOptions), require('./members.js'))
router.use("/moderator", cors(corsOptions), require('./moderators.js'))
router.use("/admin", cors(corsOptions), require('./admin.js'))
router.use("/transaction", cors(corsOptions), require('./transactions.js'))
router.use("/bank-detail", cors(corsOptions), require('./bank-details.js'))
router.use("/commission", cors(corsOptions), require('./commissions.js'))
router.use("/profile", cors(corsOptions), require('./profiles.js'))
router.use("/receipt", cors(corsOptions), require('./receipts.js'))
router.use("/notification", cors(corsOptions), require('./notifications.js'))
router.use("/report", cors(corsOptions), require('./reports.js'))
router.use("/reward", cors(corsOptions), require('./rewards.js'))
router.use("/partner", cors(corsOptions), require('./partners.js'))
router.use("/startup", cors(corsOptions), require('./startup_check.js'))
router.use("/gen_excel", cors(corsOptions), require('./gen_excels.js'))
router.use("/email", cors(corsOptions), require('./emails.js'))
router.use("/c_subsidiary", cors(corsOptions), require('./c_subsidiary.js'))
router.use("/voucher", cors(corsOptions), require('./vouchers.js'))
router.use("/crzb-list", cors(corsOptions), require('./crzb_list.js'))
// router.use("/crct-list", cors(corsOptions), require('./crct_list.js'))
router.use("/assign-role", cors(corsOptions), require('./assign-role.js'))
router.use("/assign-role-trans", cors(corsOptions), require('./assign-role-trans.js'))
router.use("/company-hierarchy", cors(corsOptions), require('./company-hierarchy.js'))
router.use("/hod", cors(corsOptions), require('./hod.js'))
router.use("/franchise", cors(corsOptions), require('./franchise.js'))
router.use("/assign-role-fr", cors(corsOptions), require('./assign-role-fr.js'))
router.use("/assign-role-trans-fr", cors(corsOptions), require('./assign-role-trans-fr.js'))
router.use("/campaign", cors(corsOptions), require('./campaign.js'))
router.use("/nomination", cors(corsOptions), require('./nomination.js'))
router.use("/lucky-draw", cors(corsOptions), require('./lucky-draw.js'))

router.all("*", function (req, res) {
  res.status(403).json({
    error: 'Invalid Request!'
  })
})

module.exports = router