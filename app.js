"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "https://mis3502-mzilbershteyn.com/8229";

/* SUPPORTING FUNCTIONS */

let getHome = function () {
	$.ajax({
		url: endpoint02 + '/home',
		method: 'GET',
		success: function (result) {
			console.log(result);
			$("#table-items").html("<tr><th>Item Name</th><th>Item Detail</th><th>Location Number</th><th>Details</th></tr>");
			for (let i = 0; i < result.length; i++) {
				let item_name = result[i]['item_name'];
				let item_description = result[i]['item_description'];
				let location_id = result[i]['location_id'];
				let detailsButton = '<input type="button" value="Get Details" class="btn btn-primary"' +
					' id="detailsButton' + result[i]['item_id'] +
					'" onclick="getDetails(' + result[i]['item_id'] + ')">';
				let newRow = '<tr><td>' + item_name + '</td><td>' + item_description
					+ '</td><td>' + location_id + '</td><td>' + detailsButton + '</td></tr>';
				$("#table-items").append(newRow);
			}
		},
		error: function (data) {
			console.log(data);
		}
	})
};

let getMyStuff = function () {
	$("#table-myStuff").html("");
	let the_serialized_data = $("#usertoken").serialize();
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + '/history',
		method: 'GET',
		data: the_serialized_data,
		success: function (result) {
			console.log(result);
			if (result.length == 0) {
				$("#message-myStuff").show();
				return;
			}
			$("#table-myStuff").html("<tr><th>Item Name</th><th>Item Detail</th><th>Location Number</th><th>Delete</th></tr>");
			for (let i = 0; i < result.length; i++) {
				let item_name = result[i]['item_name'];
				let item_description = result[i]['item_description'];
				let location_id = result[i]['location_id'];
				let deleteButton = '<input type="button" value="Delete Item" class="btn btn-danger"' +
					' id="deleteButton' + result[i]['item_id'] +
					'" onclick="deleteItem(' + result[i]['item_id'] + ')">';
				let newRow = '<tr><td>' + item_name + '</td><td>' + item_description
					+ '</td><td>' + location_id + '</td><td>' + deleteButton + '</td></tr>';
				$("#table-myStuff").append(newRow);
				$("#message-myStuff").hide();
			}
		},
		error: function (data) {
			console.log(data);
		}
	})
};

let getDetails = function (item_id) {
	$("#details-name").html("");
	$("#details-description").html("");
	$("#details-location_id").html("");
	$("#details-map").html("");

	let the_serialized_data = "item_id=" + item_id;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + '/details',
		method: 'GET',
		data: the_serialized_data,
		success: function (result) {
			$(".content-wrapper").hide();
			$("#div-detail").show();
			$("#details-name").html(result[0]["item_name"]);
			$("#details-description").html(result[0]["item_description"]);
			getMap(result[0]["location_id"]);
		},
		error: function (data) {
			console.log(data);
		}
	})
}

let getMap = function (location_id) {
	let the_serialized_data = "location_id=" + location_id;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + '/location',
		method: 'GET',
		data: the_serialized_data,
		success: function (result) {
			$("#details-map").html('<iframe src=' +
				"https://www.mapquestapi.com/staticmap/v5/map?key=d6l0aUe0KPaM8SQ0KFSe4BAulsm66eV0&type=map&size=500,360@2x" +
				"&locations=" + result[0]['pickup_location'] +
				"|marker-red&boundingBox=" + result[0]['coordinates'] +
				' style="height:740px;width:80%"></iframe>');
			$("#details-location_id").html('The location zone for this item is ' + result[0]["location_id"] +
				', and the pickup spot is: ');
			$("#details-location_id2").html(result[0]['pickup_location']);
		},
		error: function (data) {
			console.log(data);
		}
	})
};

let deleteItem = function (item_id) {
	let the_serialized_data = $("#usertoken").serialize();
	the_serialized_data = the_serialized_data + "&item_id=" + item_id;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + '/remove',
		method: 'DELETE',
		data: the_serialized_data,
		success: function (result) {
			console.log(result);
			alert("Your item was deleted");
			getMyStuff();
		},
		error: function (data) {
			console.log(data);
		}
	})
};

let addItem = function () {
	let itemname = $("#itemname").val();
	let itemdescription = $("#itemdescription").val();
	let locationid = $("#locationid").val();
	$("#message-addItem").html("");
	$("#message-addItem").removeClass();

	if (itemname == "" || itemname == undefined) {
		$("#message-addItem").html("Please enter a name for the item");
		$("#message-addItem").addClass("alert alert-danger");
	} else if (itemdescription == "" || itemdescription == undefined) {
		$("#message-addItem").html("Please enter a description for the item");
		$("#message-addItem").addClass("alert alert-danger");
	} else if (locationid < 1 || locationid > 16) {
		$("#message-addItem").html("Please enter a location ID between 1 and 16 for the item");
		$("#message-addItem").addClass("alert alert-danger");
	}
	else {
		let the_serialized_data1 = $("#usertoken").serialize();
		let the_serialized_data = $("#form-additem").serialize();
		the_serialized_data = the_serialized_data + "&" + the_serialized_data1;
		console.log(the_serialized_data)
		$.ajax({
			url: endpoint02 + '/add',
			data: the_serialized_data,
			method: 'POST',
			success: function (result) {
				alert("Item added successfully");
				$(".content-wrapper").hide();
				$("#div-myStuff").show();
				getMyStuff();
				$("#itemname").val("");
				$("#itemdescription").val("");
				$("#locationid").val("");
			},
			error: function (data) {
				console.log(data);
			}
		})
	}
};

