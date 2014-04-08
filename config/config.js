exports.configure = function(express, app, fs) {
  console.log("config loaded");
  
  app.configure(function() {
    app.set('title', 'socket chat');

    app.set("views", __dirname +"/../views");
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
    app.set('port', 8000);
    
    app.use(express.cookieParser());
    app.use(express.session({secret: '1bG5tTASD19bAPh8l'}));
    
    app.use(express.bodyParser());
    
    app.use('/public', express.static(__dirname+"/../public"));
  });
  
  app.configure('development', function() {
    app.locals.pretty = true;
    app.set('domain', 'localhost');
  });
  
  app.configure('production', function() {
    app.engine('html', require('ejs').renderFile)
  });
  
}