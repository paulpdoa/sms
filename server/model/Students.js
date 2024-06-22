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
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gradeLevel'
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section'
    },
    lrn: {
        type: String
    },
    studentNo: {
        type: String
    },
    firstName:requiredString,
    lastName: requiredString,
    middleName: requiredString,
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
    sex: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gender' 
    },
    religion: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'religion' 
    },
    contactNumber: requiredString,
    address: requiredString,
    status: requiredString,
    isAdmitted: {
        type: Boolean,
        required: true
    },
    dateAdmitted: {
        type: String
    }

}, { timestamps: true })

const StudentModel = mongoose.model('student',studentSchema);
module.exports = StudentModel;