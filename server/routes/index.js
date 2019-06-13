const routes = require("express").Router()
const user = require("./user.js")
const trafi = require("./trafi.js")

routes.use('/', user)
routes.use('/t', trafi)


module.exports = routes