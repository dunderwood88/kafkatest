var express = require('express'),
    fs = require('fs');

module.exports = function(app) {

    //get an instance of the express Router
    var router  = express.Router();

    // middleware to use for all requests
    router.use(function(req, res, next) {

        //do logging or whatever
        console.log('API request.');

        //make sure we go to the next routes and don't stop here
        next();
    });


    // test router to make sure everything is working (accessed at GET http://<HOST>:<PORT>/api)
    router.get('/', function(req, res) {
        res.json({
            message: "Welcome to our api! You'll have to dig deeper..."
        });
    });


    //require all routes files from the directory
    var files = fs.readdirSync('./app/api/routes/');
    for (var i in files) {
        if (files[i] !== 'index.js')
            require('./' + files[i].substr(0, files[i].lastIndexOf('.')))(router)
    }

    //REGISTER OUR ROUTES
    // all of our API routes will be prefixed with /api
    app.use('/api', router);
}