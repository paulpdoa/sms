const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const academicSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student',
        unique: true
    },
    gradeLevelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'gradeLevel'
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'department'
    },
    strandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'strand'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    lastSchoolAttended: requiredString
}, { timestamps: true })

const AcademicModel = mongoose.model('academic',academicSchema);
module.exports = AcademicModel;