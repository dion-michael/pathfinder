const routes = require("express").Router()
const user = require("./user.js")

routes.use('/', user)



module.exports = routes