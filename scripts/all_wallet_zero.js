const mysql = require("mysql")

const config = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'mj_supreme'
}

const db = mysql.createPool(config)

// call()

// async function call() {
//     return await new Promise(resolve => {
//         db.getConnection(async function (err, connection) {
//             if (err) {
//                 console.log(err)
//                 return resolve()
//             } else {
//                 connection.beginTransaction(async function (err) {
//                     if (err) {
//                         connection.release()
//                         console.log(err)
//                         return resolve()
//                     } else {
//                         let throw_error = null
//                         await new Promise(resolve_2 => {

//                             connection.query(`
//                                 SELECT m.user_asn_id, m.id, iv.wallet
//                                 FROM info_var_m as iv
//                                 LEFT JOIN members as m
//                                 ON iv.member_id = m.id
//                             `, async function (err, results) {
//                                     if (err) {
//                                         throw_error = err
//                                         return resolve_2()
//                                     } else {
//                                         if (results.length > 0) {
//                                             for (result in results) {
//                                                 let mem_wallet = result.wallet
//                                                 let mem_id = result.id
//                                                 let mem_asn_id = result.user_asn_id
//                                                 await new Promise(resolve_3 => {
//                                                     connection.query('UPDATE info_var_m SET ? WHERE member_id=?', [info_param, id], function (error, results, fields) {
//                                                         if (error) {
//                                                             throw_error = error
//                                                             return resolve_3()
//                                                         } else { }
//                                                     })
//                                                 })
//                                             }
//                                             if (throw_error) break
//                                         }
//                                         return resolve_2()
//                                     }
//                                 })


//                         })

//                         if (throw_error) {
//                             connection.rollback(function () {
//                                 connection.release()
//                                 console.log(throw_error)
//                                 return resolve()
//                             });
//                         } else {
//                             connection.commit(function (err) {
//                                 if (err) {
//                                     connection.rollback(function () {
//                                         connection.release()
//                                         console.log(err)
//                                         return resolve()
//                                     });
//                                 } else {
//                                     connection.release()
//                                     console.log("All Done")
//                                     return resolve()
//                                 }
//                             })
//                         }
//                     }
//                 })
//             }
//         })
//     })
// }