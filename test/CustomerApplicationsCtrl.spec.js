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
        init.mongo().then(function () {
            app = init.app(proxyquire('../server/controllers/CustomerApplicationsCtrl', {
                'servicebus': {
                    bus: function () {
                        return mockBus;
                    }
                }
            }));
            db = require('../server/model');
        }).then(done);

    });

    it('should create a customer application', function (done) {
        var application = {name: 'Neil Moorcroft', dob: '1974-2-21'};
        request(app).post('/api/customer-applications')
            .set('Content-Type', 'application/json')
            .send(application)
            .expect(201)
            .end(function (err) {
                if (err) throw err;
                db.CustomerApplication.find({}, function (err, applications) {
                    assert.equal(applications.length, 1);
                    assert.equal(applications[0].name, 'Neil Moorcroft');
                    assert.deepEqual(applications[0].dob, new Date('1974-2-21'));
                    assert.equal(applications[0].status, 'application-received');
                    assert.equal(mockBus.event, 'library.customer-application');
                    assert.deepEqual(mockBus.obj._id, applications[0]._id);
                    done(err);
                });

            });

    });

    it('should block applications for under 12s', function (done) {
        var application = {name: 'Tom Moorcroft', dob: '2005-05-11'};
        request(app).post('/api/customer-applications')
            .set('Content-Type', 'application/json')
            .send(application)
            .expect(400)
            .end(function (err) {
                if (err) throw err;
                db.CustomerApplication.find({}, function (err, applications) {
                    assert.equal(applications.length, 0);
                    done(err);
                });

            });

    });

    it('should return 400 for invalid applications', function (done) {
        var application = {dob:'1974-02-01'};
        request(app).post('/api/customer-applications')
            .set('Content-Type', 'application/json')
            .send(application)
            .expect(400)
            .end(done);

    });

    it('should get customer applications', function (done) {
        createApplication('Neil', new Date()).then(createApplication('Tom', new Date())).then(function() {
            request(app).get('/api/customer-applications')
                .expect(200)
                .expect(function (res) {
                    assert.equal(res.body.length, 2);
                    assert.ok(_.find(res.body, _.matchesProperty('name', 'Neil')));
                    assert.ok(_.find(res.body, _.matchesProperty('name', 'Tom')));
                })
                .end(done);

        });

    });

    it('should return 400 for invalid application with invalid date', function (done) {
        var application = {};
        request(app).post('/api/customer-applications')
            .set('Content-Type', 'application/json')
            .send(application)
            .expect(400)
            .end(done);

    });


    function createApplication(name, dob) {
        return new db.CustomerApplication({
            name: name,
            dob: dob,
            applicationDate: new Date(),
            status: 'application-received'

        }).save();

    }

});


