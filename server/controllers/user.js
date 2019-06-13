const User = require("../models/user.js")
const regis = require('../helpers/bcrypt.js')
const jwt = require('../helpers/jwt.js')

class UserController{
    static register(req,res,next){
        let google = req.params.google
        let newUser = {
            email: req.body.email,
            password: req.body.password
        }
        User.create(newUser)
        .then((result) => {
            if(google){
                UserController.login(req,res,next)
            } else {
                res.status(201).json(result)
            }
        })
        .catch(next)
    }
    static login(req,res,next){
        let email = req.body.email
        let password = req.body.password
        User.findOne({
            email: email
        })
        .then((result) => {
            if (result){
                let check = regis.checkPassword(password, result.password)
                if (check == true){
                    let signUser = {
                        id: result._id,
                        email: result.email
                    }
                    let temp = jwt.sign(signUser)
                    let token = {
                        access_token: temp
                    }
                    res.status(200).json(token)
                } else {
                   throw {
                       code: 404,
                        message: 'Error: wrong email or password!'
                    }
                }
            } else {
                throw {
                    code: 404,
                    message: 'Error: wrong email or password!'
                }
            }
        })
        .catch(next)
    }
    static googleLogin(req,res,next){
        const {OAuth2Client} = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let googleToken = req.body.googleToken

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            console.log(payload)
            User.findOne({
                email: payload.email
            })
            .then((result) => {
                if (result){
                    let obj = {
                        id: result._id,
                        email: result.email
                    }
                    let temp = jwt.sign(obj)
                    let token = {
                        access_token: temp
                    }
                    res.status(200).json(token)
                } else {
                    req.body.email = payload.email
                    req.body.password = Math.floor(Math.random() * 9999999999) + 10000000
                    req.params.google = true
                    UserController.register(req,res,next)
                }

            })
            .catch(next)
          }
          verify()
          .catch(next);
    }
}

module.exports = UserController