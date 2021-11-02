// global variables to store who is logged in  id
let pageUserId = "";
let pageUsername = "";
let successbox = document.getElementById("successBox");
let loadingbox = document.getElementById("loadingBox");
let errorbox = document.getElementById("errorBox");
const app = Sammy("#container", function () {
	this.use("Handlebars", "hbs");

	// Home
	function home(context) {
		// console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
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
	function eventshome(context) {
		// empty one
		// let url = "https://unievents-1ff1a-default-rtdb.firebaseio.com/events.json";
		// populated
		let url =
			"https://events-473a6-default-rtdb.firebaseio.com/events.json";
		$.notify("Loading... ", {
			className: "info",
			// clickToHide: true,
			delay: 500,
			autoHide: true,
		});
		fetch(url)
			.then(function (response) {
				// console.log(response);
				return response.json();
			})
			.then(function (data) {
				let eventsArray = Object.entries(data);
				// console.log(eventsArray);
				eventsArray = eventsArray.map(function (innerArray) {
					let [eventID, eventObject] = innerArray;
					eventObject.id = eventID;
					return eventObject;
				});
				context.events = eventsArray;
				// console.log(eventsArray);
				context.pageUsername = pageUsername;
				context
					.loadPartials({
						headerIn: "./views/headerIn.hbs",
						footer: "./views/footer.hbs",
					})
					.then(function () {
						this.partial(
							"./views/allEvents.hbs",
							function (details) {
								// console.log(details);
							}
						);
					});
				// $("info").toggle("notify-hide");
			})
			.catch((err) => {
				console.log(err);
				context.pageUsername = pageUsername;
				context
					.loadPartials({
						headerIn: "./views/headerIn.hbs",
						footer: "./views/footer.hbs",
					})
					.then(function () {
						this.partial(
							"./views/four04.hbs",
							function (details) {}
						);
					});
			});
	}
	this.get("#/home", home);
	this.get("#/allEvents", eventshome);
	this.get("#/detailsEvent/:id", function (context) {
		// console.log(`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`);
		context.id = this.params["id"];
		let parmId = this.params["id"];
		$.notify("Loading", "info");
		fetch(
			"https://events-473a6-default-rtdb.firebaseio.com/events/" +
				parmId +
				".json"
		)
			.then(function (response) {
				// console.log(response);
				return response.json();
			})
			.then(function (data) {
				context.dateTime = data.dateTime;
				context.description = data.description;
				context.imageURL = data.imageURL;
				context.name = data.name;
				context.organizer = data.organizer;
				context.peopleInterestedIn = data.peopleInterestedIn;
				// do if here context.organizer== pageUsername
				// then call details event 1 or 2   edit this
				if (data.organizer == pageUsername) {
					partialView = "./views/detailsEventOwner.hbs";
				} else {
					partialView = "./views/detailsEvent.hbs";
				}
				context.pageUsername = pageUsername;
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
			.catch((err) => {
				console.log(err);
			});
	});

	this.get("#/joinEvent/:id", function (context) {
		let parmId = this.params["id"];
		$.notify("Loading", "info");
		fetch(
			"https://events-473a6-default-rtdb.firebaseio.com/events/" +
				parmId +
				".json"
		)
			.then(function (response) {
				// console.log(response);
				return response.json();
			})
			.then(function (data) {
				// console.log(data);
				let numI = Number(data.peopleInterestedIn);
				numI++;
				let url =
					"https://events-473a6-default-rtdb.firebaseio.com/events/" +
					parmId +
					".json";
				let newdata = {
					peopleInterestedIn: numI,
				};
				let headers = {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newdata),
				};
				fetch(url, headers)
					.then(function (response) {
						if (response.status == 200) {
							console.log("patched!!");
							$.notify(
								"You've joined the event successfully",
								"success"
							);
							eventshome(context);
						} else {
							console.log(response.status);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			});
	});

	this.get("#/editEvent/:id", function (context) {
		let parmId = this.params["id"];
		$.notify("Loading", "info");
		fetch(
			"https://events-473a6-default-rtdb.firebaseio.com/events/" +
				parmId +
				".json"
		)
			.then(function (response) {
				// console.log(response);
				return response.json();
			})
			.then(function (data) {
				context.dateTime = data.dateTime;
				context.description = data.description;
				context.imageURL = data.imageURL;
				context.name = data.name;
				context.organizer = data.organizer;
				context.peopleInterestedIn = data.peopleInterestedIn;
				context.id = parmId;

				context.pageUsername = pageUsername;
				// console.log(
				// 	`data.dateTime ${data.dateTime} context.name ${context.name}`
				// );
				context
					.loadPartials({
						headerIn: "./views/headerIn.hbs",
						footer: "./views/footer.hbs",
					})
					.then(function () {
						this.partial(
							"./views/editEvent.hbs",
							function (details) {
								// console.log(details);
							}
						);
					});
			});
	});
	this.post("#/editEvent/:id", function (context) {
		// console.log("line 207");

		// if (typeof this.params.dateTime != "string") {
		// 	$.notify(
		// 		"Date and time must be a string e.g Feb 24, 2022 or 24 Mar - 10pm",
		// 		"error"
		// 	);
		// 	return false;
		// }
		if (
			typeof this.params.description != "string" ||
			this.params.description.length < 10
		) {
			$.notify(
				"The description must be a string of at least 10 characters",
				{ className: "error", clickToHide: true, autoHide: false }
			);
			return false;
		}
		if (
			typeof this.params.name != "string" ||
			this.params.name.length < 6
		) {
			$.notify(
				"The event name must be a string of at least 6 characters",
				{ className: "error", clickToHide: true, autoHide: false }
			);
			return false;
		}
		let urlregex =
			/(^http)s?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}/g;
		if (!urlregex.exec(this.params.imageURL)) {
			$.notify("Enter a valid URL starting with http:// or https://", {
				className: "error",
				clickToHide: true,
				autoHide: false,
			});
			return false;
		}
		$.notify("Loading", "info");
		let newdata = {
			dateTime: this.params.dateTime,
			description: this.params.description,
			imageURL: this.params.imageURL,
			name: this.params.name,
			organizer: pageUsername,
			peopleInterestedIn: this.params.peopleInterestedIn,
		};
		console.log(newdata);
		let parmId = this.params.inputId;

		let url =
			"https://events-473a6-default-rtdb.firebaseio.com/events/" +
			parmId +
			".json";
		console.log(url);
		let headers = {
			method: "put",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newdata),
		};
		// console.log(headers);
		fetch(url, headers)
			.then(function (response) {
				if (response.status == 200) {
					// console.log("edited!!");
					$.notify("Event edited successfully", "success");

					eventshome(context);
				} else {
					console.log(response.status);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});
	this.get("#/closeEvent/:id", function (context) {
		let parmId = this.params["id"];

		let url =
			"https://events-473a6-default-rtdb.firebaseio.com/events/" +
			parmId +
			".json";
		let headers = {
			method: "DELETE",
		};
		fetch(url, headers)
			.then(function (response) {
				if (response.status == 200) {
					// console.log("deleted!!");
					$.notify("Event closed successfully", "success");
					eventshome(context);
				} else {
					console.log(response.status);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});

	this.get("#/displayProfile", function (context) {
		context.pageUsername = pageUsername;
		context.imageURL = "./images/user.png";
		context.userid = pageUsername;

		// got the user id from the global variable, now get events data and loop through for the events organized by this user
		let url =
			"https://events-473a6-default-rtdb.firebaseio.com/events.json";
		fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				// let myEvents = [];
				let eventsArray = Object.entries(data);
				eventsArray = eventsArray.map(function (innerArray) {
					let [eventID, eventObj] = innerArray;
					eventObj.id = eventID;
					return eventObj;
				});
				let myEvents = eventsArray.filter(
					(element) => element.organizer == pageUsername
				);
				context.events = myEvents;
				context.count = myEvents.length;
				context.name = myEvents.name;

				context
					.loadPartials({
						headerIn: "./views/headerIn.hbs",
						footer: "./views/footer.hbs",
					})
					.then(function () {
						this.partial(
							"./views/displayProfile.hbs",
							function (details) {
								// console.log(details);
							}
						);
					});
			})
			.catch((err) => {
				// catch err on fetch to events data
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
		// console.log("login route");
		// console.log("line 300");
	});

	this.post("#/signinForm", function (context) {
		//pulls in the login post information
		//then validates if the user can log in or not
		//if successful redirect to the allEvents page
		let username = this.params.username;
		let password = this.params.password;
		// empty one
		// let url =
		// "https://unievents-1ff1a-default-rtdb.firebaseio.com/users.json";
		// populated
		let url = "https://events-473a6-default-rtdb.firebaseio.com/users.json";
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((users) => {
				let userArray = Object.entries(users);
				// console.log(users);
				let hasUser = userArray.find((user) => {
					let [userID, userObj] = user;
					console.log(`user id key ${userID}`);
					console.log(`userObj ${userObj}`);
					console.log(`user ${user}`);

					return userObj.userid == username;
				});

				if (hasUser != undefined) {
					//check the password
					document
						.getElementById("inputUsername")
						.classList.remove("is-invalid");
					if (hasUser[1].password == password) {
						//logged In!!!!
						pageUserId = hasUser[0];
						pageUsername = hasUser[1].userid;
						// console.log(
						// 	`pageUserId  ${pageUserId}  pageUsername  ${pageUsername}`
						// );
						$.notify("Login successful.", "success");
						context.redirect("#/allEvents");
					} else {
						$.notify("Password is invalid", {
							className: "error",
							clickToHide: true,
							autoHide: false,
						});

						document
							.getElementById("inputPassword")
							.classList.add("is-invalid");
						return false;
					}
				} else {
					//send error to the front end
					$.notify("Username is invalid", {
						className: "error",
						clickToHide: true,
						autoHide: false,
					});
					document
						.getElementById("inputUsername")
						.classList.add("is-invalid");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});

	this.get("#/orgEvent", function (context) {
		context.pageUsername = pageUsername;
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
	this.post("#/orgEvent", function (context) {
		// console.log("org form submitted");
		if (typeof this.params.dateTime != "string") {
			$.notify(
				"Date and time must be a string e.g Feb 24, 2022 or 24 Mar - 10pm",
				{ className: "error", clickToHide: true, autoHide: false }
			);
			return false;
		}
		if (
			typeof this.params.description != "string" ||
			this.params.description.length < 10
		) {
			$.notify(
				"The description must be a string of at least 10 characters",
				{ className: "error", clickToHide: true, autoHide: false }
			);
			return false;
		}
		if (
			typeof this.params.name != "string" ||
			this.params.name.length < 6
		) {
			$.notify(
				"The event name must be a string of at least 6 characters",
				"error"
			);
			return false;
		}
		let urlregex =
			/(^http)s?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}/g;
		if (!urlregex.exec(this.params.imageURL)) {
			$.notify("Enter a valid URL starting with http:// or https://", {
				className: "error",
				clickToHide: true,
				autoHide: false,
			});
			return false;
		}

		let data = {
			dateTime: this.params.dateTime,
			description: this.params.description,
			imageURL: this.params.imageURL,
			name: this.params.name,
			peopleInterestedIn: 0,
			organizer: pageUsername,
		};
		let url =
			"https://events-473a6-default-rtdb.firebaseio.com/events.json";
		let headers = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};
		fetch(url, headers)
			.then(function (response) {
				if (response.status == 200) {
					$.notify("Event created successfully", "success");
					console.log("created !!");
					eventshome(context);
				} else {
					console.log(response.status);
				}
			})
			.catch((err) => {
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
	this.post("#/registerForm", function (context) {
		// console.log('org form submitted');
		// console.log(this.params);
		if (
			!this.params.userid ||
			!this.params.password ||
			!this.params.rePassword
		) {
			$.notify("Kindly fill out the complete form", {
				className: "error",
				clickToHide: true,
				autoHide: false,
			});

			return false;
		}
		let userFace = this.params.imageURL;
		if (this.params.password != this.params.rePassword) {
			$.notify("Passwords do not match", {
				className: "error",
				clickToHide: true,
				autoHide: false,
			});
			return false;
		}
		// test for valid user name
		const idregex = /([a-z,A-Z,0-9,_]{3,24}$)/g;
		if (!idregex.exec(this.params.userid)) {
			$.notify(
				"User names must contain letters, numbers and _, and be 3-24 characters in length",
				{ className: "error", clickToHide: true, autoHide: false }
			);

			return false;
		}
		const passregex = /([a-z,A-Z,0-9,_]{6,24}$)/g;
		if (!passregex.exec(this.params.password)) {
			$.notify(
				"Passwords must contain letters, numbers and _, and be 6-24 characters in length",
				{ className: "error", clickToHide: true, autoHide: false }
			);

			return false;
		}
		if (userFace == "") {
			userFace = "./images/user.png";
		}
		let username = this.params.userid;
		// check unique
		let url = "https://events-473a6-default-rtdb.firebaseio.com/users.json";
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((users) => {
				let userArray = Object.entries(users);
				console.log(userArray);
				let unique = "";
				let hasUser = userArray.find((user) => {
					let [userID, userObj] = user;
					console.log(`user id key ${userID}`);
					console.log(`userObj ${userObj}`);
					console.log(`user ${user}`);

					return userObj.userid == username;
				});

				console.log(`hasUser ${hasUser}`);
				// console.log(`hasUser[1].userid ${hasUser[1].userid}`);
				if (
					hasUser === undefined ||
					hasUser[1].userid != this.params.userid
				) {
					let data = {
						loggedin: "true",
						userid: this.params.userid,
						imageURL: userFace,
						password: this.params.password,
					};

					url =
						"https://events-473a6-default-rtdb.firebaseio.com/users.json";
					let headers = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					};
					fetch(url, headers)
						.then(function (response) {
							if (response.status == 200) {
								console.log("user created!!");
								$.notify(
									"User registration successful!",
									"success"
								);
								// eventshome(context);
								context.redirect("#/signinForm");

								// #/signinForm;
							} else {
								console.log(response.status);
							}
						})
						.catch((err) => {
							console.log(err);
						});
					// end of matching passwords if
				} else {
					$.notify("Userid already exists, please choose another", {
						className: "error",
						clickToHide: true,
						autoHide: false,
					});
					return false;
				}
			})
			.catch((err) => {
				console.log(err);
			});

		// end unique
		// let data = {
		// 	loggedin: "true",
		// 	userid: this.params.userid,
		// 	imageURL: userFace,
		// 	password: this.params.password,
		// };

		// url = "https://events-473a6-default-rtdb.firebaseio.com/users.json";
		// let headers = {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(data),
		// };
		// fetch(url, headers)
		// 	.then(function (response) {
		// 		if (response.status == 200) {
		// 			console.log("user created!!");
		// 			$.notify("User registration successful!", "success");
		// 			// eventshome(context);
		// 			context.redirect("#/signinForm");

		// 			// #/signinForm;
		// 		} else {
		// 			console.log(response.status);
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
		// end of matching passwords if
	});
	this.get("#/logout", function (context) {
		pageUserId = "";
		pageUsername = "";
		$.notify("Logout successful", "success");
		home(context);
	});
});
(() => {
	app.run("#/home");
})();
