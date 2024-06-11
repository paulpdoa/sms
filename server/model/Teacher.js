const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const teacherSchema = new mongoose.Schema({
    firstName: requiredString,
    middleName: requiredString,
    lastName: requiredString,
    dateOfBirth: requiredString,
    address: requiredString,
    religion: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'religion' 
    },
    sex: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gender' 
    },
    nationality: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'nationality' 
    },
    age: {
        type: Number
    },
    spouseName: { 
        type: String
    },
    spouseCel: {
        type: String
    },
    education: requiredString,
    yearGraduated: requiredString,
    schoolGraduated: requiredString,
    yearsOfExperience: {
        type: Number,
        required: true
    },
    joiningDate: requiredString,
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'department' 
    },
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gradeLevel' 
    },
    section: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'section' 
    },
    email: requiredString,
    socMedAcct: {
        type: String
    },
    username: requiredString,
    password: requiredString

}, { timestamps: true })

const TeacherModel = mongoose.model('teacher',teacherSchema);
module.exports = TeacherModel;