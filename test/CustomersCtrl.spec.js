'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');

describe('customers api', function () {

    var app, db;

    beforeEach(function (done) {
        init.mongo().then(function () {
            app = init.app(require('../server/controllers/CustomersCtrl'));
            db = require('../server/model');
        }).then(done);
    });

    it('should retrieve all customers of the library', function (done) {
        createCustomer('neil')
            .then(createCustomer('tom'))
            .then(function () {
                request(app).get('/api/customers')
                    .expect(function (res) {
                        assert.equal(res.body.length, 2);
                        assert.ok(_.find(res.body, _.matchesProperty('name', 'neil')));
                        assert.ok(_.find(res.body, _.matchesProperty('name', 'tom')));
                    })
                    .expect(200)
                    .end(done);
            });

    });

    function createCustomer(name) {
        return new db.Customer({name: name}).save();
    }


});


