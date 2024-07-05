const express = require('express');
const { get_students, add_student, delete_student, get_student_detail, submit_student_requirements, get_admission, add_admission, get_admission_student, update_student_info, get_academics, add_academic, get_student_academic_detail, get_student_academic, delete_academic, get_discounts, get_discount_detail, add_discount, delete_discount, edit_discount, get_student_discounts, get_student_discount_detail, get_discounts_of_student, delete_student_discount, add_student_discount, get_sectioning, add_sectioning, get_manage_fees, add_manage_fees, get_manage_fee_detail, delete_manage_fee, edit_manage_fee, generate_fees, get_student_payments, get_student_payment_detail, get_payment_schedule, add_payment_schedule, delete_generated_fees } = require('../controller/registrarController');
const route = express.Router();
const { allowUserAction,allowUserView } = require('../middleware/middlewares');

const userRoles = ['Super Admin', 'School Admin', 'Registrar']

// Students
route.get('/students',allowUserView(userRoles), get_students);
route.post('/students', add_student);
route.delete('/student/:id', delete_student);
route.get('/student/:id',allowUserView(userRoles), get_student_detail);
route.patch('/student/:id',update_student_info);

// Admission
route.get('/admissions',allowUserView(userRoles),get_admission);
route.post('/admission',add_admission);
route.get('/admission/:student',allowUserView(userRoles),get_admission_student);

// Academic
route.get('/academics',allowUserView(userRoles),get_academics);
route.post('/academic',add_academic);
route.get('/academic/student/:studentId',allowUserView(userRoles),get_student_academic_detail);
route.get('/academic/students',allowUserView(userRoles),get_student_academic);
route.delete('/academic/:id',delete_academic);

// Discount
route.get('/discounts',allowUserView(userRoles),get_discounts);
route.get('/discount/:id',allowUserView(userRoles),get_discount_detail);
route.post('/discount',add_discount);
route.delete('/discount/:id',delete_discount);
route.patch('/discount/:id',edit_discount);

// Student Discount
route.get('/student-discounts',allowUserView(userRoles),get_student_discounts);
route.get('/student-discount/:id',allowUserView(userRoles),get_student_discount_detail);
route.get('/student-discount/student/:studentId',allowUserView(userRoles),get_discounts_of_student);
route.delete('/student-discount/:id',delete_student_discount);
route.post('/student-discount',add_student_discount);

// Sectionings
route.get('/sectionings',allowUserView(userRoles), get_sectioning);
route.post('/sectioning',add_sectioning);

// Manage Fee
route.get('/manage-fees',allowUserView(userRoles),get_manage_fees);
route.post('/manage-fee',add_manage_fees);
route.get('/manage-fee/:id',allowUserView(userRoles),get_manage_fee_detail);
route.delete('/manage-fee/:id',delete_manage_fee);
route.patch('/manage-fee/:id',edit_manage_fee);
route.get('/generate-fees/:currentYear',allowUserView(userRoles),generate_fees);

// Student Payment
route.get('/student-payments',allowUserView(userRoles),get_student_payments);
route.get('/student-payment/:id',allowUserView(userRoles),get_student_payment_detail);     
route.delete('/delete-student-payments',delete_generated_fees); 

// Payment Schedule
route.get('/payment-schedules',allowUserView(userRoles),get_payment_schedule);
route.post('/payment-schedule',add_payment_schedule);

module.exports = route;