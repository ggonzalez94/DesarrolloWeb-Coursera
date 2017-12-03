Meteor.methods({
  updateMessages: function (chatId, messages) {
    Chats.update(chatId, messages);
  },
  createChat: function (user1, user2) {
    if (!this.userId){
      throw new Meteor.Error("logged-out", "The user must be logged in to post a comment.");
    }

    // Check if users exist on the database
    if (Meteor.users.find({_id: user1}) && Meteor.users.find({_id: user2})) {
      console.log("Inserting a chat...")
      Chats.insert({user1Id:user1, user2Id:user2}, function(err, result){
        if (err) {return err;}
        else {
          console.log("Chat "+ result + " created!");
          return result;}
      });
    }
  }, //end of createChat
});