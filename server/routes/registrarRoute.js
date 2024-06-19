const express = require('express');
const { get_students, add_student, delete_student, get_student_detail, submit_student_requirements, get_admission, add_admission, get_admission_student } = require('../controller/registrarController');
const route = express.Router();

// Students
route.get('/students', get_students);
route.post('/students', add_student);
route.delete('/student/:id', delete_student);
route.get('/student/:id', get_student_detail);

// Admission
route.get('/admissions',get_admission);
route.post('/admission',add_admission);
route.get('/admission/:student',get_admission_student);

module.exports = route;