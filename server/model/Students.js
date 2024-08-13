const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const requiredString = {
    type: String,
    required: true
}

const studentSchema = new mongoose.Schema({
    sy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    academicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'academic'
    },
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gradeLevel'
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section'
    },
    lrn: {
        type: Number
    },
    studentNo: {
        type: String
    },
    firstName:requiredString,
    lastName: requiredString,
    middleName: {
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    suffix: {
        type: String
    },
    dateOfBirth: requiredString,
    nationality: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'nationality' 
    },
    placeOfBirth: requiredString,
    age: {
        type: Number
    },
    sex: requiredString,
    religion: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'religion' 
    },
    contactNumber: requiredString,
    address: requiredString,
    isAdmitted: {
        type: Boolean
    },
    dateAdmitted: {
        type: Date
    },
    isRegistered: {
        type: Boolean
    },
    dateRegistered: {
        type: Date
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
    bloodType: {
        type: String
    },
    inputter:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    recordStatus: requiredString
},{ timestamps: true })

const StudentModel = mongoose.model('student',studentSchema);
module.exports = StudentModel;