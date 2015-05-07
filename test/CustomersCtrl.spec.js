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
            done();
        });
    });

    it('should retrieve all books in the library', function (done) {
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
        var deferred = Q.defer();
        new db.Customer({name: name}).save(function(err, obj) {
            deferred.resolve(obj);
        });
        return deferred.promise;
    }


});


