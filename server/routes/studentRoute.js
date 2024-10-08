const express = require('express');
const route = express.Router();
const { allowUserView,allowUserAction } = require('../middleware/middlewares');
const { get_student_dashboard, get_student_grade_detail, get_student_payment, get_student_attendance } = require('../controller/studentController');

// Dashboard
route.get('/student-dashboard/:userId', get_student_dashboard);
route.get('/student-grade/:userId', get_student_grade_detail);
route.get('/student-payment-schedule/:userId', get_student_payment);

// Attendance
route.get('/student-attendance/:userId', get_student_attendance);
module.exports = route;