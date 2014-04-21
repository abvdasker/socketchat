var Global = require("./global.js")

function User(conn, id) {
  this.ws = conn;
  this.id = id;
  this.username = null;
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
    var that = this;
    this.ws.send(msgStr, failure);
    
    //automatically handles disconnected users by deleting them
    function failure(error) {
      if (typeof error != "undefined") {
        console.log(error);
        if (that.room != null) {
          that.room.removeUser(that);
        }
        Global.deleteUser(that);
      }
    }
  }
}

module.exports = User;