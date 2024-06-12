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
user_login} = require('../controller/masterController');

const requireAuth = require('../middleware/requireAuth');

route.post('/user-login',user_login);

// Role
route.get('/user-roles', get_roles);
route.post('/user-roles', add_roles);
route.delete('/user-role/:id', delete_role);
route.get('/user-role/:id', get_role_detail);
route.patch('/user-role/:id',edit_role);


// require auth for all workout routes
// route.use(requireAuth)

// Religion
route.get('/religions',get_religions);
route.post('/religions', add_religion);
route.delete('/religion/:id', delete_religion);
route.get('/religion/:id', get_religion_detail);
route.patch('/religion/:id',edit_religion);

// Nationality
route.get('/nationalities', get_nationalities);
route.post('/nationalities', add_nationality);
route.delete('/nationality/:id', delete_nationality);
route.get('/nationality/:id', get_nationality_detail);
route.patch('/nationality/:id',edit_nationality);

// Gender
route.get('/genders', get_genders);
route.post('/genders', add_gender);
route.delete('/gender/:id', delete_gender);
route.get('/gender/:id', get_gender_detail);
route.patch('/gender/:id',edit_gender);

// Department
route.get('/departments', get_departments);
route.post('/departments', add_departments);
route.delete('/department/:id', delete_department);
route.get('/department/:id', get_department_detail);
route.patch('/department/:id',edit_department);

// Section
route.get('/sections', get_sections);
route.post('/sections', add_sections);
route.delete('/section/:id', delete_section);
route.get('/section/:id', get_section_detail);
route.patch('/section/:id',edit_section);

// GradeLevel
route.get('/grade-levels', get_grade_levels);
route.post('/grade-levels', add_grade_levels);
route.delete('/grade-level/:id', delete_grade_level);
route.get('/grade-level/:id', get_grade_level_detail);
route.patch('/grade-level/:id',edit_grade_level);

// Requirement
route.get('/requirements', get_requirements);
route.post('/requirements', add_requirements);
route.delete('/requirement/:id', delete_requirement);
route.get('/requirement/:id', get_requirement_detail);
route.patch('/requirement/:id',edit_requirement);



// School Year
route.get('/school-years', get_school_years);
route.post('/school-year', add_school_year);
route.delete('/school-year/:id', delete_school_year);
route.get('/school-year/:id', get_school_year_detail);
route.patch('/school-year/:id',edit_school_year);

// User
route.get('/users', get_users);
route.post('/user', add_user);
route.delete('/user/:id', delete_user);
route.get('/user/:id', get_user_detail);
route.patch('/user/:id',edit_user);

module.exports = route;