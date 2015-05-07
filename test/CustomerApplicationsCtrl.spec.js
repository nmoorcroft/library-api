'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');
var proxyquire = require('proxyquire');
var MockServiceBus = require('./helpers/MockServiceBus');

describe('customer applications api', function () {

    var app, db, mockBus;

    beforeEach(function (done) {
        mockBus = new MockServiceBus();
        var router = proxyquire('../server/controllers/CustomerApplicationsCtrl', {
            'servicebus': {
                bus: function() {
                    return mockBus;
                }
            }
        });

        init.mongo().then(function () {
            app = init.app(router);
            db = require('../server/model');
            done();
        });

    });

    it('should create a customer application', function (done) {
        var application = {name: "Neil Moorcroft", dob: "1974-2-21"};
        request(app).post('/api/customer-applications')
            .set('Content-Type', 'application/json')
            .send(application)
            .expect(201)
            .end(function (err) {
                if (err) throw err;
                db.CustomerApplication.find({}, function (err, applications) {
                    assert.equal(applications.length, 1);
                    assert.equal(applications[0].name, "Neil Moorcroft");
                    assert.deepEqual(applications[0].dob, new Date('1974-2-21'));
                    assert.equal(applications[0].status, "application-received");
                    assert.equal(mockBus.event, "library.customer-application");
                    assert.deepEqual(mockBus.obj._id, applications[0]._id);
                    done(err);
                });

            });

    });




});


