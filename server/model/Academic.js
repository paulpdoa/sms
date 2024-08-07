const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const academicSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student'
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
    lastSchoolAttended: {
        type: String
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'section'
    },
    paymentTermId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'paymentTerm'
    },
    academicStatus: { // Academic status values New, Old, Transferred, or Graduated
        type: String,
    },
    passedReportCard: {
        type: Boolean
    },
    settledArrears: {
        type: Boolean
    },
    completedClearance: {
        type: Boolean
    },
    isRegistered: {
        type: Boolean,
    },
    isAdmitted: {
        type: Boolean
    },
    isEnrolled: {
        type: Boolean
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const AcademicModel = mongoose.model('academic',academicSchema);
module.exports = AcademicModel;