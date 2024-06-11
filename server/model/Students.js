const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const requiredString = {
    type: String,
    required: true
}

const studentSchema = new mongoose.Schema({
    sy_id: {
        type: String
    },
    gradeLevel: {
        type: String
    },
    section: {
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
    sex:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gender' 
    },
    religion: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'religion' 
    },
    contactNumber: requiredString,
    address: requiredString
}, { timestamps: true })

const StudentModel = mongoose.model('student',studentSchema);
module.exports = StudentModel;