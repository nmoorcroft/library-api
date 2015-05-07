'use strict';

function MockServiceBus() {
    this.event = null;
    this.obj = null;
    this.callback = null;
}

MockServiceBus.prototype.send = function (event, obj) {
    this.event = event;
    this.obj = obj;
};


MockServiceBus.prototype.listen = function (event, callback) {
    this.event = event;
    this.callback = callback;
};

module.exports = MockServiceBus;

