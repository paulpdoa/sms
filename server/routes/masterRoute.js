const express = require('express');
const route = express.Router();
const { add_religion,get_religions,delete_religion,get_religion_detail,
    get_nationalities,add_nationality,delete_nationality,get_nationality_detail,
get_genders,add_gender,delete_gender,get_gender_detail, 
get_departments,
add_departments,
delete_department,
get_department_detail,
get_sections,
add_sections,
delete_section,
get_section_detail,
get_grade_levels,
add_grade_levels,
delete_grade_level,
get_grade_level_detail,
get_requirement_detail,
delete_requirement,
add_requirements,
get_requirements,
get_roles,
add_roles,
delete_role,
get_role_detail,
delete_school_year,
get_school_year_detail,
add_school_year,
get_school_years,
get_users,
add_user,
delete_user,
get_user_detail,
edit_religion,
edit_nationality,
edit_gender,
edit_department,
edit_section,
edit_grade_level,
edit_requirement,
edit_role,
edit_school_year,
edit_user,
user_login,
get_payment_terms,
add_payment_term,
delete_payment_term,
get_payment_term_details,
edit_payment_term,
get_fee_categories,
add_fee_category,
delete_fee_category,
edit_fee_category,
get_fee_category_detail,
get_fee_codes,
add_fee_code,
delete_fee_code,
edit_fee_code,
get_parents,
get_parent_detail,
add_parent,
get_student_parent,
delete_parent,
get_academics,
add_academic,
get_siblings,
get_sibling_details,
add_sibling,
delete_sibling,
edit_sibling,
get_student_sibling,
edit_parent,
get_nationality_codes,
add_nationality_code,
get_nationality_code_detail,
edit_nationality_code,
delete_nationality_code,
close_school_year,
generate_academic_students,
get_dashboard_details,
get_live_subjects,
get_live_subject_detail,
add_subject,
edit_live_subject,
delete_live_subject,
update_all_records_live,
get_deleted_subjects,
get_room_numbers,
get_room_number_detail,
edit_room_number,
delete_room_number,
add_room_number,
get_grading_categories,
get_grading_category_details,
edit_grading_category,
delete_grading_category,
add_grading_category,
get_finance_info,
get_finance_info_detail,
add_finance_info,
delete_finance_info,
edit_finance_info,
test_delete_fees} = require('../controller/masterController');

const requireAuth = require('../middleware/requireAuth');
const { allowUserView,allowUserAction,upload } = require('../middleware/middlewares');

const userRoles = ['School Admin', 'Super Admin'];

route.post('/user-login',user_login);

//For deleting manage fees testing
route.get('/delete-manage-fees', test_delete_fees);
route.get('/update-to-live-records', update_all_records_live);

// Role
route.get('/user-roles',allowUserView(userRoles), get_roles);
route.post('/user-roles', add_roles);
route.put('/user-role/:id', delete_role);
route.get('/user-role/:id',allowUserView(userRoles), get_role_detail);
route.patch('/user-role/:id',edit_role);

// Religion
route.get('/religions',allowUserView(userRoles),get_religions);
route.post('/religions',allowUserAction(userRoles),add_religion);
route.put('/religion/:id', delete_religion);
route.get('/religion/:id',allowUserView(userRoles), get_religion_detail);
route.patch('/religion/:id',allowUserAction(userRoles),edit_religion);

// Nationality
route.get('/nationalities',allowUserView(userRoles),get_nationalities);
route.post('/nationalities',allowUserAction(userRoles), add_nationality);
route.put('/nationality/:id',allowUserAction(userRoles), delete_nationality);
route.get('/nationality/:id',allowUserView(userRoles), get_nationality_detail);
route.patch('/nationality/:id',allowUserAction(userRoles),edit_nationality);

// Nationality Code
// route.get('/nationality-codes',allowUserView(userRoles),get_nationality_codes);
// route.post('/nationality-code',add_nationality_code);
// route.get('/nationality-code/:id',allowUserView(userRoles),get_nationality_code_detail);
// route.patch('/nationality-code/:id',edit_nationality_code);
// route.put('/nationality-code/:id',delete_nationality_code);

// Gender
// route.get('/genders',allowUserView(userRoles), get_genders);
// route.post('/genders', add_gender);
// route.put('/gender/:id', delete_gender);
// route.get('/gender/:id',allowUserView(userRoles), get_gender_detail);
// route.patch('/gender/:id',edit_gender);

// Department
route.get('/departments',allowUserView(userRoles), get_departments);
route.post('/departments', add_departments);
route.put('/department/:id', delete_department);
route.get('/department/:id',allowUserView(userRoles), get_department_detail);
route.patch('/department/:id',edit_department);

