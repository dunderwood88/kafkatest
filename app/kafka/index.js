var kafka = require('kafka-node');

module.exports.createClient = function() {

    //create instance of kafka client
    var client,
        kafkaHost = process.env.KAFKA_HOST,
        kafkaPort = process.env.KAFKA_PORT,

    client = new kafka.Client(kafkaHost + ':' + kafkaPort);//, _clientId);

    return client;

}



module.exports.createConsumer = function(_client, _topic) {


    //create instance of kafka consumer
    var consumer = new kafka.Consumer(_client,
        [
            {
                topic: _topic,
                partition: 0
            }
        ],
        {
            autoCommit: false
        }
    );

    return consumer;

}


module.exports.createProducer = function(_client) {

    var producer = new kafka.Producer(_client);

    producer.on('error', function(err) {
        console.log("Kafka producer error: " + err);
    })

    return producer;

}


module.exports.offset = function(_client) {

    return new kafka.Offset(_client);

}