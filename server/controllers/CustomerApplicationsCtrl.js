'use strict';

var express = require('express');
var router = express.Router();
var db = require('../model');
var CustomerApplication = db.CustomerApplication;

router.post('/customer-applications', function (req, res) {
    newApplication(req.body).save().then(function (saved) {
        res.status(201).send('/customer-applications/' + saved.id);
    }, function (err) {
        console.log(err.stack);
        res.status(400).send(err);
    });
});

router.get('/customer-applications', function (req, res) {
    CustomerApplication.find().then(function (applications) {
        res.status(200).send(applications);
    });
});

function newApplication(req) {
    var application = new CustomerApplication();
    application.name = req.name;
    application.dob = Date.parse(req.dob);
    application.applicationDate = new Date();
    application.status = 'processing';
    return application;
}

module.exports = router;

