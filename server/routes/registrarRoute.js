const express = require('express');
const { get_students, add_student, delete_student, get_student_detail, submit_student_requirements, get_admission, add_admission, get_admission_student, update_student_info, get_academics, add_academic, get_student_academic_detail, get_student_academic, delete_academic, get_discounts, get_discount_detail, add_discount, delete_discount, edit_discount } = require('../controller/registrarController');
const route = express.Router();

// Students
route.get('/students', get_students);
route.post('/students', add_student);
route.delete('/student/:id', delete_student);
route.get('/student/:id', get_student_detail);
route.patch('/student/:id',update_student_info);

// Admission
route.get('/admissions',get_admission);
route.post('/admission',add_admission);
route.get('/admission/:student',get_admission_student);

// Academic
route.get('/academics',get_academics);
route.post('/academic',add_academic);
route.get('/academic/student/:studentId',get_student_academic_detail);
route.get('/academic/students',get_student_academic);
route.delete('/academic/:id',delete_academic);

// Discount
route.get('/discounts',get_discounts);
route.get('/discount/:id',get_discount_detail);
route.post('/discount',add_discount);
route.delete('/discount/:id',delete_discount);
route.patch('/discount/:id',edit_discount);

module.exports = route;