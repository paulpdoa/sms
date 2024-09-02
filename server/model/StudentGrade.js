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
    gradingCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gradingCategory'
    },
    academicPeriod: { //(1st Grading, 2nd Grading,3rd Grading,4th Grading)
        type: String,
        required: true
    },
    dateTaken: {
        type: String,
        required: true
    },
    dueDate: { // Optional field
        type: String
    },
    taskTotal: {
        type: Number,
        required: true
    },
    passingScore: {
        type: Number,
        required: true
    },
    gradeRemark: { // Passed or failed
        type: String,
        required: true
    },
    remarks: {
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