const StudentGrade = require('../model/StudentGrade');
const User = require('../model/Users');
const Teacher = require('../model/Teacher');
const TeacherSubject = require('../model/TeacherSubject');
const TeacherAcademic = require('../model/TeacherAcademic');
const Session = require('../model/SchoolYear');
const StudentSubject = require('../model/StudentSubject');
const StudentAttendance = require('../model/StudentAttendance');

module.exports.get_teacher_dashboard = async(req,res) => {
    const { session } = req.query;
    const { userId } = req.params;  

    const today = new Date().getDay();
    // Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayValue = days[today];
    
    try {   

        const teacherId = await User.findById(userId);
        if (!teacherId) {
            return res.status(404).json({ mssg: 'This user id is not a teacher or user is not existing' });
        }

        const teacherFound = await Teacher.findById(teacherId.teacherId);
        if (!teacherFound) {
            return res.status(404).json({ mssg: `${teacherId.username} is not a valid teacher and is not existing record` });
        }
        const teacherName = `${teacherFound.firstName} ${teacherFound.lastName}`;

        const teacherSubjects = await TeacherSubject.find({ teacherId: teacherId.teacherId, recordStatus: 'Live', sessionId: session })
        .populate('subjectId teacherId roomNumberId')

        const teacherAcademics = await TeacherAcademic.find({ recordStatus: 'Live', sessionId: session }).populate('teacherSubjectId');

        const teacherAllAcademicRecords = [];

        for(const teacherAcademic of teacherAcademics) {
            // If the teachers logged in id is here, then get all his academic record
            if(teacherId.teacherId.equals(teacherAcademic.teacherSubjectId.teacherId) && teacherAcademic.sessionId.equals(session)) {
                teacherAllAcademicRecords.push(teacherAcademic);
            } 
        }

        res.status(200).json({ teacherSubjects,teacherName,todayValue }); // Example success response
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching teacher dashboard details' });
    }
}

module.exports.get_student_grades = async (req,res) => {
    const { session } = req.query;

    try {
        const studentGrades = await StudentGrade.find({ recordStatus: 'Live', sessionId: session })
        .populate('studentId subjectId gradingCategoryId')

        if(!studentGrades) {
            return res.status(404).json({ mssg: 'Student grades is empty' });
        }

        res.status(200).json(studentGrades);
;
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student grade records' })
    }
}

module.exports.add_student_grade = async (req, res) => {
    const {
        studentId,
        subjectId,
        gradingCategoryId,
        academicPeriod,
        dateTaken,
        dueDate,
        taskTotal,
        passingScore,
        gradeRemark,
        remarks,
        studentScore,
        inputter,
        sessionId
    } = req.body;

    if(taskTotal < 1 || passingScore < 0 || studentScore < 0) {
        return res.status(400).json({ mssg: 'Scores cannot be a negative number' });
    }

    // Check if any required field is missing or empty
    const requiredFields = {
        studentId,
        subjectId,
        gradingCategoryId,
        academicPeriod,
        dateTaken,
        taskTotal,
        passingScore,
        gradeRemark,
        remarks,
        studentScore
    };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === null || value === '') {
            return res.status(400).json({ mssg: `${key} is required and cannot be empty` });
        }
    }

    // If all checks pass, proceed with creating the record
    try {
        await StudentGrade.create({
            studentId,
            subjectId,
            gradingCategoryId,
            academicPeriod,
            dateTaken,
            dueDate,
            taskTotal,
            passingScore,
            gradeRemark,
            remarks,
            studentScore,
            inputter, // assuming you have the inputter from the authenticated user
            sessionId, // assuming you have the session ID
            recordStatus: 'Live'
        });

        res.status(200).json({ mssg: 'Student grade added successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mssg: 'An error occurred while adding student grade' });
    }
};

module.exports.get_teacher_student_attendance = async (req, res) => {
    const { session, month, year } = req.query;  
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        const teacher = await Teacher.findById(user.teacherId)
            .populate({ path: 'teacherAcademicId', populate: { path: 'teacherSubjectId' } });
        
        const teacherStudents = await StudentSubject.find({ recordStatus: 'Live', sessionId: session })
        .populate('teacherSubjectId studentId')
        // .distinct('studentId'); // This ensures you only get unique student IDs

        const teacherStudentLists = teacherStudents.filter(student => student.teacherSubjectId.teacherId.equals(teacher._id));
        
        // Filter attendance records for the selected month and year
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const attendanceData = await StudentAttendance.find({
            sessionId: session,
            recordStatus: 'Live',
            // dateToday: { $gte: startOfMonth, $lte: endOfMonth }
        });
        console.log(attendanceData);

        res.status(200).json({
            teacherStudentLists,
            teacherName: `${teacher.firstName} ${teacher.lastName}`,
            attendanceData // Send filtered attendance data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred while fetching students attendance records' });
    }
};


module.exports.add_students_attendance = async (req, res) => {
    const { attendanceData, selectedMonth, selectedYear, sessionId, inputter } = req.body;

    console.log('Attendance Data: ',req.body.attendanceData);

    if (!attendanceData || !sessionId || !selectedMonth || !selectedYear || !inputter) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const attendanceRecords = [];

        for (const [studentId, attendanceDays] of Object.entries(attendanceData)) {
            for (const [day, remarks] of Object.entries(attendanceDays)) {
                const dayNumber = parseInt(day.replace('day', ''));
                const dateToday = `${selectedYear}-${String(selectedMonth).padStart(2,'0')}-${String(dayNumber).padStart(2,'0')}`
               
                console.log(dateToday);

                const attendanceRecord = new StudentAttendance({
                    dateToday,
                    remarks,
                    sessionId,
                    studentId,
                    inputter,
                    recordStatus: 'Live'
                });

                attendanceRecords.push(attendanceRecord);
            }
        }

        const savedRecords = await StudentAttendance.insertMany(attendanceRecords);

        // Respond with the saved records
        res.status(201).json({ message: 'Attendance records successfully saved', attendanceRecords: savedRecords });
    } catch (error) {
        console.error('Error saving attendance:', error);
        res.status(500).json({ message: 'Error saving attendance records' });
    }
};



