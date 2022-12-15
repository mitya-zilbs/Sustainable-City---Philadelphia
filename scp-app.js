let express = require('express'); //import express, because I want easier management of GET and POST requests.  
//let fs = require('fs');  //fs is used to manipulate the file system
let MySql = require('sync-mysql');  //MySql is used to manipulate a database connection
"use strict";

//set up the database connection 
const options = {
    user: 'mis126',
    password: 'DCDPOT',
    database: 'mis126earth',
    host: 'dataanalytics.temple.edu'
};

// create the database connection
const connection = new MySql(options);

let app = express();  //the express method returns an instance of a app object
app.use(express.urlencoded({ extended: false }));  //use this because incoming data is urlencoded

app.use(function (req, res, next) {
    express.urlencoded({ extended: false })
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();  //go process the next matching condition
});

//supporting functions *******************************************************************

let getSplash = function (res) {
    let txtSQL = "select * from items";
    try {
        var result = connection.query(txtSQL);
    } catch (e) {
        console.log(e);
        responseWrite(res, "Unexpected Error", 500);
        return;
    }
    responseWrite(res, result, 200);
    return;
};

let getDetails = function (res, item_id) {
    let txtSQL = "select * from items where item_id=?";
    try {
        var result = connection.query(txtSQL, [item_id]);
    } catch (e) {
        console.log(e);
        responseWrite(res, "Unexpected Error", 500);
        return;
    }
    responseWrite(res, result, 200);
    return;
};

let addItem = function (res, item_name, item_description, location_id, usertoken) {
    let txtSQL = "insert into items (item_name, item_description, location_id, usertoken)" +
        "values (?, ?, ?, ?)";
    try {
        var result = connection.query(txtSQL, [item_name, item_description, location_id, usertoken]);
    } catch (e) {
        console.log(e);
        responseWrite(res, "Unexpected Error", 500);
        return;
    }
    responseWrite(res, result, 200);
    return;
};

let getHistory = function (res, usertoken) {
    let txtSQL = "select * from items where usertoken=?";
    try {
        var result = connection.query(txtSQL, [usertoken]);
    } catch (e) {
        console.log(e);
        responseWrite(res, "Unexpected Error", 500);
        return;
    }
    responseWrite(res, result, 200);
    return;
}

let deleteItem = function (res, item_id, usertoken) {
    let txtSQL = "delete from items where item_id=? and usertoken=?";
    try {
        var result = connection.query(txtSQL, [item_id, usertoken]);
    } catch (e) {
        console.log(e);
        responseWrite(res, "Unexpected Error", 500);
        return;
    }
    responseWrite(res, result, 200);
    return;
}

let getLocation = function (res, location_id) {
    let txtSQL = "select * from locations where location_id=?";
    try {
        var result = connection.query(txtSQL, [location_id]);
    } catch (e) {
        console.log(e);
        responseWrite(res, "Unexpected Error", 500);
        return;
    }
    responseWrite(res, result, 200);
    return;
}

//responseWrite is a supporting function.  It sends 
// output to the API consumer and ends the response.
// This is hard-coded to always send a json response.
let responseWrite = function (res, Output, responseStatus) {
    res.writeHead(responseStatus, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(Output));
    res.end();
};

//error trapping ************************************************************************

app.get('/details', function (req, res, next) {
    let item_id = req.query.item_id;
    if (item_id == undefined || item_id == "" || isNaN(item_id)) {
        responseWrite(res, "item_id required, must be a number", 400);
        return;
    }
    next();
});

app.post('/add', function (req, res, next) {
    let item_name = req.body.item_name;
    let item_description = req.body.item_description;
    let usertoken = req.body.usertoken;
    let location_id = req.body.location_id;
    if (item_name == undefined || item_name == "") {
        responseWrite(res, "please provide a name for the item", 400);
        return;
    }
    if (item_description == undefined || item_description == "") {
        responseWrite(res, "please provide a description for the item", 400);
        return;
    }
    if (usertoken == undefined || usertoken == "" || isNaN(usertoken)) {
        responseWrite(res, "please provide a usertoken", 400);
        return;
    }
    if (location_id == undefined || location_id == "" || isNaN(location_id)) {
        responseWrite(res, "please provide a usertoken", 400);
        return;
    }
    next();
});

app.get('/history', function (req, res, next) {
    let usertoken = req.query.usertoken;
    if (usertoken == undefined || usertoken == "" || isNaN(usertoken)) {
        responseWrite(res, "usertoken required, must be a number", 400);
        return;
    }
    next();
});

app.delete('/remove', function (req, res, next) {
    let usertoken = req.body.usertoken;
    let item_id = req.body.item_id;
    if (usertoken == undefined || usertoken == "" || isNaN(usertoken)) {
        responseWrite(res, "usertoken required, must be a number", 400);
        return;
    }
    if (item_id == undefined || item_id == "" || isNaN(item_id)) {
        responseWrite(res, "item_id is required, must be a number", 400);
        return;
    }
    next();
});

app.get('/location', function (req, res, next) {
    let location_id = req.query.location_id;
    if (location_id == undefined || location_id == "" || isNaN(location_id)) {
        responseWrite(res, "usertoken required, must be a number", 400);
        return;
    }
    next();
})

//event handlers ************************************************************************

app.get('/home', function (req, res) {
    getSplash(res);
});

app.get('/details', function (req, res) {
    let item_id = req.query.item_id;
    getDetails(res, item_id);
});

app.post('/add', function (req, res) {
    let item_name = req.body.item_name;
    let item_description = req.body.item_description;
    let usertoken = req.body.usertoken;
    let location_id = req.body.location_id;
    addItem(res, item_name, item_description, location_id, usertoken);
});

app.get('/history', function (req, res) {
    let usertoken = req.query.usertoken;
    getHistory(res, usertoken);

});

app.delete('/remove', function (req, res) {
    let item_id = req.body.item_id;
    let usertoken = req.body.usertoken;
    deleteItem(res, item_id, usertoken);
});

app.get('/location', function (req, res) {
    let location_id = req.query.location_id;
    getLocation(res, location_id);
})

//what the app should do when it received a "GET" against the root
app.get('/', function (req, res) {
    //what to do if request has no route ... show instructions
    let message = [];

    message[message.length] = "Issue a GET request to '/home' to get items." +
        " No data is required for the request. ";
    message[message.length] = "Issue a GET request to '/details' for details on an item." +
        " Provide item_id. ";
    message[message.length] = "Issue a POST request to '/add' to add an item. Provide " +
        "item_name, item_description, location_id, and usertoken. ";
    message[message.length] = "Issue a GET request to '/history' to see user's items. Provide usertoken. ";
    message[message.length] = "Issue a DELETE request to '/remove' to delete an item. Provide " +
        "item_id and usertoken (users can only delete their own items). ";
    message[message.length] = "Issue a GET request to '/location' to get the location coordinates and pickup zones. " +
        "Provide location_id. ";
    message[message.length] = "This service was created by Mitchel Zilbershteyn, David Eugene, and Dru Valugubelly for MIS3502. ";


    responseWrite(res, message, 200);
    return
});

//This piece of code creates the server  
//and listens for requests on a specific port
//we are also generating a message once the 
//server is created
let server = app.listen(8229, "0.0.0.0", function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("The endpoint server is listening on port:" + port);
});