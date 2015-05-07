'use strict';

var express = require('express');
var router = express.Router();

router.use(require('./BooksCtrl'));
router.use(require('./CustomersCtrl'));
router.use(require('./CustomerApplicationsCtrl'));


module.exports = router;







