const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const requiredString = {
    type: String,
    required: true
}

const teacherSchema = new mongoose.Schema({
    firstName: requiredString,
    middleName: requiredString,
    lastName: requiredString,
    dateOfBirth: requiredString,
    placeOfBirth: requiredString,
    address: requiredString,
    religion: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'religion' 
    },
    sex: requiredString,
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
    contactNumber: {
        type: String
    },
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
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    recordStatus: requiredString

}, { timestamps: true });

// teacherSchema.pre('save', async function(next) {
//     const salt = await bcrypt.genSalt();

//     if(!validator.isStrongPassword(this.password)) {
//         throw Error('Password not strong enough, please create stronger password');
//     }

//     this.password = await bcrypt.hash(this.password,salt);
//     next();
// });

const TeacherModel = mongoose.model('teacher',teacherSchema);
module.exports = TeacherModel;