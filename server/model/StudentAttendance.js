const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const studentAttendanceSchema = new mongoose.Schema({
    dateToday: {
        type: Date,
        required: true
    },
    remarks: requiredString,
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String
    },
    recordStatus: requiredString
}, { timestamps: true })

const StudentAttendanceModel = mongoose.model('studentAttendance',studentAttendanceSchema);
module.exports = StudentAttendanceModel;