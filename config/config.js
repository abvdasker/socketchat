var bodyParser = require("body-parser");

exports.configure = function(express, app, fs) {
  
  //var app = connect();
  
  app.set('title', 'socket chat');

  app.set("views", __dirname +"/../views");
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.set('port', 8000);
  
  //app.use(express.cookieParser());
  //app.use(express.session({secret: '1bG5tTASD19bAPh8l'}));
  
  app.use(bodyParser());
  
  app.use('/public', express.static(__dirname+"/../public"));
  
  if ('development' == app.get('env')) {
    app.locals.pretty = true;
    app.set('domain', 'localhost');
  }
  
  if ('production' == app.get('env')) {
    app.engine('html', require('ejs').renderFile)
  }

  console.log("config loaded");
}