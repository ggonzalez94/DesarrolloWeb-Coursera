Meteor.methods({
  // adding new comments
  insertMessage:function(message){
    if (this.userId){// we have a user
      return Chats.insert(message);
    }
    return;
  },
  updateMessage: function(chat) {
    if (this.userId){// we have a user
      return Chats.update(chat._id, chat);
    }
    return;
  }
});
