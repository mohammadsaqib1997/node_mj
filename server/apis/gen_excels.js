const express = require('express')
const router = express.Router()
const _ = require('lodash')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.post("/export_member_info", function (req, res) {
    if (req.decoded.data.type > 0 && _.isObject(req.body) && !_.isEmpty(req.body)) {
        let file_name = (new Date()).getTime() + '.csv'
        const csvWriter = createCsvWriter({
            path: __dirname + '/../uploads/reports/' + file_name,
            header: ['name', 'value']
        });
        csvWriter.writeRecords(req.body)
            .then(() => {
                let file = __dirname + "/../uploads/reports/" + file_name
                res.download(file)
                setTimeout(function () {
                    fs.unlinkSync(__dirname + "/../uploads/reports/" + file_name)
                }, 60000)
            }).catch(err => {
                res.json({
                    status: false,
                    message: "Download error."
                })
            })

    } else {
        res.json({
            status: false,
            message: "Permission denied!"
        })
    }
})

module.exports = router