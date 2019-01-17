const express = require('express')
const router = express.Router()
const moment = require('moment')
// const _ = require('lodash')

const db = require('../db.js')
// const db_util = require('../func/db-util.js')

router.use(function (req, res, next) {
    if (req.decoded.data.type === 0) {
        return next()
    } else {
        return res.json({
            status: false,
            message: "Not permission on this request."
        })
    }
})


router.get('/sale-list', function (req, res) {
    db.getConnection(async function (err, connection) {
        if (err) {
            res.status(500).json({
                err
            })
        } else {
            let offset = 0,
                limit = 9,
                search = ""

            if (req.query.page && /^[0-9]*$/.test(req.query.page)) {
                offset = (parseInt(req.query.page) - 1) * limit
            }

            if (req.query.search) {
                search = req.query.search
            }

            connection.query(
                `select 
                count(distinct asnr_fr.fr_id) as tot_rows
                from assign_role_fr as asnr_fr
                            
                join franchises as fr
                on asnr_fr.fr_id = fr.id
                
                join (
                    select 
                        crzb_l.id as crzb_id,
                        get_crzb_with_p_name(crzb_l.id) as crzb_name
                    from crzb_list as crzb_l
                ) as crzb_var
                on fr.branch_id = crzb_var.crzb_id
                
                where asnr_fr.member_id =${req.decoded.data.user_id}`,
                function (error, result) {
                    if (error) {
                        connection.release()
                        res.status(500).json({
                            error
                        })
                    } else {
                        if (result.length < 1) {
                            connection.release()
                            return res.json({
                                data: [],
                                tot_rows: 0
                            })
                        }
                        let tot_rows = result[0].tot_rows
                        let date = moment()
                        let gen_start_month = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                            gen_end_month = date.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                            gen_start_year = date.clone().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
                            gen_end_year = date.clone().endOf('year').format('YYYY-MM-DD HH:mm:ss')
                        connection.query(
                            `select 
                                fr.name,
                                crzb_var.crzb_name,
                                get_fr_mem_sale(asnr_fr.fr_id, asnr_fr.member_id) as total_sale,
                                get_fr_mem_date_sale(asnr_fr.fr_id, asnr_fr.member_id, '${gen_start_month}', '${gen_end_month}') as total_month_sale,
                                get_fr_mem_date_sale(asnr_fr.fr_id, asnr_fr.member_id, '${gen_start_year}', '${gen_end_year}') as total_year_sale
                            from assign_role_fr as asnr_fr
                            
                            join franchises as fr
                            on asnr_fr.fr_id = fr.id
                            
                            join (
                                select 
                                    crzb_l.id as crzb_id,
                                    get_crzb_with_p_name(crzb_l.id) as crzb_name
                                from crzb_list as crzb_l
                            ) as crzb_var
                            on fr.branch_id = crzb_var.crzb_id
                            
                            where asnr_fr.member_id =${req.decoded.data.user_id}
                            group by asnr_fr.fr_id
                            order by total_sale desc, total_year_sale desc, total_month_sale desc
                            LIMIT ${limit}
                            OFFSET ${offset}`,
                            function (error, results) {
                                connection.release()
                                if (error) {
                                    res.status(500).json({
                                        error
                                    })
                                } else {
                                    res.json({
                                        data: results,
                                        tot_rows
                                    })
                                }
                            })
                    }
                })
        }
    })
})


module.exports = router