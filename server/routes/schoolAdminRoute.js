const express = require('express');
const { get_teachers, delete_teacher, get_teacher_detail, add_teacher, get_strands, add_strand, delete_strand, get_strand_detail, edit_strand, get_textbooks, add_textbook, delete_textbook, get_textbook_detail, edit_textbook, edit_teacher } = require('../controller/schoolAdminController');
const route = express.Router();
const { allowUserView,allowUserAction,upload } = require('../middleware/middlewares');

const userRoles = ['School Admin','Super Admin'];

// Teachers
route.get('/teachers',allowUserView(userRoles), get_teachers);
route.post('/teachers',upload.single('profilePicture'), add_teacher);
route.put('/teacher/:id', delete_teacher);
route.get('/teacher/:id',allowUserView(userRoles), get_teacher_detail);
route.patch('/teacher/:id',upload.single('profilePicture'),edit_teacher);

// Strand
route.get('/strands',allowUserView(userRoles),get_strands);
route.post('/strand',add_strand);
route.put('/strand/:id',delete_strand);
route.get('/strand/:id',allowUserView(userRoles),get_strand_detail);
route.patch('/strand/:id',edit_strand);

// Textbook
route.get('/textbooks',allowUserView(userRoles),get_textbooks);
route.post('/textbook',add_textbook);
route.put('/textbook/:id',delete_textbook);
route.get('/textbook/:id',allowUserView(userRoles),get_textbook_detail);
route.patch('/textbook/:id',edit_textbook);

module.exports = route;