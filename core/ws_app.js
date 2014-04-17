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
      rooms : roomNames(rooms)
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
      /*user.sendMsg({
        action : action,
        success : true,
        roomName : newRoom.name
      });*/
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
    console.log("rlen: "+room.numUsers()+" ucnt: "+user.roomCount)
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
  } else if (action == "leaveRoom") {
    
  } else if (action == "sendToRoom") {
    
  } else {
    console.log("missed everything!");
  }
  
}

function broadcastRooms() {
  broadcast({
    action : "roomList",
    rooms : roomNames(rooms)
  });
}

function broadcast(msg) {
  for (i in users) {
    users[i].sendMsg(msg);
  }
}

function logMessage(msg) {
  console.log(msg);
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