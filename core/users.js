function User(conn, name) {
  this.ws = conn;
  this.username = name;
  this.room = null;
  this.roomCount = 0;
  
  this.joinRoom = function(room) {
    this.room = room;
    room.addUser(this);
  }
  
  this.leaveRoom = function() {
    this.room.removeUser(this);
    this.room = null;
  }
  
  this.sendMsg = function(msg) {
    var msgStr = JSON.stringify(msg);
    this.ws.send(msgStr);
  }
}

module.exports = User;