'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: {type: String, required: true},
    address: {type: String},
    dob: {type: Date}
});

module.exports = mongoose.model('Customer', customerSchema);


