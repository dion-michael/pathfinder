const jwt = require('../helpers/jwt.js')
const User = require('../models/user.js')

module.exports = {
    authentication: function (req, res, next){
        let token = req.headers.access_token
        if(!token){
            throw {
                code: 401,
                message: 'You must login to access this endpoint'
            }
        } else {
            let decoded = jwt.verify(req.headers.access_token)
            User.findOne({
                email: decoded.email})
            .then((user) => {
                if (user){
                    req.decoded = decoded
                    next()
                } else {
                    throw {
                        code: 401,
                        message: 'User is not valid'
                    }
                }
            })
            .catch(next)  
        }
    }
}