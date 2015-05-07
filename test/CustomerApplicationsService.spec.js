'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');
var proxyquire = require('proxyquire');
var MockServiceBus = require('./helpers/MockServiceBus');

describe('customer applications service', function () {

    var customerApplicationsService, mockBus, db;

    beforeEach(function (done) {
        mockBus = new MockServiceBus();
        customerApplicationsService = proxyquire('../server/controllers/CustomerApplicationsCtrl', {
            'servicebus': {
                bus: function() {
                    return mockBus;
                }
            }
        });
        db = require('../server/model');
        done();

    });

    it.skip('should..', function (done) {
        assert.isNotNull(mockBus.callback);

        done();

    });




});


