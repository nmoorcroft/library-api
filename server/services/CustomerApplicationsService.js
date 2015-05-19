'use strict';

var db = require('../model');
var CustomerApplication = db.CustomerApplication;
var Customer = db.Customer;
var _ = require('lodash');
var Q = require('q');


function createCustomer(application) {
    return new Customer({name: application.name}).save();
}

function updateStatus(application) {
    application.status = 'complete';
    return application.save();
}

module.exports = function () {
    var updates = [];
    CustomerApplication.find({'status': 'application-received'}).then(function (applications) {
        _.each(applications, function (application) {
            updates.push(Q.all([createCustomer(application), updateStatus(application)]));
        });
    });
    return Q.all(updates);

};




