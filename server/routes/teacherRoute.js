const express = require('express');
const { get_student_grade, add_student_grade } = require('../controller/teacherController');
const route = express.Router();

// Student Grades 
route.get('/student-grade', get_student_grade);
route.post('/student-grade', add_student_grade);

module.exports = route