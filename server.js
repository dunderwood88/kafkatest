//server.js

//set up express instance
var express = require('express');
var app = express();

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

io.on('connection', function(socket) {
    console.log('user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
    });
});





//set up kafka client
var kafka = require('./app/kafka');
var client = new kafka.createClient();

//consumer set up
consumer = new kafka.createConsumer(client, 'test');
consumer.on('message', function(message) {
    var data = message.value;
    console.log(data);
    io.emit('chat message', data);
});