// Section
route.get('/sections',allowUserView(userRoles), get_sections);
route.post('/sections', add_sections);
route.put('/section/:id', delete_section);
route.get('/section/:id',allowUserView(userRoles), get_section_detail);
route.patch('/section/:id',edit_section);

// Live Subject
route.get('/subjects',get_live_subjects);
route.get('/subject/:id',get_live_subject_detail);
route.post('/subject',add_subject);
route.patch('/subject/:id',edit_live_subject);
route.put('/subject/:id',delete_live_subject);

// Delete Subjects
route.get('/deleted-subjects',get_deleted_subjects);

// GradeLevel
route.get('/grade-levels',allowUserView(userRoles), get_grade_levels);
route.post('/grade-levels', add_grade_levels);
route.put('/grade-level/:id', delete_grade_level);
route.get('/grade-level/:id',allowUserView(userRoles), get_grade_level_detail);
route.patch('/grade-level/:id',edit_grade_level);

// Requirement
route.get('/requirements',allowUserView(userRoles), get_requirements);
route.post('/requirements', add_requirements);
route.put('/requirement/:id', delete_requirement);
route.get('/requirement/:id',allowUserView(userRoles), get_requirement_detail);
route.patch('/requirement/:id',edit_requirement);

// School Year
route.get('/school-years',get_school_years);
route.post('/school-year', add_school_year);
route.put('/school-year/:id', delete_school_year);
route.get('/school-year/:id', get_school_year_detail);
route.patch('/school-year/:id',edit_school_year);
route.patch('/close-school-year',close_school_year);

// User
route.get('/users',allowUserView(userRoles), get_users);
route.post('/user', add_user);
route.put('/user/:id', delete_user);
route.get('/user/:id',allowUserView(userRoles), get_user_detail);
route.patch('/user/:id',upload.single('profilePicture'),edit_user);

// Payment Term
route.get('/payment-terms',allowUserView(userRoles), get_payment_terms);
route.post('/payment-term', add_payment_term);
route.put('/payment-term/:id', delete_payment_term);
route.get('/payment-term/:id',allowUserView(userRoles), get_payment_term_details);
route.patch('/payment-term/:id',edit_payment_term);

// Fee Category
route.get('/fee-categories',allowUserView(userRoles), get_fee_categories);
route.post('/fee-category',add_fee_category);
route.put('/fee-category/:id',delete_fee_category);
route.patch('/fee-category/:id',edit_fee_category);
route.get('/fee-category/:id',allowUserView(userRoles),get_fee_category_detail);

// Fee Code
route.get('/fee-codes',allowUserView(userRoles),get_fee_codes);
route.post('/fee-code',allowUserView(userRoles),add_fee_code);
route.put('/fee-code/:id',delete_fee_code);
route.patch('/fee-code/:id',edit_fee_code);

// Parent
route.get('/parents',get_parents);
route.get('/parent/:id',get_parent_detail);
route.get('/student/parent/:id',allowUserView(userRoles),get_student_parent);
route.post('/parent',upload.single('profilePicture'),add_parent);
route.put('/parent/:id',delete_parent);
route.patch('/parent/:id',upload.single('profilePicture'),edit_parent);

// Sibling
route.get('/siblings',allowUserView(userRoles),get_siblings);
route.get('/sibling/:id',allowUserView(userRoles),get_sibling_details);
route.get('/sibling/student/:id',allowUserView(userRoles),get_student_sibling);
route.post('/sibling',add_sibling);
route.put('/sibling/:id',delete_sibling);
route.patch('/sibling/:id',edit_sibling);

// Room Number
route.get('/room-numbers', get_room_numbers);
route.get('/room-number/:id', get_room_number_detail);
route.patch('/room-number/:id', edit_room_number);
route.put('/room-number/:id', delete_room_number);
route.post('/room-number', add_room_number);

// Grading Category
route.get('/grading-categories', get_grading_categories);
route.get('/grading-category/:id', get_grading_category_details);
route.patch('/grading-category/:id', edit_grading_category);
route.put('/grading-category/:id',delete_grading_category);
route.post('/grading-category', add_grading_category);

// Finance
route.get('/finance', get_finance_info);
route.get('/finance/:id', get_finance_info_detail);
route.post('/finance',upload.single('profilePicture'),add_finance_info);
route.put('/finance/:id', delete_finance_info);
route.patch('/finance/:id',upload.single('profilePicture') ,edit_finance_info);

// Dashboard
route.get('/dashboard/:sessionId',get_dashboard_details);

//For test data
route.get('/generate-academic-data',generate_academic_students);

module.exports = route;