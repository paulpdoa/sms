const express = require('express');
const { get_teachers, delete_teacher, get_teacher_detail, add_teacher } = require('../controller/schoolAdminController');
const route = express.Router();

// Teachers
route.get('/teachers', get_teachers);
route.post('/teachers', add_teacher);
route.delete('/teacher/:id', delete_teacher);
route.get('/teacher/:id', get_teacher_detail);

module.exports = route;