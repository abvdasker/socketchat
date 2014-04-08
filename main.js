var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: 8008});
var i = 0;
wss.on('connection', function(ws) {
  ws.on("message", function (msg) {
    console.log('Client: '+msg);
  });
  ws.send("Hello Client!");
  setInterval(function() {
    ws.send((i++).toString());
  }, 1000);
});

var express = require("express");
var app = express();
var fs = require("fs");

var config = require("./config/config.js");
config.configure(express, app, fs);

var routes = require("./core/routes.js");
routes.route(express, app);

app.listen(app.get('port'), function() {
  console.log("server started in "+process.env.NODE_ENV+" mode\nlistening on port "+app.get('port'));
});