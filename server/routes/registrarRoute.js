const express = require('express');
const { get_students, add_student, delete_student, get_student_detail, submit_student_requirements } = require('../controller/registrarController');
const route = express.Router();

// Students
route.get('/students', get_students);
route.post('/students', add_student);
route.delete('/student/:id', delete_student);
route.get('/student/:id', get_student_detail);
route.put('/submit-student-requirement/:id',submit_student_requirements)

module.exports = route;