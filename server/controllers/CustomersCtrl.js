'use strict';

var express = require('express');
var router = express.Router();
var db = require('../model');
var Customer = db.Customer;

router.get('/customers', function (req, res) {
    Customer.find().then(function (customers) {
        res.status(200).json(customers.map(asHal));
    });

});

function asHal(customer) {
    var id = customer._id;
    var self = '/customers/' + id;
    return {
        _links: {
            self: {href: self},
            loans: {href: self + '/loans'}
        },
        id: id,
        name: customer.name
    }
}

module.exports = router;
