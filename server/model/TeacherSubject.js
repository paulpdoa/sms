const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const teacherSubjectSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    },
    timeSchedule: requiredString,
    roomNumberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roomNumber'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'schoolYear'
    },
    recordStatus: requiredString
}, { timestamps: true })

const TeacherSubjectModel = mongoose.model('teacherSubject',teacherSubjectSchema);
module.exports = TeacherSubjectModel;