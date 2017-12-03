
// start up script that creates some users for testing
// users have the username 'user1@test.com' .. 'user8@test.com'
// and the password test123 


  Meteor.startup(function () {
    if (!Meteor.users.findOne()){
    // array for customized users for startup
    var avatar_arr = ["bunny", "cat", "panda", "penguin"];
    for (var i=0;i<avatar_arr.length;i++){
      var email = avatar_arr[i]+"@test.com";
      var username = avatar_arr[i];
      // modify the avatar to iterate over four images
      var avatar = avatar_arr[i] +".png"
      console.log("creating a user with password 'test123' and username/ email: "+email);
      Meteor.users.insert({profile:{username:username, avatar:avatar}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
    }
  } 
});
