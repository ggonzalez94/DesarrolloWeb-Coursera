Websites = new Mongo.Collection("websites");	//Collection for websites
//Using matteodem:easy-search package
WebsitesIndex = new EasySearch.Index({				//EasySearch index for filtering
    collection: Websites,
    fields: ['title','url','description'],
    engine: new EasySearch.Minimongo({
      sort: function () {
        return { up_vote: -1,createdOn: -1 };   //filter by most voted first
      }
    })
});

//Configure security for the site
Websites.allow({

	update:function(userId, doc){
		console.log("testing security on image update");
		return true; //Always allow users to update the DB
	},

	insert:function(userId, doc){
		console.log("testing security on image insert");
		if (Meteor.user()){// if user is logged in
			console.log("registered user");
			if(doc.url.length == 0 || doc.title.length == 0){
				return false;		//if the website url or tittle are empty dont let them insert
			}
			else {
				console.log("Apropiate format");
				return true;		//if all validation passed insert
			}
		}
		else {
			return false;
		}
	},

	remove:function(userId, doc){
		return true;
	}
})
//End of security configuration

if (Meteor.isClient) {
	//routes for my application
	Router.route('/', function () {
  this.layout('layout_home');	//use template layout_home to render multiple templates
	this.render('navbar_template', {to: 'navbar'});
  this.render('website_form', {to: 'form'});	//render template website_form
  this.render('website_list', {to: 'list'});	//render tempalte website_list
	});

	Router.route('/websites/:_id', function(){
    this.layout('layout_home');
    this.render('navbar_template', {to: 'navbar'});
    this.render('empty_template',{to: 'form'});
		this.render('details_page',{
      to:'list',
      data: function () {
        return Websites.findOne({_id: this.params._id});
      }
    });
	});

  Router.route('/search',function(){
    this.render('searchDisplay');
  });

	//helper for navbar_template
	Template.navbar_template.helpers({
		webindex: () => WebsitesIndex
	});


	// helper function that returns all available websites
	Template.website_list.helpers({
    webindex: () => WebsitesIndex
	});

	//helpers for website_item
	Template.website_item.helpers({
		createdOn: function(){
			return this.createdOn;
		},
		id_actual: function(){
			return this._id;
		}
	});

	Template.details_page.helpers({
		comments:function(){
			var id = this._id;
			return Websites.findOne({_id:id}).comments;
		}
	});

	//-------Events--------//
	//Events for website_item
	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			Websites.update({_id: website_id},{$inc: {up_vote: 1}}); //Increment vote field by one

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			Websites.update({_id: website_id},{$inc: {down_vote: 1}}); //Decrement vote field by one
			return false;// prevent the button from reloading the page
		}
	})

	//Events for website_form
	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;

			Session.set("title",title);
			Session.set("description",description);
			//HTTP request(call the server method to make get request)
			Meteor.call("getWebsiteData", url, function(error, results) {

				if (error){	//If the HTTP request fails try to insert what the user entered
					//Insert the website in the database
					Websites.insert({
					 	title:Session.get("title"),
					 	url:url,
					 	description:Session.get("description"),
					 	createdOn:new Date()
					 });
				}

				else{	//If HTTP request succeed
					var el = results.content;		//Take content as a string
					//Take the title doing some slicing on the HTML string el
					var title = el.slice(el.search("<title>"),el.search("</title>"));
					title = title.slice(title.search(">")+1);

					if(Session.get("title").length == 0){		//if the title entered is empty
						Session.set("title",title);	//set title to HTTP title request
					}

					//Same thing with descrption
					var description = el.slice(el.search("description"));
					description = description.slice(description.search("=")+2,description.search(">"));
					description = description.slice(0,-1);

					if(Session.get("description").length == 0){	//if description entered is empty
						Session.set("description",description);	//do same thing
					}

					console.log(Session.get("title"));
					console.log(Session.get("description"));
					//Insert the website in the database
					Websites.insert({
					 	title:Session.get("title"),
					 	url:url,
					 	description:Session.get("description"),
					 	createdOn:new Date()
					 });
				}

			})


			return false// stop the form submit from reloading the page
		}
	})

	//Events for detail page
	Template.details_page.events({
		"submit .js-save-comment-form":function(event){
			var id = this._id;
			var comment = event.target.comment.value;
			Websites.update({_id:id},{$push:{comments:comment}});
			return false;
		}
	})
}

//Server code
if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
		Meteor.methods({
    getWebsiteData: function (url) {
				console.log("Http request passed from the client");
        //this.unblock();
        return Meteor.http.call("GET", url, {"npmRequestOptions" : {"gzip" : true}});

    }
	});
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date()
    	});
    }
  });
}
