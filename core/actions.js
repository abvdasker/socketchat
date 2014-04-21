var ChatRoom = require('./chatrooms.js');
var Global = require('./global.js');

function sendCoordinates(msg) {
  console.log("trying to send coordinates");
  broadcast(Global.users, {
    action : "receiveCoordinates",
    success : true,
    x : msg.x,
    y : msg.y
  })
}

function setName(action, user, msg) {
  console.log("attempting to set username");
  user.username = msg.username;
  user.sendMsg( {
    action : action,
    username : user.username, 
    success : true
  });
}

function createNewRoom(action, user, msg) {
  var newRoom = new ChatRoom(msg.roomName)
  Global.rooms[newRoom.name] = newRoom;
  user.roomCount++;
  broadcastRooms(Global.users, Global.rooms);
}

function deleteRoom(room, user) {
  delete Global.rooms[room.name];
  user.roomCount--;
  broadcastRooms(Global.users, Global.rooms);
}

function joinRoom(action, user, msg) {
  room = Global.rooms[msg.roomName];
  user.joinRoom(room);
  roomUsers = room.users;
  user.sendMsg({
    action : action,
    success : true,
    roomName : room.name
  });
}

function leaveRoom(action, user) {
  user.leaveRoom();
  user.sendMsg({
    action : action,
    success : true
  })
}

function sendMsgToRoom(room, user, msg) {
  broadcast(room.users, {
    action : "receiveFromRoom",
    success : true,
    text : msg.text,
    username : user.username,
    time : new Date().toLocaleTimeString()
  });
}

function actionFailure(action, user, reason) {
    user.sendMsg({
      action : action,
      success : false,
      reason : reason
    });
}

function broadcastRooms(some_users, rooms) {
  broadcast(some_users, {
    action : "roomList",
    rooms : roomNames(rooms),
    success : true
  });
}

//=== private functions below

function broadcast(some_users, msg) {
  for (i in some_users) {
    some_users[i].sendMsg(msg); // catch send failure and delete user!
  }
}

function roomNames(these_rooms) {
  var names = [];
  for (i in these_rooms) {
    names.push(these_rooms[i].name);
  }
  
  return names;
}

module.exports = {
  broadcastRooms : broadcastRooms,
  sendCoordinates : sendCoordinates,
  setName : setName,
  createNewRoom : createNewRoom,
  actionFailure : actionFailure,
  deleteRoom : deleteRoom,
  joinRoom : joinRoom,
  sendMsgToRoom : sendMsgToRoom,
  leaveRoom : leaveRoom
}