var User = require('./users.js');
var ChatRoom = require('./chatrooms.js');

var rooms = {};
var users = [];

var test_name = "test_chat_room"
rooms[test_name] = new ChatRoom(test_name);

var index = function(req, res) {
  res.render("index.jade", {
    rooms : rooms
  });
}

var newUser = function(req, res) {
  username = req.body.username;
  if (username.length > 0) {
    users.push(new User(username));
    res.json(true);
  } else {
    res.json(false);
  }
}

module.exports = {
  index : index,
  newUser : newUser
}