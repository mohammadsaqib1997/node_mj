const mysql = require("mysql")
const config = require('./config.js')

// live or local
const db =  mysql.createPool(config.db.local)

module.exports = db
