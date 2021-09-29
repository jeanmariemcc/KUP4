
	let pageUserId = "-Msdft87654";
	let pageUsername = "user12";

const app = Sammy("#container", function () {
	this.use("Handlebars", "hbs");

	// Home
function home(context) {console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
		context
			.loadPartials({
				headerOut: "./views/headerOut.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/home.hbs", function (details) {
					// console.log(details);
				});
			});
}
function eventshome(context){
	console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);

		fetch("https://events-473a6-default-rtdb.firebaseio.com/events.json")
		.then(function (response){
			// console.log(response);
			return response.json();
		})
		.then(function (data){
			let eventsArray = Object.entries(data);
			// console.log(eventsArray);
			eventsArray = eventsArray.map(function(innerArray){
				let [eventID,eventObject] = innerArray;
				eventObject.id = eventID;
				return eventObject;
			});
		context.events = eventsArray;
		// console.log(eventsArray);

		context
			.loadPartials({
				headerIn: "./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/allEvents.hbs", function (details) {
					// console.log(details);
				});
			});
		})
		.catch((err)=>{
			console.log(err);
		});
	}


	this.get("#/home", home);
	this.get("#/allEvents", eventshome);
	this.get('#/detailsEvent/:id', function (context) {
		console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
		context.id = this.params["id"];
		let parmId = this.params["id"];
		// let url = "'https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json'";
		fetch("https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json")
		.then(function (response){
			// console.log(response);
			return response.json();
		})
		.then(function (data){
			// console.log(data);
			// let eventsArray = Object.entries(data);
			// console.log(eventsArray);
			// eventsArray = eventsArray.map(function(innerArray){
			// 	let [eventID,eventObject] = innerArray;
			// 	eventObject.id = eventID;
			// 	return eventObject;
			// });

		// context.events = eventsArray;
		// context.data=data;
		context.dateTime = data.dateTime;
		context.description = data.description;
		context.imageURL = data.imageURL;
		context.name = data.name;
		context.organizer = data.organizer;
		context.peopleInterestedIn = data.peopleInterestedIn;
// do if here context.organizer== pageUsername
// then call details event 1 or 2   edit this
if(data.organizer == pageUsername){
	partialView = "./views/detailsEventOwner.hbs";
} else {
	partialView = "./views/detailsEvent.hbs";
}
		context
			.loadPartials({
				headerIn: "./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial(partialView, function (details) {
					// console.log(details);
				});
			});
		})
		.catch((err)=>{
			console.log(err);
		});
	});

	this.get('#/joinEvent/:id', function(context) {
		console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
		let parmId = this.params["id"];
		fetch("https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json")

		.then(function (response){
			// console.log(response);
			return response.json();
		})
		.then(function (data){
			// console.log(data);
			let numI = Number(data.peopleInterestedIn);
			numI++;
			let url = "https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json";
			let newdata = {
				"peopleInterestedIn": numI
			};
			let headers = {
				method: "PATCH",
				headers:{
					"Content-Type":"application/json",
				},
				body: JSON.stringify(newdata)
			};
			fetch(url,headers)
			.then(function(response){
				if(response.status ==200){
					console.log("patched!!");
					eventshome(context);
				}else{
					console.log(response.status);
				}
			})
			.catch((err)=>{
				console.log(err);
			});

		});
	});

	this.get('#/editEvent/:id', function(context) {

		let parmId = this.params["id"];
		fetch("https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json")

		.then(function (response){
			// console.log(response);
			return response.json();
		})
		.then(function (data){
			context.dateTime = data.dateTime;
			context.description = data.description;
			context.imageURL = data.imageURL;
			context.name = data.name;
			context.organizer = data.organizer;
			context.peopleInterestedIn = data.peopleInterestedIn;
		// })
		// .then(function(context){
			context
			.loadPartials({
				headerIn:"./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function(){
				this.partial("./views/editEvent.hbs", function(details){
					console.log(details);
				});
			});
		});
	});
	this.post('#/editEvent/:id',function (context){
		let data = {
			dateTime:this.params.dateTime,
			description:this.params.description,
			imageURL:this.params.imageURL,
			name:this.params.name
			};
			let parmId = this.params["id"];

			let url =  "https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json";
			let headers = {
				method: "PATCH",
				headers:{
					"Content-Type":"application/json",
				},
				body: JSON.stringify(data)
			};
			fetch(url,headers)
			.then(function(response){
				if(response.status ==200){
					console.log('created!!');
					eventshome(context);
				}else {
					console.log(response.status);
				}
			})
			.catch((err)=>{
				console.log(err);
			});
	
	});
	this.get('#/closeEvent/:id', function(context) {
		console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
		let parmId = this.params["id"];
		
		let url = "https://events-473a6-default-rtdb.firebaseio.com/events/" + parmId + ".json";
		let headers = {
			method: "DELETE"
		};
		fetch(url,headers)
		.then(function(response){
			if(response.status ==200){
				console.log('deleted!!');
				eventshome(context);
			}else {
				console.log(response.status);
			}
		})
		.catch((err)=>{
			console.log(err);
		});
	});		

	this.get('#/displayProfile', function (context) {
		console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
		// context.id = this.params["id"];
				// let user = {
				// loggedIn: "true",
				// id:"-msftnpq",
				// userid: "user1",
				// password: "passwd1",
				// imageURL: "./images/user.png",
				// orgOf: [{
				// 	id:"-MSfgjtjek",
				// 	name:"Birthday Party"
				// },
				// {
				// id:"-mklsdjfdkj2",
				// name:"Graduation Party",
				// }	
				// ],
				// 	};
				let parmId = pageUserId;
				console.log(`params id ${parmId}`);
				fetch("https://events-473a6-default-rtdb.firebaseio.com/users/" + parmId + ".json")
				.then(function (response){
					console.log(response);
					return response.json();
				})
				.then(function (data){
				// console.log(data);
		// let orgArray = user.orgOf;
		// if(user.orgOf.length>0){
		// 	context.orgnumber = user.orgOf.length;
		// } else 
		context.orgnumber = 0;
		// context.id = data.id;
		context.userid = data.userid;
		context.imageURL = "./images/user.png";
		// context.password = user.password;
// need to put in logic to see if user is an organizer
		context
			.loadPartials({
				headerIn: "./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/displayProfile.hbs", function (details) {
					// console.log(id);
				});
			});
		})
				.catch((err)=>{
					console.log(err);
			});
	});


	this.get("#/signinForm", function (context) {
		context
			.loadPartials({
				headerOut: "./views/headerOut.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/signinForm.hbs", function (details) {
					// console.log(details);
				});
			});
		console.log("login route");
	});
	this.post("#/signinForm", function (context) {
		//pulls in the login post information
		//then validates if the user can log in or not
		//if successful redirect to the profile page
        let username = this.params.username;
        let password = this.params.password;

        fetch("https://events-473a6-default-rtdb.firebaseio.com/users.json")
            .then(response=>{
                return response.json();
            })
            .then(users=>{
                let userArray = Object.entries(users);
                // console.log(users);
                let hasUser = userArray.find(user=>{
                    let [userID,userObj] = user;
					console.log(`user id key ${userID}`);
					console.log(`userObj ${userObj}`);
					console.log(`user ${user}`);

                    return userObj.userid == username;
                });

                if(hasUser!= undefined){
                    //check the password
                    document.getElementById("inputUsername").classList.remove("is-invalid");
                    if(hasUser[1].password == password){
                        //logged In!!!!
                        pageUserId = hasUser[0];
						pageUsername = hasUser[1].userid;
						console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
                        context.redirect('#/allEvents');
                    }else{
                        document.getElementById("inputPassword").classList.add("is-invalid");
                    }

                }else{
                    //send error to the front end
                    document.getElementById("inputUsername").classList.add("is-invalid");
                }

            })
            .catch(err=>{
                console.log(err);
            });

	});

	this.get("#/orgEvent", function (context) {
		context
			.loadPartials({
				headerIn: "./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/orgEvent.hbs", function (details) {
					// console.log(details);
				});
			});

	});
	this.post('#/orgEvent',function(context){
		// console.log('org form submitted');
		// console.log(this.params);
		let data = {
		dateTime:this.params.dateTime,
		description:this.params.description,
		imageURL:this.params.imageURL,
		name:this.params.name,
		peopleInterestedIn:0,
		organizer:pageUsername,
		
		};
		
		let url = "https://events-473a6-default-rtdb.firebaseio.com/events.json";
		let headers = {
			method: "POST",
			headers:{
				"Content-Type":"application/json",
			},
			body: JSON.stringify(data)
		};
		fetch(url,headers)
		.then(function(response){
			if(response.status ==200){
				console.log('created!!');
				eventshome(context);
			}else {
				console.log(response.status);
			}
		})
		.catch((err)=>{
			console.log(err);
		});
	});

	
	this.get("#/registerForm", function (context) {
		context
			.loadPartials({
				headerOut: "./views/headerOut.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/registerForm.hbs", function (details) {
					// console.log(details);
				});
			});

	});
	this.post('#/registerForm',function(context){
		// console.log('org form submitted');
		// console.log(this.params);
		let userFace = this.params.imageURL;
		if(this.params.password == this.params.rePassword){

		
		if(userFace==""){
			userFace = "./images/user.png";
		}
		let data = {
			loggedin:"true",
			userid:this.params.userid,
		imageURL:userFace,
		password:this.params.password,		
		};
		
		let url = "https://events-473a6-default-rtdb.firebaseio.com/users.json";
		let headers = {
			method: "POST",
			headers:{
				"Content-Type":"application/json",
			},
			body: JSON.stringify(data)
		};
		fetch(url,headers)
		.then(function(response){
			if(response.status ==200){
				console.log('user created!!');

				eventshome(context);
			}else {
				console.log(response.status);
			}
		})
		.catch((err)=>{
			console.log(err);
		});
	} // end of matching passwords if
	});
	this.get("#/logout",function(context){
		pageUserId = "";
		pageUsername = "";
		home(context);
	});
});
(() => {
	app.run("#/home");
})();
