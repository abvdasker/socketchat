console.log("loaded client js");

var me = null;
var rooms;
var myRoom;

function saveUsername() {
  var $un_input = $("#username");
  var name = $un_input.val();
  
  if (me == null) {
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
  } else {
    
  }
}

function User(name) {
  this.username = name;
}