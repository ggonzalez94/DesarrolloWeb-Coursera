Websites = new Mongo.Collection("websites");
Comment = new Mongo.Collection('comments');


if (Meteor.isClient) {

	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{ sort: { votes: -1 } });
		}
	});
	Template.detail.helpers({
	  webSite: function(){
			console.log(Session.get('currentUrl'));
	    return Session.get('currentUrl');
	  },
		comments: function () {
			var website = Session.get('currentUrl');
	    var comments = Comment.find({ website:website._id }, { sort: { createdAt: -1 } });
	    return comments;
	  },
	});
Template.website_item.helpers({
	showDownvote:function () {
		console.log(this);
		return this.votes > 0;
	}
});


	/////
	// template events
	/////

	Template.website_item.events({

		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			var website_id = this._id;
			var votes = this.votes + 1;
			Websites.update({_id:website_id}, {$set:{
				votes: votes
			}});
			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)

			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var website_id = this._id;
			var votes = this.votes - 1;
			Websites.update({_id:website_id}, {$set:{
				votes: votes
			}});

			return false;// prevent the button from reloading the page
		},
		"click .detail": function(event){
			console.log(this);
			Session.set('currentUrl',this);
			Router.go('/detail');
		}
	})
	Template.detail.events({
		'submit #commentForm': function() {
        event.preventDefault();
        comment();
    },
	});
	var comment = function() {
	    var website = Session.get('currentUrl');
			console.log(website);
	    var comment = {
	        website: website._id,
	        comment: $("#comment-box").val(),
					createdAt: new Date(),
					userId: Meteor.userId(),
					userName: Meteor.userName,
			}
			console.log(comment);
			Comment.insert(comment,
				function(error, res) {
					if (error) {
						console.log(error.message);
						throw new Meteor.Error(333, error.invalidKeys);
					}
					return res;
			});
	    $("#comment-box").val('');
	};
	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+url);

			//  put your website saving code in here!
			Websites.insert({
			title: event.target.title.value,
			url:url,
			description:event.target.description.value,
			votes:0,
			createdOn:new Date()
		});
			return false;// stop the form submit from reloading the page

		}
	});
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
				votes:0,
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
				votes:0,
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
				votes:0,
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
				votes:0,
    		createdOn:new Date()
    	});
    }
  });
}
