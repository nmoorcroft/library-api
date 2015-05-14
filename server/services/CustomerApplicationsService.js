'use strict';

var db = require('../model');
var CustomerApplication = db.CustomerApplication;
var Customer = db.Customer;
var Q = require('q');

function createCustomer(application) {
    return new Customer({name: application.name}).save();
}

function updateStatus(application) {
    application.status = 'complete';
    return application.save();
}

module.exports = function (id) {
    var deferred = Q.defer();
    CustomerApplication.findById(id, function (err, application) {
        deferred.resolve(Q.all([createCustomer(application), updateStatus(application)]));
    });
    return deferred.promise;

}



