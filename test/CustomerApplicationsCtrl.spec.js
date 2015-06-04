'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');

describe('customer applications api', function () {

    var app, db;

    beforeEach(function (done) {
        init.mongo().then(function () {
            app = init.app(require('../server/controllers/CustomerApplicationsCtrl'));
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
                    assert.equal(applications[0].status, 'processing');
                    done(err);
                });

            });

    });

    it('should return 400 for invalid applications', function (done) {
        var application = {dob: '1974-02-01'};
        request(app).post('/api/customer-applications')
            .set('Content-Type', 'application/json')
            .send(application)
            .expect(400)
            .end(done);

    });

    it('should get customer applications', function (done) {
        createApplication('Neil', 'London', new Date('1999-1-1'))
            .then(createApplication('Tom', 'London', new Date('2000-1-2'))).then(function () {
                request(app).get('/api/customer-applications')
                    .expect(200)
                    .expect(function (res) {
                        assert.equal(res.body.length, 2);
                        assert.equal(res.body[0].name, 'Neil');
                        assert.equal(res.body[1].name, 'Tom');
                        assert.equal(res.body[1].status, 'processing');
                        assert.equal(res.body[1].status, 'processing');
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


    function createApplication(name, address, dob) {
        return new db.CustomerApplication({
            name: name,
            address: address,
            dob: dob,
            applicationDate: new Date(),
            status: 'processing'

        }).save();

    }

});


