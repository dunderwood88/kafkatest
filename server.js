// server.js

// set up express instance
var express = require('express');
var app = express();

// includes
var kafka = require('./app/kafka');



//configure the app to use bodyParser()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// set up routes for the API
require('./app/api/routes')(app);


// what port are we listening on?
var port = process.env.PORT;


module.exports = app;


// start the server
const server = app.listen(port);
console.log("Listening on port " + port);


// websockets
var io = require('socket.io').listen(server);
var cookieParser = require('socket.io-cookie');
io.use(cookieParser);



// websocket event handling
io.on('connection', function(socket) {

    // get the Segue authorisation cookie
    var cookie = socket.handshake.headers.cookie.SEGUE_AUTH_COOKIE;

    // parse the cookie object (unfortunately requires some cleanup due to escaped quotes in string)
    var cookieData = JSON.parse(cookie.replace(/\\"/g, '"'));

    var userId = cookieData.currentUserId;
    console.log('user ' + userId + ' connected');


    // set up consumer and subscribe to topic
    var consumer = new kafka.createConsumer(new kafka.createClient(), "userNotifications");

    //event to fire when message published to topic
    consumer.on('message', function(message) {

        var jsonRecord = JSON.parse(message.value);

        if (userId == jsonRecord.userId) {
            // send message via open socket
            socket.emit('message', message);
        }

    });


    socket.on('disconnect', function() {
        console.log('user disconnected');
    });


});