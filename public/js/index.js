console.log("loaded client js");

var me = null;
var rooms;
var myRoom;

function saveUsername() {
  var $un_input = $("#username");
  var name = $un_input.val();
  if (name != null && name != "") {
    sendMessage({ 
      action : "setName",
      username : name
    });
  }
}

function postName(name, $un_input) {
  $.post("/newuser", {
    username : name
  }, function(data) {
    if (data) {
      me = new User(name);
      console.log(me.username);
      $un_input.hide();
      var $filled = $("#filled_username");
      $filled.text(me.username);
      $filled.css("display", "inline");
      $filled.show();
      $("button").attr("disabled", true);
    } else {
      console.log("failure");
    }
  });
}

function User(name) {
  this.username = name;
}

var socket = new WebSocket("ws://localhost:8008", ["soap"]);

socket.onopen = function() {
  sendMessage({
    action : "test",
    test : "Hello Server!"
  });
}

socket.onerror = function(error) {
  console.log("WebSocket Error " +error);
}

socket.onmessage = function(e) {
  console.log("Server: " + e.data);
  logMessage(e.data);
  var data = JSON.parse(e.data);
  
  if (data.action == "roomList") {
    setRooms(data.rooms);
  }
  //$("#messages").append("<div>Server: " + e.data+"</div>");
}

function sendMessage(msg) {
  socket.send(JSON.stringify(msg));
}

function logMessage(msg) {
  console.log(msg);
}

function setRooms(room_names) {
  console.log("updating room list");
  var $roomList = $("#chatrooms select");
  $roomList.empty();
  
  for (i in room_names) {
    console.log("room: "+room_names[i]);
    $roomList.append("<option value=\""+room_names[i]+"\">"+room_names[i]+"</option>");
  }
}

function addRoom() {
  var $rnInput = $("#roomName input");
  var roomName = $rnInput.val();
  $rnInput.val("");
  

  if (roomName != null && roomName != "") {
    sendMessage({
      action : "createRoom",
      roomName : roomName
    });
  }
}

function removeRoom() {
  var roomName = $("#chatrooms select").val();
  console.log("selected room for deletion: "+roomName);
  sendMessage({
    action : "deleteRoom",
    roomName : roomName
  });
}