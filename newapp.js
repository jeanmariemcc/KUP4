const app = Sammy("#container", function () {
	let userId = "-Msdft87654";
	let username = "user12";
	this.use("Handlebars", "hbs");

	// Home
	this.get("#/home", function (context) {
		context
			.loadPartials({
				headerOut: "./views/headerOut.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/home.hbs", function (details) {
					console.log(details);
				});
			});
	});

	this.get("#/allEvents", function (context) {
		let events = [
			{
				id: "-Mjf0LUAPI6q60HTKK0Y",
				dateTime: "09-29-2021 7:00pm",
				description: "Graduation class of 2021",
				imageURL:
					"https://italianallegria.com/wp-content/uploads/2019/02/graduation-3649717_1920.jpg",
				name: "High School Party",
				organizer: "user6",
				peopleInterestedIn: 0,
			},
			{
				id: "3",
				dateTime: "10-27-2021 7:30pm",
				description:
					"It's a surprise! Come celebrate with us and surprise our birthday girl!",
				imageURL:
					"https://img.chewy.com/is/image/catalog/139519_MAIN._AC_SL1500_V1540401494_.jpg",
				name: "Birthday Party",
				organizer: "user1",
				peopleInterestedIn: 2,
			},
		];
		context.events = events;
		context
			.loadPartials({
				headerIn: "./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/allEvents.hbs", function (details) {
					console.log(details);
				});
			});
	});


	this.get("#/signinForm", function (context) {
		context
			.loadPartials({
				headerIn: "./views/headerIn.hbs",
				footer: "./views/footer.hbs",
			})
			.then(function () {
				this.partial("./views/signinForm.hbs", function (details) {
					console.log(details);
				});
			});
		console.log("login route");
	});
});
(() => {
	app.run("#/home");
})();
