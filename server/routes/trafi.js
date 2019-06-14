const routes = require("express").Router()
const TrafiController = require("../controllers/trafi.js")

routes.post("/routes", TrafiController.routes)
routes.post("/locations", TrafiController.locations)
routes.post("/departures", TrafiController.departures)
routes.post("/stops-nearby", TrafiController.nearby)

module.exports = routes