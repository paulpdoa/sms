const Parent = require('../model/Parent');
const Student = require('../model/Students');
const StudentPayment = require('../model/StudentPayment');
const StudentSubject = require('../model/StudentSubject');
const StudentGrade = require('../model/StudentGrade');
const User = require('../model/Users');
const StudentAttendance = require('../model/StudentAttendance');

module.exports.get_parent_dashboard = async (req,res) => {
    const { session } = req.query;
    const { userId } = req.params;
    let parentName = '';
    let studentName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const parent = await Parent.findById(user.parentId).populate('studentId');
        if(!parent) {
            return res.status(404).json({ mssg: 'Parent is not existing' });
        }
        parentName = user.username;

        // studentName = `${parent.studentId.firstName} ${parent.studentId.middleName} ${parent.studentId.lastName}`;
        let combinedSubjects = [];
        const studentLists = parent.studentId;
        for(const student of studentLists) {
            // console.log('Subjects of: ', student.firstName);
            const studentSubjects = await StudentSubject.find({ studentId: student._id, sessionId: session })
            .populate({ path: 'teacherSubjectId', populate: {
                path: 'roomNumberId teacherId'
            } })
            .populate('subjectId studentId');

            // console.log('Subjects Fetched: ', studentSubjects);
            combinedSubjects = [...combinedSubjects, ...studentSubjects];
        }

        // Sort the subjects by startTime inside teacherSubjectId
        const sortedSubjects = combinedSubjects.sort((a, b) => {
            const startTimeA = a.teacherSubjectId?.startTime || '00:00';
            const startTimeB = b.teacherSubjectId?.startTime || '00:00';
            
            const [hoursA, minutesA] = startTimeA.split(':').map(Number);
            const [hoursB, minutesB] = startTimeB.split(':').map(Number);

            // Convert time to minutes for easy comparison
            const totalMinutesA = hoursA * 60 + minutesA;
            const totalMinutesB = hoursB * 60 + minutesB;

            return totalMinutesA - totalMinutesB; // Ascending order
        });

        res.status(200).json({ studentSubjects: sortedSubjects,parentName,parent,students: studentLists });

    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching parents dashboard details' });
    }
}

module.exports.get_parent_child_grades = async (req,res) => {
    const { session } = req.query;
    const { userId } = req.params;
    let parentName = '';
    let studentName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const parent = await Parent.findById(user.parentId).populate('studentId');
        if(!parent) {
            return res.status(404).json({ mssg: 'Parent is not existing' });
        }
        parentName = user.username;
        // Subjects of student

        // studentName = `${parent.studentId.firstName} ${parent.studentId.middleName} ${parent.studentId.lastName}`;
        let combinedSubjects = [];
        let combinedGrades = [];
        const studentLists = parent.studentId;
        for(const student of studentLists) {
            // console.log('Subjects of: ', student.firstName);
            const studentSubjects = await StudentSubject.find({ studentId: student._id, sessionId: session })
            .populate({ path: 'teacherSubjectId', populate: {
                path: 'roomNumberId teacherId'
            } })
            .populate('subjectId studentId');

            // console.log('Subjects Fetched: ', studentSubjects);
            combinedSubjects = [...combinedSubjects, ...studentSubjects];

            const studentGrades = await StudentGrade.find({ studentId: student._id, recordStatus: 'Live', sessionId: session })
            .populate('subjectId gradingCategoryId studentId');
            combinedGrades = [...combinedGrades, ...studentGrades];
        }

        console.log('Combined Grades: ',combinedGrades)
        // Sort the subjects by startTime inside teacherSubjectId
        const sortedSubjects = combinedSubjects.sort((a, b) => {
            const startTimeA = a.teacherSubjectId?.startTime || '00:00';
            const startTimeB = b.teacherSubjectId?.startTime || '00:00';
            
            const [hoursA, minutesA] = startTimeA.split(':').map(Number);
            const [hoursB, minutesB] = startTimeB.split(':').map(Number);

            // Convert time to minutes for easy comparison
            const totalMinutesA = hoursA * 60 + minutesA;
            const totalMinutesB = hoursB * 60 + minutesB;

            return totalMinutesA - totalMinutesB; // Ascending order
        });

        res.status(200).json({ studentSubjects: sortedSubjects,parentName,studentName,studentGrades: combinedGrades, studentLists });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching parents child grades' });
    }
}

module.exports.get_parent_child_payment = async(req,res) => {
    const { session } = req.query;
    const { userId } = req.params;
    let parentName = '';
    let studentName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const parent = await Parent.findById(user.parentId).populate('studentId');
        if(!parent) {
            return res.status(404).json({ mssg: 'Parent is not existing' });
        }
        parentName = `${parent.motherName}`;

        const studentLists = parent.studentId;

        let combinedPayments = [];
        for(const student of studentLists) {
            const studentPayments = await StudentPayment.find({ studentId: student._id, recordStatus: 'Live', sessionId: session })
            .populate({ path: 'paymentScheduleId', populate: {
                path: 'paymentTermId'
            } })
            combinedPayments = [...combinedPayments,...studentPayments];
        }
        const paymentSchedules = combinedPayments?.filter(studentPayment => studentPayment.paymentScheduleId);

        res.status(200).json({ studentPayments: paymentSchedules, parentName,students: studentLists });

    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching parents child payment schedules' });
    }
}

module.exports.get_parent_child_attendance = async(req,res) => {
    const { session,currentDate } = req.query;
    const { userId } = req.params;
    let parentName = '';
    let studentName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const parent = await Parent.findById(user.parentId).populate('studentId');
        if(!parent) {
            return res.status(404).json({ mssg: 'Parent is not existing' });
        }
        parentName = `${parent.motherName}`;

        const studentLists = parent.studentId;

        let combinedAttendance = [];
        for(const student of studentLists) {
            const studentAttendance = await StudentAttendance.find({ studentId: student._id, sessionId: session, recordStatus: 'Live',dateToday: currentDate })
            .populate('subjectId studentId');

            combinedAttendance = [...combinedAttendance,...studentAttendance];
        }

        res.status(200).json({ parentName,studentName,studentsAttendance: combinedAttendance, students: studentLists });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching parents child attendance' });
    }
}