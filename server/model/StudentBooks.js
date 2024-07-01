const mongoose = require('mongoose');
const validator = require('validator');

const requiredString = {
    type: String,
    required: true
}

const studentBookSchema = new mongoose.Schema({
    sy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    gradeLevelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'gradeLevel'
    },
    feeCodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'feeCode'
    },
    manageFeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manageFee'
    }
}, { timestamps: true })

const StudentBookModel = mongoose.model('studentBook',studentBookSchema);
module.exports = StudentBookModel;