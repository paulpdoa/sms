const express = require('express');
const { get_student_grades, add_student_grade } = require('../controller/teacherController');
const route = express.Router();

// Student Grades 
route.get('/student-grades', get_student_grades);
route.post('/student-grade', add_student_grade);

module.exports = route