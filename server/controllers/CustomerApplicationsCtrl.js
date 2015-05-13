'use strict';

var logger = require('winston');
var express = require('express');
var router = express.Router();
var db = require('../model');
var bus = require('servicebus').bus();
var CustomerApplication = db.CustomerApplication;

router.post('/customer-applications', function (req, res) {
    var application = asApplication(req.body);
    if (ageFor(application.dob) < 12) {
        res.status(400).send('library customers must be aged 12 or over');

    } else {
        application.save(function (err, saved) {
            if (err) res.status(500).send(err);
            else {
                bus.send('library.customer-application', saved);
                res.status(201).send('/customer-applications/' + saved.id);
            }
        });
    }
});

function asApplication(req) {
    var application = new CustomerApplication();
    application.name = req.name;
    application.dob = Date.parse(req.dob);
    application.applicationDate = new Date();
    application.status = 'application-received';
    return application;
}

function ageFor(dob) {
    var ageInMills = Date.now() - dob.getTime();
    var ageDate = new Date(ageInMills); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

module.exports = router;

