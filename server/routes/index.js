const routes = require("express").Router()
const user = require("./user.js")
const weather = require("./weather.js")

routes.use('/', user)
routes.use('/weather', weather)



module.exports = routes