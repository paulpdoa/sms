const mongoose = require('mongoose');

const studentGradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    },
    category: {
        type: String,
        required: true
    },
    dateTaken: {
        type: String,
        required: true
    },
    studentScore: {
        type: Number,
        required: true
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

const StudentGradeSchema = mongoose.model('studentGrade',studentGradeSchema);
module.exports = StudentGradeSchema;