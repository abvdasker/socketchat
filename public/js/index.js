console.log("loaded client js");

var serverURL = "ws://localhost:8008"
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

var socket = new WebSocket(serverURL, ["soap"]);

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
  logMessage(e.data);
  var data = JSON.parse(e.data);
  
  if (data.success) {
    if (data.action == "roomList") {
      setRooms(data.rooms);
    } else if (data.action == "setName") {
      setUserName(data.username);
    } else if (data.action == "joinRoom") {
      setRoom(data.roomName);
    } else if (data.action == "leaveRoom") {
      setRoomName("");
      $("#joinRoom").removeAttr("disabled");
      $("#sendMessage").attr("disabled", "disabled");
    } else if (data.action == "receiveFromRoom") {
      addMessage(data);
    } else if (data.action == "receiveCoordinates") {
      makeBlip(data);
    } else {
      console.log("missed handlers");
    }
  }
  //$("#messages").append("<div>Server: " + e.data+"</div>");
}

function makeBlip(data) {
  var $body = $("body");
  var $blip = $("<div class='blip'></div>");
  
  //alert("x: "+data.x+" y: "+data.y);
  var $dcmt = $(document);
  var clientWidth = $dcmt.width();
  var clientHeight = $dcmt.height();
  
  $blip.css({
    "left" : data.x*clientWidth,
    "top" : data.y*clientHeight
  })
  $body.append($blip);
}

$('html').click(sendCoordinates);

function sendCoordinates(ev) {
  var $dcmt = $(document);
  var x = ev.clientX + $dcmt.scrollLeft() - 7;
  var y = ev.clientY + $dcmt.scrollTop() - 7;
  
  //alert("x: "+x+" y: "+y);
  var clientWidth = $dcmt.width();
  var clientHeight = $dcmt.height();
  
  sendMessage({
    action : "sendCoordinates",
    x : x/clientWidth,
    y : y/clientHeight
  });
}

function addMessage(data) {
  var $new_msg = $(".message.template").clone();
  $new_msg.find(".msg_username").text(data.username);
  $new_msg.find(".msg_time").text(data.time);
  $new_msg.find(".msg_text").text(data.text);
  $new_msg.removeClass("template");
  $("#message_area").append($new_msg);
}

function setRoom(roomName) {
  $("#joinRoom").attr("disabled", "disabled");
  $("#sendMessage").removeAttr("disabled");
  setRoomName(roomName);
  $("#message_area").empty();
}

function setRoomName(roomName) {
  $("#roomName").text(roomName);
}

function setUserName(username) { 
  var $usnm = $("#filled_username");
  $usnm.text(username);
  $("#username").hide();
  $("#info button").hide();
  $usnm.addClass("inline");
  $("#joinRoom").removeAttr("disabled");
}

function sendMessage(msg) {
  socket.send(JSON.stringify(msg));
}

function logMessage(msg) {
  console.log("Server: " +msg);
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
  var $rnInput = $("#newRoomName");
  var roomName = $rnInput.val();
  $rnInput.val("");

  if (validName(roomName)) {
    sendMessage({
      action : "createRoom",
      roomName : roomName
    });
  }
}

function removeRoom() {
  var roomName = $("#chatrooms select").val();
  if (validName(roomName)) {
    console.log("selected room for deletion: "+roomName);
    sendMessage({
      action : "deleteRoom",
      roomName : roomName
    });
  }
}

function joinRoom() {
  var roomName = $("#chatrooms select").val();
  if (validName(roomName)) {
    console.log("attempting to join room "+roomName);
    sendMessage({
      action : "joinRoom",
      roomName : roomName
    });
  }
}

function sendToRoom() {
  var $input = $("#message_input textarea");
  var text = $input.val();
  if (validName(text)) {
    sendMessage({
      action : "sendToRoom",
      text : text
    });
  }
}

function validName(s) {
  return s != null && s != "";
}