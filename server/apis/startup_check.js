const express = require('express')
const router = express.Router()

const db = require('../db.js')

router.get('/email-info', function (req, res) {
    res.json({
        data: req.decoded
    })
})

module.exports = router