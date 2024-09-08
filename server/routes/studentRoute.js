const express = require('express');
const route = express.Router();
const { allowUserView,allowUserAction } = require('../middleware/middlewares');
const { get_student_dashboard, get_student_grade_detail } = require('../controller/studentController');

// Dashboard
route.get('/student-dashboard/:userId', get_student_dashboard);
route.get('/student-grade/:userId', get_student_grade_detail);

module.exports = route;