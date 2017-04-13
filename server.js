//server.js

//set up express instance
var express = require('express');
var app = express();

var kafka = require('./app/kafka');
//var client = new kafka.createClient();


//configure the app to use bodyParser()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//set up routes for our API
require('./app/api/routes')(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//what port are we listening on?
var port = process.env.PORT;

module.exports = app;


//start the server
const server = app.listen(port);
console.log("Listening on port " + port);



var io = require('socket.io').listen(server);
var cookieParser = require('socket.io-cookie');
io.use(cookieParser);


io.on('connection', function(socket) {

    //Get the Segue authorisation cookie
    var cookie = socket.handshake.headers.cookie.SEGUE_AUTH_COOKIE;

    //parse the cookie object (unfortunately requires some cleanup due to escaped quotes in string)
    var cookieData = JSON.parse(cookie.replace(/\\"/g, '"'));

    var userId = cookieData.currentUserId;

    console.log('user ' + cookieData.currentUserId + ' connected');


    //set up consumer and subscribe to topic
    var consumer = new kafka.createConsumer(new kafka.createClient(), userId);

    //event to fire when message published to topic
    consumer.on('message', function(message) {
        var data = message.value;

        //send message via open socket
        socket.emit('message', data);
    });


    socket.on('disconnect', function() {

        console.log('user disconnected');
    });


});