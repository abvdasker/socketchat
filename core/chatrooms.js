function ChatRoom(name, owner) {
  this.name = name;
  this.users = {};
  this.owner = owner;
  
  this.addUser = function(user) {
    this.users[user.username] = user;
  }
  
  this.removeUser = function(user) {
    delete this.users[user.username];
  }
  
  this.hasUser = function(user) {
    return this.users[user.username] != null;
  }
  
  this.numUsers = function() {
    return Object.keys(this.users).length;
  }
}

module.exports = ChatRoom;