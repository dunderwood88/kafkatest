var messageControl = require('../controllers/messageController');

module.exports = function(router) {


    router.route('/messages/')

        //get user messages
        .get(messageControl.getMessages)

        //post a new message
        .post(messageControl.newMessage);

}
