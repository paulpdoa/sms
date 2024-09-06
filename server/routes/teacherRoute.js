const express = require('express');
const { get_student_grades, add_student_grade, get_teacher_dashboard } = require('../controller/teacherController');
const route = express.Router();
const { allowUserView,allowUserAction } = require('../middleware/middlewares');
const { get_teacher_academics } = require('../controller/registrarController');

const userRoles = ['School Admin','Super Admin', 'Teacher'];
const teacherRole = ['Teacher'];


// Teacher dashboard
route.get('/teacher-dashboard/:userId',allowUserView(teacherRole),get_teacher_dashboard);

// Teacher Academic
route.get('/teacher-academics', get_teacher_academics);

// Student Grades 
route.get('/student-grades',allowUserView(userRoles), get_student_grades);
route.post('/student-grade',allowUserAction(teacherRole), add_student_grade);

module.exports = route