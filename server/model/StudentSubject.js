const mongoose = require('mongoose');

const studentSubjectSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    recordStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const StudentSubjectSchema = mongoose.model('studentDiscount',studentSubjectSchema);
module.exports = StudentSubjectSchema;