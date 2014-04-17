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

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: 8008});

var ws_app = require("./core/ws_app.js");
ws_app(wss);