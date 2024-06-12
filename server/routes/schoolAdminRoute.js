const express = require('express');
const { get_teachers, delete_teacher, get_teacher_detail, add_teacher, get_strands, add_strand, delete_strand, get_strand_detail, edit_strand, get_textbooks, add_textbook, delete_textbook, get_textbook_detail, edit_textbook } = require('../controller/schoolAdminController');
const route = express.Router();

// Teachers
route.get('/teachers', get_teachers);
route.post('/teachers', add_teacher);
route.delete('/teacher/:id', delete_teacher);
route.get('/teacher/:id', get_teacher_detail);

// Strand
route.get('/strands',get_strands);
route.post('/strand',add_strand);
route.put('/strand/:id',delete_strand);
route.get('/strand/:id',get_strand_detail);
route.patch('/strand/:id',edit_strand);

// Textbook
route.get('/textbooks',get_textbooks);
route.post('/textbook',add_textbook);
route.put('/textbook/:id',delete_textbook);
route.get('/textbook/:id',get_textbook_detail);
route.patch('/textbook/:id',edit_textbook);

module.exports = route;