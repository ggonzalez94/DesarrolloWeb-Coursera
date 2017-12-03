Meteor.methods({
    insertChat : function(newChat){
      if(this.userId){  //the user is looged in
        return Chats.insert(newChat);   //insert the new chat
      }
      else{
        console.log("Login first");
        return  //dont do anything
      }
    },

    updateChat : function(id,chat){
      var currentChat = Chats.findOne(id);
      var user1 = currentChat.user1Id;
      var user2 = currentChat.user2Id;
      if(this.userId && (this.userId == user1 || this.userId == user2)){  //the user is logged in and is part of this chat
        Chats.update(id,chat);    //update the chat
        return;
      }
      else{
        return;
      }
    }

})
