const mysql = require("mysql")
const config = require('./config.js')

// live or local
const db =  mysql.createPool((config.dev === true) ? config.db.local: config.db.live)

module.exports = db
