const express = require('express');
const route = express.Router();
const { allowUserView,allowUserAction } = require('../middleware/middlewares');
const { get_parent_dashboard } = require('../controller/parentController');

// Dashboard
route.get('/parent-dashboard/:userId', get_parent_dashboard);

module.exports = route;