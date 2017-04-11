var kafka = require('kafka-node');

module.exports.createClient = function() {

    //create instance of kafka client
    var client,
        kafkaHost = process.env.KAFKA_HOST,
        kafkaPort = process.env.KAFKA_PORT,

    client = new kafka.Client(kafkaHost + ':' + kafkaPort);

    return client;

}



module.exports.createConsumer = function(client, topic) {

    //create instance of kafka consumer
    var consumer = new kafka.Consumer(client,
        [
            {
                topic: topic,
                partition: 0
            }
        ],
        {
            autoCommit: false
        }
    );

    return consumer;

}


module.exports.createProducer = function() {


}