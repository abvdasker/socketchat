// this needs to be modularized. it's going to get unmanageable. Abstract away "actions"

var User = require('./users.js');
var ChatRoom = require('./chatrooms.js');

var rooms = {};
var users = [];

function ws_app(wss) {
  var i = 0;

  var test_name = "test_chat_room"
  rooms[test_name] = new ChatRoom(test_name);
  
  wss.on('connection', function(ws) {
    console.log("new connection established");
    new_user = new User(ws);
    users.push(new_user);
    new_user.sendMsg({
      action : "roomList",
      rooms : roomNames(rooms),
      success : true
    });
    ws.on("message", messageReceived);
  });
  
}

function roomNames(these_rooms) {
  var names = [];
  for (i in these_rooms) {
    names.push(these_rooms[i].name);
  }
  
  return names;
}

function messageReceived(msg) {
  logMessage(msg);
  msg = JSON.parse(msg);
  
  user = getUser(this);
  
  // need to add a time-based check to prevent any one user from sending message too frequently
  
  var action = msg.action;
  console.log("action: " + action);
  if (action == "setName") {
    console.log("attempting to set username");
    user.username = msg.username;
    user.sendMsg( {
      action : action,
      username : user.username, 
      success : true
    });
  } else if (action == "createRoom") {
    console.log("attempting to add a room");
    if (!roomNameExists(msg.roomName) && user.roomCount < 10) {
      var newRoom = new ChatRoom(msg.roomName)
      rooms[newRoom.name] = newRoom;
      user.roomCount++;
      broadcastRooms();
    } else {
      user.sendMsg({
        action : action,
        success : false,
        reason : "room name "+msg.roomName+" already exists"
      });
    }
  } else if (action == "deleteRoom") {
    console.log("attempting to delete a room");
    room = rooms[msg.roomName];
    if (room.numUsers() == 0 && user.roomCount > 0) {
      delete rooms[room.name];
      user.roomCount--;
      broadcastRooms();
    } else {
      user.sendMsg({
        action : action,
        success : false,
        reason : "room name "+room.name+" is not empty"
      });
    }
  } else if (action == "joinRoom") {
    room = rooms[msg.roomName];
    user.joinRoom(room);
    roomUsers = room.users;
    user.sendMsg({
      action : action,
      success : true,
      roomName : room.name
    });
  } else if (action == "leaveRoom") {
    
  } else if (action == "sendToRoom") {
    console.log("trying to send to room");
    room = user.room;
    console.log(room.name + " " + msg.text);
    if (room != null && msg.text != null && msg.text != "") {
      broadcast(room.users, {
        action : "receiveFromRoom",
        success : true,
        text : msg.text,
        username : user.username,
        time : new Date().toLocaleTimeString()
      });
    } else {
      user.sendMsg({
        action : action,
        success : false,
        reason : "user "+user.username+" is not in a room"
      });
    }
  } else {
    console.log("missed everything!");
  }
  
}

function broadcastRooms() {
  broadcast(users, {
    action : "roomList",
    rooms : roomNames(rooms),
    success : true
  });
}

function broadcast(some_users, msg) {
  for (i in some_users) {
    some_users[i].sendMsg(msg); // catch send failure and delete user!
  }
}

function logMessage(msg) {
  console.log(msg);
}

function getUserNames(some_users) {
  var ar = [];
  for (user in some_users) {
    ar.push(usr.username);
  }
  
  return ar;
}

function newRoom(name) {
  
}

function roomNameExists(name) {
  if (rooms[name] != null) {
    return true;
  }
  
  return false;
}

function addUserToRoom(room, user) {
  room.users.push(user);
  user.room = room;
}

function userExists(ws) {
  for (i in users) {
    if (users[i].ws == ws) {
      return true;
    }
  }
  
  return false;
}

function getUser(ws) {
  for (i in users) {
    if (users[i].ws == ws) {
      return users[i];
    }
  }
  
  return null;
}

module.exports = ws_app