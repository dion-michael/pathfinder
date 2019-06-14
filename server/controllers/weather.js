const axios = require("axios")
const axi = axios.create({
    baseURL: 'https://api.darksky.net/forecast/2255a738665a4dd328a6291ed9023cbf'

})

class WeatherController{

   static weather(req,res,next){
       console.log('masuk ')
       console.log(req.body)
        let both = req.body.both
        let coor = req.body.coor
        console.log(both)
        axi
        .get(`/${both}?units=si`)
         .then(({data}) => {
             console.log(data)
            res.status(200).json(data)
        })
        .catch(next)
   }
}

module.exports = WeatherController
