'use strict';

var Q = require('q');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

module.exports.mongo = function() {
    var deferred = Q.defer();
    mongoose.connect('mongodb://localhost/db-test', function() {
        mongoose.connection.db.dropDatabase(deferred.resolve);
    });
    return deferred.promise;
};

module.exports.app = function(router) {
    var app = require('express')();
    app.use(bodyParser.json({}));
    app.use('/api', router);
    return app;
};


