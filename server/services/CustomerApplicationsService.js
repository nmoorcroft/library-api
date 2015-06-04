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

function completeApplication(application) {
    return Q.allSettled([createCustomer(application), updateStatus(application)]);
}

module.exports.process = function () {
    var deferred = Q.defer();
    CustomerApplication.find({'status': 'application-received'}).then(function (applications) {
        var updates = [];
        _.each(applications, function(application) {
            updates.push(completeApplication(application));
        });
        Q.allSettled(updates).then(deferred.resolve);

    });
    return deferred.promise;

};




