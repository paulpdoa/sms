const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const studentAttendanceSchema = new mongoose.Schema({
    dateToday: requiredString,
    remarks: requiredString,
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recordStatus: requiredString
}, { timestamps: true })

const StudentAttendanceModel = mongoose.model('studentAttendance',studentAttendanceSchema);
module.exports = StudentAttendanceModel;