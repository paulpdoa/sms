const express = require('express');
const route = express.Router();
const { allowUserView,allowUserAction } = require('../middleware/middlewares');
const { get_parent_dashboard, get_parent_child_grades, get_parent_child_payment, get_parent_child_attendance } = require('../controller/parentController');

// Dashboard
route.get('/parent-dashboard/:userId', get_parent_dashboard);
// Grades
route.get('/parent-child-grades/:userId', get_parent_child_grades);
// Payment Schedule
route.get('/parent-child-payment-schedule/:userId', get_parent_child_payment);
// Attendance
route.get('/parent-child-attendance/:userId',get_parent_child_attendance);

module.exports = route;