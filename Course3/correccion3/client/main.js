// Routing config
Router.configure({
  layoutTemplate: "applicationLayout"
});

Router.route("/", function () {
  this.render("navbar", { to: "navbar"});
  this.render("home", { to: "main"});
});

Router.route("/site/:_id", function () {
  this.render("navbar", {
    to: "navbar"});
  this.render("site", {
    to: "main",
    data:function(){
      return Websites.findOne({_id:this.params._id});
    }
  });
});

// Accounts config
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

/////
// template helpers
/////

// helper function for body
Template.home.helpers({
  logedin:function(){
    if (Meteor.user()){
      return true;
    }
    else {
      return false;
    }
  },
  username:function(){
    if (Meteor.user()){
      return Meteor.user().username;
        //return Meteor.user().emails[0].address;
    }
    else {
      return "anonymous internet user";
    }
  }
});

// helper function that returns all available websites
Template.website_list.helpers({
  websites:function(){
    return Websites.find({}, {sort:{upVote: -1, createdOn:-1}});
  }
});

Template.site.helpers({
  comments:function(site_id){
    return SiteComments.find({siteId:site_id}, {sort:{createdOn:-1}});
  },
  displayComments:function(site_id){
    var commentCount
    commentCount = SiteComments.find({siteId:site_id}).count();
    //console.write(commentCount);
    if(commentCount > 0){
      return true;
    } else{
      return false;
    }
  }
});

Template.comment_item.helpers({
  username:function(createdBy_id){
    return Meteor.users.findOne(createdBy_id).username;
  }
});

/////
// template events
/////

Template.website_item.events({
  "click .js-upvote":function(event){

    if (Meteor.user()){
      var website_id = this._id;
      Websites.update({_id:website_id},
                    {$inc: {upVote: 1}});
    } else{
      alert("Please login to vote");
    }

    return false;// prevent the button from reloading the page
  },
  "click .js-downvote":function(event){

    if (Meteor.user()){
      var website_id = this._id;
      Websites.update({_id:website_id},
                    {$inc: {downVote: 1}});
    } else{
      alert("Please login to vote");
    }

    return false;// prevent the button from reloading the page
  }
})

Template.website_form.events({
  "click .js-toggle-website-form":function(event){
    $("#website_form").toggle('slow');
  },
  "submit .js-save-website-form":function(event){

    var site_url, site_title, site_descr;
    site_url = event.target.url.value;
    site_title = event.target.title.value;
    site_descr = event.target.description.value;

    if(site_url.trim().length ==  0){
      alert("Site ULR cannot be empty, please correct!");
      return false;
    }

    if(site_descr.trim().length ==  0){
      alert("Site Description cannot be empty, please correct!");
      return false;
    }

    // Save
     if (Meteor.user()){
         Websites.insert({
           url:site_url,
           title:site_title,
           description:site_descr,
           createdOn:new Date(),
           createdBy:Meteor.user()._id
         });
     }

     $("#website_form").toggle('slow');

     // Clean inputs
     event.target.url.value = "";
     event.target.title.value = "";
     event.target.description.value = "";

    return false;// stop the form submit from reloading the page
  }
});

Template.site.events({
  "click .js-toggle-comment-form":function(event){
    if (Meteor.user()){
      $("#comment_form").toggle('slow');
    } else {
      alert("Please login to add comments!");
    }
  },
  "submit .js-save-comment-form":function(event){

    var site_comment;
    site_comment = event.target.comment.value;

    // Save
     if (Meteor.user()){
         SiteComments.insert({
           comment:site_comment,
           siteId:this._id,
           createdOn:new Date(),
           createdBy:Meteor.user()._id
         });
     }

     $("#comment_form").toggle('slow');

     // Clean inputs
     event.target.comment.value = "";

    return false;// stop the form submit from reloading the page
  }
});
