const User = require('../model/Users');
const Student = require('../model/Students');
const StudentSubject = require('../model/StudentSubject');
const StudentGrade = require('../model/StudentGrade');
const StudentPayment = require('../model/StudentPayment');
const StudentAttendance = require('../model/StudentAttendance');

module.exports.get_student_dashboard = async (req,res) => {
    const { session } = req.query;
    const { userId } = req.params;  

    let studentName = '';
    const today = new Date().getDay();
    // Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayValue = days[today];

    try {   
        const userExists = await User.findById(userId);
        if(!userExists) {
            return res.status(404).json({ mssg: 'This user is not existing' });
        }

        const student = await Student.findById(userExists.studentId);
        if(!student) {
            return res.status(404).json({ mssg: 'This student is not existing' });
        }
        studentName = `${student.firstName} ${student.lastName}`;

        const studentSubjects = await StudentSubject.find({ studentId: student._id, sessionId: session })
        .populate({ path: 'teacherSubjectId', populate: {
            path: 'roomNumberId teacherId'
        } })
        .populate('subjectId');

        // Sort the subjects by startTime inside teacherSubjectId
        const sortedSubjects = studentSubjects.sort((a, b) => {
            const startTimeA = a.teacherSubjectId?.startTime || '00:00';
            const startTimeB = b.teacherSubjectId?.startTime || '00:00';
            
            const [hoursA, minutesA] = startTimeA.split(':').map(Number);
            const [hoursB, minutesB] = startTimeB.split(':').map(Number);

            // Convert time to minutes for easy comparison
            const totalMinutesA = hoursA * 60 + minutesA;
            const totalMinutesB = hoursB * 60 + minutesB;

            return totalMinutesA - totalMinutesB; // Ascending order
        });

        res.status(200).json({ studentSubjects: sortedSubjects,studentName,todayValue });

    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student dashboard details' });
    }
}

module.exports.get_student_grade_detail = async (req,res) => {
    const { userId } = req.params;
    const { session } = req.query;
    let studentName = '';
    try {
        const userExists = await User.findById(userId);
        if(!userExists) {
            return res.status(404).json({ mssg: 'This user is not existing' });
        }

        const student = await Student.findById(userExists.studentId);
        if(!student) {
            return res.status(404).json({ mssg: 'This student is not existing' });
        }
        studentName = `${student.firstName} ${student.lastName}`;

        const studentSubjects = await StudentSubject.find({ studentId: student._id, sessionId: session })
        .populate({ path: 'teacherSubjectId', populate: {
            path: 'roomNumberId teacherId subjectId'
        } })
        .populate('subjectId studentId');

        const studentGrades = await StudentGrade.find({ studentId: student._id, recordStatus: 'Live' }).populate('subjectId gradingCategoryId');
        if(!studentGrades) {
            return res.status(404).json({ mssg: "You don't have grades existing yet" });
        }
        
        res.status(200).json({ studentGrades,studentName,studentSubjects });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student grade details' });
    }
}

module.exports.get_student_payment = async(req,res) => {
    const { session } = req.query;
    const { userId } = req.params;
    
    let studentName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const student = await Student.findById(user.studentId);
        if(!student) {
            return res.status(404).json({ mssg: 'Student is not exitsing' });
        }
        studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;

        // Get Student Payment Schedule
        const studentPayments = await StudentPayment.find({ studentId: student._id, recordStatus: 'Live', sessionId: session })
        .populate({ path: 'paymentScheduleId', populate: {
            path: 'paymentTermId'
        } })
        const paymentSchedules = studentPayments?.filter(studentPayment => studentPayment.paymentScheduleId);

        res.status(200).json({ studentPayments: paymentSchedules, studentName });

    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching parents child payment schedules' });
    }
}

module.exports.get_student_attendance = async (req,res) => {
    const { userId } = req.params;
    const { session,currentDate } = req.query;
    let studentName = '';
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const student = await Student.findById(user.studentId);
        if(!student) {
            return res.status(404).json({ mssg: 'Student is not exitsing' });
        }
        studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;

        const attendance = await StudentAttendance.find({ studentId: student._id, recordStatus: 'Live', sessionId: session, dateToday: currentDate });
        console.log(attendance);

        res.status(200).json({ studentName, attendance });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching students attendance details' });
    }

}