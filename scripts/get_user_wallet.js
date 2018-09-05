const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: __dirname + '/users_wallets.csv',
    header: [
        { id: 'user_asn_id', title: 'MJ ID' },
        { id: 'full_name', title: 'Name' },
        { id: 'wallet', title: 'Wallet' },
    ]
});
const mysql = require("mysql")
const _ = require('lodash')
const config = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'mj_supreme'
}

const db = mysql.createPool(config)

get_data()


async function get_data() {
    await new Promise(resolve => {
        db.getConnection(async function (err, connection) {
            if (err) {
                console.log(err)
                return resolve()
            } else {
                connection.query(`
                SELECT m.user_asn_id, m.full_name, iv.wallet
                FROM info_var_m as iv
                LEFT JOIN members as m
                ON iv.member_id = m.id
                `, function (err, result) {
                        connection.release()
                        if (err) {
                            console.log(err)
                            return resolve()
                        } else {
                            csvWriter.writeRecords(result)
                                .then(() => {
                                    return resolve()
                                }).catch(err => {
                                    console.log(err)
                                    return resolve()
                                });
                        }
                    })
            }
        })
    })
}
