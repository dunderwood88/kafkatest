var kafka = require('../../kafka');

exports.getMessages = function(req, res) {

    //return all the messages linked to the user who sent the request

};


exports.newMessage = function(req, res) {

    //post a new message to the user's channel
    var userId = req.body.user_id,
        message = req.body.message;

    console.log(userId + " received: " + message);

    var producer = new kafka.createProducer(new kafka.createClient());

    producer.on('ready', function() {

        producer.send([{
            topic: userId,
            messages: message
        }],
        function (err, data) {
            console.log(err | data);
        });
    });

    res.json({
        "message": "delivered to user " + userId
    });

};