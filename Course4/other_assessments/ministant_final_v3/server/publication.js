
Meteor.publish("chats", function() {
  return Chats.find({$or:[
              {user1Id:this.userId},
              {user2Id:this.userId}
            ]});
});

Meteor.publish("userData", function () {
    return Meteor.users.find({}, {fields: {profile: 1}});
});