'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: {type: String, required: true},
    dob: {type: Date, required: true},
    applicationDate: {type: Date, required: true},
    status: {type: String, required: true}

});

module.exports = mongoose.model('CustomerApplication', customerSchema);



