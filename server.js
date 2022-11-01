const express = require('express') 
const https = require('https')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended:true})) // enabling extended can handle nested js object

app.get('/', function(req,res){ // catch clients get req and send html file on res
    res.sendFile(__dirname+'/index.html') // send wont work as it is a html file
})

app.post('/', function(req,res){ // handle post req sent from html form
    const city = req.body.cityName
    const units = 'metric'
    const appid = '2162e7026c81d7b497b23081bd0eae04'
    let url = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&units='+units+'&appid='+appid
    // fetching response api url
    https.get(url, function(response){ // req to fetch data from external server
        console.log(response.statusCode)
        response.on('data', function(data){ // on seeing data fire callback with data param
            // data is in json format
            // console.log(data);
            const weatherData = JSON.parse(data) // converting hex to js object
            // const city = weatherData.name
            // const country = weatherData.sys.country
            const temp = weatherData.main.temp // accessing specific data
            const desc = weatherData.weather[0].description
            const iconId = weatherData.weather[0].icon
            const iconUrl = "http://openweathermap.org/img/wn/"+iconId+"@2x.png" // obtained from weather.org site
            res.write("<h1>The temperature in "+ city +" is " +temp+" degrees celcius.</h1>")
            res.write("<h2>The weather is currently "+desc+"</h2>")
            res.write("<img src="+iconUrl+">") // JSON format
            res.send()
        })
    })
})


app.listen(3000, function(){
    console.log('Running on port 3000')
})