'use strict';

var db = require('../model');
var CustomerApplication = db.CustomerApplication;
var Customer = db.Customer;
var Q = require('q');

module.exports = function (id) {
    var deferred = Q.defer();
    CustomerApplication.findById(id, function (err, application) {
        var customer = new Customer({name: application.name});
        customer.save(function (err, saved) {
            if (err) deferred.reject(err);
            deferred.resolve(saved);
        });
    });
    return deferred.promise;

}



