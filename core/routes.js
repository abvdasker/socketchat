var handlers = require("./handlers.js");

exports.route = function(express, app) {

  app.get("/index|index.html", function(req, res) {
    res.redirect("/");
  });

  app.get("/", handlers.index);
  
  //app.post("/newuser", handlers.newUser);

}