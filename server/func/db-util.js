module.exports = {
    connectTrans: async function (connection, queryFunc, cb) {
        connection.beginTransaction(async function (error) {
            if (error) {
                connection.release()
                return cb(error)
            } else {
                let throw_error = null

                await new Promise(resolve => {
                    queryFunc(resolve, function (hdl_err) {
                        if (hdl_err) {
                            throw_error = hdl_err
                        }
                    })
                })

                if (throw_error) {
                    return connection.rollback(function () {
                        connection.release()
                        cb(throw_error)
                    })
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release()
                                cb(err)
                            });
                        } else {
                            connection.release()
                            cb(null)
                        }
                    })
                }
            }
        })
    }
}