const axios = require('axios')

let ax = axios.create({
    baseURL: 'http://api-ext.trafi.com',
})

class TrafiController{
    static routes(req, res, next){
        ax({
            method: "GET",
            url: `/routes?start_lat=${req.body.start_lat}&start_lng=${req.body.start_lng}&end_lat=${req.body.end_lat}&end_lng=${req.body.end_lng}&is_arrival=false&api_key=${process.env.TRAFI_KEY}`
        })
            .then(({data}) => {
                res.json(data)
            })
            .catch(next)
    }

    static locations(req, res, next){
        ax({
            method: "GET",
            url: `/locations?q=${req.body.q}&region=${req.body.region}&api_key=${process.env.TRAFI_KEY}`
        })
            .then(({data}) => {
                res.json(data)
            })
            .catch(next)
    }

    static departures(req, res, next){
        ax({
            method: "GET",
            url: `/departures?stop_id=${req.body.stop_id}&region=${req.body.region}&api_key=${process.env.TRAFI_KEY}`
        })
            .then(({data}) => {
                res.json(data)
            })
            .catch(next)
    }

    static nearby(req, res, next){
        ax({
            method: "GET",
            url: `/stops/nearby?lat=${req.body.lat}&lng=${req.body.lng}&api_key=${process.env.TRAFI_KEY}`
        })
            .then(({data}) => {
                res.json(data)
            })
            .catch(next)
    }
}

module.exports = TrafiController