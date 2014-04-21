var currentId = 0;
var rooms = {};
var users = [];

function getUser(ws) {
  for (i in users) {
    if (users[i].ws == ws) {
      return users[i];
    }
  }
  
  return null;
}

function deleteUser(user) {
  console.log("id to delete: " +user.id)
  console.log("length: "+users.length);
  for (i in users) {
    console.log(users[i].id)
    if (users[i].id == user.id) {
      swapUsers(i, users.length-1);
      users.pop();
      console.log("length: "+users.length);
      return;
    }
  }
}

function swapUsers(i, j) {
  var t = users[i];
  users[i] = users[j];
  users[j] = t;
}

module.exports = {
  currentId : currentId,
  rooms : rooms,
  users : users,
  getUser : getUser,
  deleteUser : deleteUser
}