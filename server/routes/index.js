const routes = require("express").Router()
const user = require("./user.js")
const trafi = require("./trafi.js")
const weather = require("./weather.js")

routes.use('/', user)
routes.use('/route', trafi)
routes.use('/weather', weather)

module.exports = routes