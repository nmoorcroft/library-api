'use strict';

var logger = require('winston');
var express = require('express');
var router = express.Router();
var db = require('../model');
var bus = require('servicebus').bus();
var CustomerApplication = db.CustomerApplication;

router.post('/customer-applications', function (req, res) {
    var application = asApplication(req.body);
    application.save(function (err, saved) {
        if (err) res.status(500).send(err);
        else {
            bus.send('library.customer-application', saved);
            res.status(201).send('/customer-applications/' + saved.id);
        }
    });
});

function asApplication(req) {
    var application = new CustomerApplication();
    application.name = req.name;
    application.dob = Date.parse(req.dob);
    application.applicationDate = new Date();
    application.status = "application-received";
    return application;
}

module.exports = router;

