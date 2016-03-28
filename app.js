// Modules
var express = require('express');
var path = require('path');
var request = require('request');
// var suspend = require('suspend');
// var sleep = require('sleep');

// Create app
var app = express();
var port = 3000;

// Cores data
cores = {
  device1: 'core1',
};
var startTime;
var currentTime;
var durationTime;

// Token
access_token = '34563aafaa61cd157040c2618a9cd660a7fef656';

// Base address
address = 'https://api.particle.io/v1/devices/';

// Set views
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Serve files
app.get('/', function(req, res){
  res.sendFile('views/interface.html', { root: __dirname })
});

app.get('/automation.json', function(req, res){
  res.sendFile('automation.json', { root: __dirname })
});

// API access
app.get("/get", function(req, res){

  // Request options
  var options = {timeout: 4000, json: true};

    // Make request
    command = address + cores[req.query['core']] + req.query['command'] + '?access_token=' + access_token ;
    request(command, options, function (error, response, body) {
    if (!error){
      console.log(body);
      res.json(body);
    }
    else {
      console.log("Core offline");
      res.json({coreInfo: {connected: false}});
    }
  });
});

app.get("/post", function(req, res){

  // Command
  command = address + cores[req.query['core']] + req.query['command'];

  // Make request
  request(command,
    {headers: {'Content-type': 'application/x-www-form-urlencoded'},
      method: 'POST',
      json: true,
      body: "access_token=" + access_token + "&args=" + req.query['params'],
      timeout:1000}, function (error, response, body) {
    if (!error){
      console.log(body);
      res.json(body);
    }
    else {
      console.log("Core offline");
      res.json({coreInfo: {connected: false}});
    }
  });
});


// Start server
app.listen(port);
console.log("Listening on port " + port);


// function automation() {
//   var config = require('./automation.json');
//   console.log('firstcmd: ' + config.firstcmd);
//   console.log('secondcmd: ' + config.secondcmd);
// }
