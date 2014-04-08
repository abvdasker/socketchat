var io = require('socket.io');
io.listen(8008);


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