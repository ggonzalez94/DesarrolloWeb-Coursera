
  
  ///
  // helper functions 
  /// 
  Template.available_user_list.helpers({
    users:function(){
      return Meteor.users.find();
    }
  })
 Template.available_user.helpers({
    getUsername:function(userId){
      user = Meteor.users.findOne({_id:userId});
      return user.profile.username;
    }, 
    isMyUser:function(userId){
      if (userId == Meteor.userId()){
        return true;
      }
      else {
        return false;
      }
    }
  })


  Template.chat_page.helpers({
    messages:function(){
      var chat = Chats.findOne({_id:Session.get("chatId")});
      return chat.messages;
    }, 
    other_user:function(){
      return ""
    },
    users: function(){
      var chat = Chats.findOne({_id:Session.get("chatId")});
      // console.log(chat.user1Id, chat.user2Id);
      var user1 = chat.user1Id;
      var user2 = chat.user2Id;
      // console.log(Meteor.users.findOne({_id:user1}).profile.username);

      console.log(Meteor.users.findOne({_id:user1}).profile.avatar);
      // return user information of those in the chat
      return {
        user1: Meteor.users.findOne({_id:user1}).profile.username,
        user1_img: Meteor.users.findOne({_id:user1}).profile.avatar,
        user2: Meteor.users.findOne({_id:user2}).profile.username,
        user2_img: Meteor.users.findOne({_id:user2}).profile.avatar
      }
    }
  })



///// EVENTS /////

 Template.chat_page.events({
  // this event fires when the user sends a message on the chat page
  'submit .js-send-chat':function(event){
    // stop the form from triggering a page reload
    event.preventDefault();
    // see if we can find a chat object in the database
    // to which we'll add the message
    var chat = Chats.findOne({_id:Session.get("chatId")});
    if (chat){// ok - we have a chat to use
      var msgs = chat.messages; // pull the messages property
      if (!msgs){// no messages yet, create a new array
        msgs = [];
      }
      // is a good idea to insert data straight from the form
      // (i.e. the user) into the database?? certainly not.
      // push adds the message to the end of the array
      msgs.push({user_avatar: Meteor.user().profile.avatar,
                username: Meteor.user().profile.username,
                text: event.target.chat.value,
                onDate: new Date()});
      // reset the form
      event.target.chat.value = "";
      // put the messages array onto the chat object
      chat.messages = msgs;
      // update the chat object in the database.
      Meteor.call("updateMessages", chat._id, chat);
    }
  }
 })


