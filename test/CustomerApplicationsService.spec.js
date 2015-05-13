'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');
var proxyquire = require('proxyquire');

describe('customer applications service', function () {

    var customerApplicationsService, db;

    beforeEach(function (done) {
        customerApplicationsService = require('../server/services/CustomerApplicationsService');
        init.mongo().then(function () {
            db = require('../server/model');
            done();
        });

    });

    it('should process customer application message', function (done) {
        createApplication('Neil', Date.parse('1974-2-21')).then(function (application) {
            customerApplicationsService(application._id).then(function () {
                db.Customer.find({}, function (err, customers) {
                    assert.equal(customers.length, 1);
                    assert.equal(customers[0].name, 'Neil');
                    done(err);
                });

            });

        });
    });

    function createApplication(name, dob) {
        var deferred = Q.defer();
        var application = new db.CustomerApplication({
            name: name,
            dob: dob,
            applicationDate: new Date(),
            status: 'application-received'

        });
        application.save(function (err, obj) {
            deferred.resolve(obj);
        });

        return deferred.promise;

    }
});


