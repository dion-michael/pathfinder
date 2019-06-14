const routes = require("express").Router()
const WeatherController = require("../controllers/weather.js")

routes.post("/", WeatherController.weather)

module.exports = routes