let loginController = function () {
	//clear any previous messages
	$('#login_message').html("");
	$('#login_message').removeClass();

	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == "") {
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}

	//go get the data off the login form
	let the_serialized_data = $('#form-login').serialize();
	//the data I am sending
	console.log(the_serialized_data);;
	$.ajax({
		"url": endpoint01,
		"method": "GET",
		"data": the_serialized_data,
		"success": function (result) {
			console.log(result); //the result I got back
			if (typeof result === 'string') {
				// login failed.  Remove usertoken 
				localStorage.removeItem("usertoken");
				$('#login_message').html("Login Failed. Try again.");
				$('#login_message').addClass("alert alert-danger text-center");
			} else {
				//login succeeded.  Set usertoken.
				localStorage.usertoken = result['user_id'];
				//console log the result ... a bad idea in prodcution
				//but useful for teaching, learning and testing
				console.log(result);
				//manage the appearence of things...
				$('#login_message').html('');
				$('#login_message').removeClass();
				$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				$('#div-login').hide(); //hide the login page
				$('#div-home').show();   //show the default page
				$("#usertoken").val(localStorage.usertoken);
			}
		},
		"error": function (data) {
			console.log("Something went wrong");
			console.log(data);
		},
	}); //end of ajax 

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};

let mapTest = function () {
	$("#details-map").html("");
	let location = "1530N11thSt,Philadelphia,PA19121";
	let boundingBox = "39.976789,-75.154441,39.973598,-75.151939";
	$("#details-map").html('<iframe src=' +
		"https://www.mapquestapi.com/staticmap/v5/map?key=d6l0aUe0KPaM8SQ0KFSe4BAulsm66eV0&type=map&size=500,360@2x" +
		"&locations=" + location + "|marker-red&boundingBox=" + boundingBox +
		' style="height:740px;width:80%"></iframe>')
}

//document ready section
$(document).ready(function () {

	mapTest();
	getHome();

	/* ----------------- start up navigation -----------------*/
	/* controls what gets revealed when the page is ready     */

	/* this reveals the default page */
	if (localStorage.usertoken) {
		$("#div-home").show()
		$(".secured").removeClass("locked");
		$(".secured").addClass("unlocked");
		$("#usertoken").val(localStorage.usertoken);
	}
	else {
		$("#div-login").show();
		$(".secured").removeClass("unlocked");
		$(".secured").addClass("locked");
	}

	/* ------------------  basic navigation -----------------*/
	/* this controls navigation - show / hide pages as needed */

	/* links on the menu */

	$('#link-home').click(function () {
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-home").show(); /* show the chosen content wrapper */
		getHome();
	});

	$('#link-myStuff').click(function () {
		$(".content-wrapper").hide();
		$("#div-myStuff").show();
		getMyStuff();
	});

	$('#link-about').click(function () {
		$(".content-wrapper").hide();
		$("#div-about").show();
	});

	$('#link-map').click(function () {
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-map").show(); /* show the chosen content wrapper */
	});

	$('#link-EEE').click(function () {
		$(".content-wrapper").hide();
		$("#div-detail").show();
	});

	$('#link-addItem').click(function () {
		$(".content-wrapper").hide();
		$("#div-addItem").show();
	});

	$('#link-GGG').click(function () {
		$(".content-wrapper").hide();
		$("#div-GGG").show();
	});

	$('#btnViewMap').click(function () {
		$(".content-wrapper").hide();
		$("#div-map").show();
	});

	$('#btnViewMap2').click(function () {
		$(".content-wrapper").hide();
		$("#div-map").show();
	});

	$('#btnViewSplash').click(function () {
		$(".content-wrapper").hide();
		$("#div-home").show();
	});

	$('#btnReturnSplash').click(function () {
		$(".content-wrapper").hide();
		$("#div-home").show();
	});

	$('#btnMoreDetail').click(function () {
		$(".content-wrapper").hide();
		$("#div-EEE").show();
	});


	$('#btnMoreDetail2').click(function () {
		$(".content-wrapper").hide();
		$("#div-EEE").show();
	});

	$('#btnAddStuff').click(function () {
		$(".content-wrapper").hide();
		$("#div-addItem").show();
	});

	$('#btnAddStuff2').click(function () {
		$(".content-wrapper").hide();
		$("#div-addItem").show();
	});

	$('#btnViewStuff').click(function () {
		$(".content-wrapper").hide();
		$("#div-GGG").show();
	});


	$('#btnViewStuff2').click(function () {
		$(".content-wrapper").hide();
		$("#div-GGG").show();
	});

	$('#btnAdditem').click(function () {
		addItem();
	});


	$('#btnCancel').click(function () {
		$(".content-wrapper").hide();
		$("#div-myStuff").show();
		getMyStuff();
		$("#itemname").val("");
		$("#itemdescription").val("");
		$("#locationid").val("");
	});


	$('#btnDelete').click(function () {
		$(".content-wrapper").hide();
		$("#div-myStuff").show();  //return to My Stuff from View item after deleting 
	});

	$('#btnDelete2').click(function () {
		$(".content-wrapper").hide();
		$("#div-myStuff").show();  //return to My Stuff from View item after deleting
	});

	/* what happens if any of the navigation links are clicked? */
	$('.nav-link').click(function () {
		$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
		$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */
	});

	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function () {
		loginController();
	});

	/* what happens if the logout link is clicked? */
	$('#link-logout').click(function () {
		// First ... remove usertoken from localstorage
		localStorage.removeItem("usertoken");
		// Now force the page to refresh
		window.location = "./index.html";
	});

}); /* end the document ready event*/

