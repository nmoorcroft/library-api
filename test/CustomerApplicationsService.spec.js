'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');

describe('customer applications service', function () {

    var customerApplicationsService, db;

    beforeEach(function (done) {
        customerApplicationsService = require('../server/services/CustomerApplicationsService');
        init.mongo().then(function () {
            db = require('../server/model');
        }).then(done);

    });

    it('should process customer application message', function (done) {
        createApplication('Neil', Date.parse('1974-2-21'))
            .then(createApplication('Tom', Date.parse('1974-2-21')))
            .then(function () {
                customerApplicationsService.process().then(function () {
                    Q.all([findApplications(), findCustomers()]).done(function (results) {
                        var applications = results[0];
                        var customers = results[1];
                        assert.equal(customers.length, 2);
                        assert.equal(customers[0].name, 'Neil');
                        assert.equal(customers[1].name, 'Tom');
                        assert.equal(applications[0].status, 'complete');
                        assert.equal(applications[1].status, 'complete');
                        done();

                    });

                });

        });
    });

    function findApplications() {
        return db.CustomerApplication.find();
    }

    function findCustomers() {
        return db.Customer.find();
    }

    function createApplication(name, dob) {
        return new db.CustomerApplication({
            name: name,
            dob: dob,
            applicationDate: new Date(),
            status: 'application-received'

        }).save();

    }
});


