const routes = require("express").Router()
const user = require("./user.js")
const trafi = require("./trafi.js")
<<<<<<< HEAD
const weather = require("./weather.js")

routes.use('/', user)
routes.use('/t', trafi)
routes.use('/weather', weather)
=======

routes.use('/', user)
routes.use('/t', trafi)

>>>>>>> 00941e9e1d663174a94a7e0b266a83e312c075f3

module.exports = routes