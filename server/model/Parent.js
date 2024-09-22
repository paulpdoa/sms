const mongoose = require('mongoose');
const validator = require('validator');

const requiredString = {
    type: String,
    required: true
}

const parentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        unique: true
    },
    motherName: {
        type:String
    },
    motherOccupation: {
        type:String
    },
    motherOffice: {
        type:String
    },
    motherContact: {
        type:String
    },
    motherEmail: {
        type:String
    },
    fatherName: {
        type:String
    },
    fatherOccupation: {
        type:String
    },
    fatherOffice: {
        type:String
    },
    fatherContact: {
        type:String
    },
    fatherEmail: {
        type:String
    },
    guardianName: {
        type:String
    },
    guardianOccupation: {
        type:String
    },
    guardianOffice: {
        type:String
    },
    guardianContact: {
        type:String
    },
    guardianEmail: {
        type:String
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    isEmployee: {
        type: Boolean
    },
    joiningDate: {
        type: String
    },
    resignedDate: {
        type: String
    },
    recordStatus: requiredString
}, { timestamps: true })

const ParentModel = mongoose.model('parent',parentSchema);
module.exports = ParentModel;