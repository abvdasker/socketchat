// this needs to be modularized. it's going to get unmanageable. Abstract away "actions"

var User = require('./users.js');
var ChatRoom = require('./chatrooms.js');
var Actions = require('./actions.js');
var Global = require('./global.js');

function ws_app(wss) {
  var i = 0;

  var test_name = "test_chat_room"
  Global.rooms[test_name] = new ChatRoom(test_name);
  
  wss.on('connection', function(ws) {
    console.log("new connection established");
    new_user = new User(ws, Global.currentId++);
    Global.users.push(new_user);
    Actions.broadcastRooms([new_user], Global.rooms);
    ws.on("message", messageReceived);
  });
  
}

function messageReceived(msg) {
  logMessage(msg);
  msg = JSON.parse(msg);
  
  user = Global.getUser(this);
  
  // need to add a time-based check to prevent any one user from sending message too frequently
  
  var action = msg.action;
  console.log("action: " + action);
  if (action == "setName") {
    Actions.setName(action, user, msg);
  } else if (action == "createRoom") {
    console.log("attempting to add a room");
    if (!roomNameExists(msg.roomName) && user.roomCount < 10) {
      Actions.createNewRoom(action, user, msg);
    } else {
      Actions.actionFailure(action, user, "room name "+msg.roomName+" already exists");
    }
  } else if (action == "deleteRoom") {
    console.log("attempting to delete a room");
    room = Global.rooms[msg.roomName];
    if (room.numUsers() == 0 && user.roomCount > 0) {
      Actions.deleteRoom(room, user);
    } else {
      Actions.actionFailure(action, user, "room name "+room.name+" is not empty");
    }
  } else if (action == "joinRoom") {
    Actions.joinRoom(action, user, msg);
  } else if (action == "leaveRoom") {
    
  } else if (action == "sendCoordinates") {
    Actions.sendCoordinates(msg);
  } else if (action == "sendToRoom") {
    console.log("trying to send to room");
    room = user.room;
    if (room != null && msg.text != null && msg.text != "") {
      Actions.sendMsgToRoom(room, user, msg);
    } else {
      Actions.actionFailure(action, user, "user "+user.username+" is not in a room");
    }
  } else {
    console.log("missed everything!");
  }
  
}

function logMessage(msg) {
  console.log(msg);
}

function roomNameExists(name) {
  if (Global.rooms[name] != null) {
    return true;
  }
  
  return false;
}

function addUserToRoom(room, user) {
  room.users.push(user);
  user.room = room;
}

module.exports = ws_app