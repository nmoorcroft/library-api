'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var bus = require('servicebus').bus();
var app = express();

// support json
app.use(bodyParser.json({}));

// load configuration
var configPath = 'config-' + (process.env.NODE_ENV || 'dev') + '.json';
nconf.env().argv().file(configPath);

// initialize mongo
require('./mongodb')(nconf.get('mongodb'));

// configure controllers and routes
app.use(nconf.get('base_uri'), require('./controllers'));

// initialize CustomerApplicationService
var customerApplicationService = require('./services/CustomerApplicationsService');
bus.listen('library.customer-application', function (event) {
    customerApplicationService(event._id);
});

// catch uncaught exceptions
process.on('uncaughtException', function (err) {
    console.log('uncaughtException: ' + err.stack);
});

// start http server
var port = nconf.get('port');
app.listen(port, function () {
    console.log('Started server, listening on port ' + port + '..');
});




