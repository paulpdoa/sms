const express = require('express');
const { get_student_grades, add_student_grade, get_teacher_dashboard,get_teacher_student_attendance, add_students_attendance, get_students_in_section, edit_students_attendance, get_teacher_loggedin_subject, edit_student_grade, get_teacher_loggedin_section } = require('../controller/teacherController');
const route = express.Router();
const { allowUserView,allowUserAction } = require('../middleware/middlewares');
const { get_teacher_academics } = require('../controller/registrarController');

const StudentAttendance = require('../model/StudentAttendance');

const userRoles = ['School Admin','Super Admin', 'Teacher'];
const teacherRole = ['Teacher'];


// Teacher dashboard
route.get('/teacher-dashboard/:userId',allowUserView(teacherRole),get_teacher_dashboard);

// Teacher Academic
route.get('/teacher-academics', get_teacher_academics);

// Student Grades 
route.get('/student-grades',allowUserView(userRoles), get_student_grades);
route.post('/student-grade',allowUserAction(teacherRole), add_student_grade);
route.patch('/student-grade/:id',allowUserAction(teacherRole),edit_student_grade);

// Teachers Subject
route.get('/teachers-subject/:userId', get_teacher_loggedin_subject);

// Students attendance
route.get('/teacher-student-attendance/:userId', get_teacher_student_attendance);
route.post('/teacher-student-attendance', add_students_attendance);
route.patch('/teacher-student-update-attendance/:id', edit_students_attendance);

// Get teacher section
route.get('/teacher-loggedin-section/:userId',get_teacher_loggedin_section);

route.get('/teachers-section/:userId', get_students_in_section);

// For Testing deletion of StudentAttendance
route.get('/delete-student-attendance', async(req,res) => {
    try {
        await StudentAttendance.deleteMany();
        res.status(201).json({ mssg: 'Students attendance has been deleted' });
    } catch(err) {
        console.log(err)
    }
})

module.exports = route