const Parent = require('../model/Parent');
const Student = require('../model/Students');
const StudentPayment = require('../model/StudentPayment');
const StudentSubject = require('../model/StudentSubject');
const StudentGrade = require('../model/StudentGrade');
const User = require('../model/Users');

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
        parentName = `${parent.motherName}`;
        studentName = `${parent.studentId.firstName} ${parent.studentId.middleName} ${parent.studentId.lastName}`;

        // Subjects of student
        const studentSubjects = await StudentSubject.find({ studentId: parent.studentId, sessionId: session })
        .populate({ path: 'teacherSubjectId', populate: {
            path: 'roomNumberId teacherId'
        } })
        .populate('subjectId studentId');

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

        res.status(200).json({ studentSubjects: sortedSubjects,parentName,studentName });

    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred whil fetching parents dashboard details' });
    }
}