require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const query = req.body.cityName;
  const appID = process.env.APP_ID;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + appID;

  https.get(url, function(response){
  
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const tempMax = weatherData.main.temp_max;
      const tempMin = weatherData.main.temp_min;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = " http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.write('<html lang="en" dir="ltr"><head><meta charset="utf-8"><title>Weather Report</title><link rel="icon" href="images/cloudy.png"><link rel="stylesheet" href="CSS/final.css"></head><body><div class="container">');
      res.write('<img class="main-img" src=' + imageURL + '>');
      res.write('<div class="show">');
      res.write("<h1><u>" + query + "</u></h1>");
      res.write("<h3>Max. temp: " + tempMax + " °C </h3>");
      res.write("<h3>Min. temp: " + tempMin + " °C</h3>");
      res.write("<p>The weather is currently " + weatherDescription + ".</p>");
      res.write('</div></div></body></html>');
      res.send();
    });

  });
});

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
