const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const financeSchema = new mongoose.Schema({
    firstName: requiredString,
    middleName: requiredString,
    lastName: requiredString,
    dateOfBirth: requiredString,
    placeOfBirth: requiredString,
    address: requiredString,
    religionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'religion' 
    },
    sex: requiredString,
    nationalityId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'nationality' 
    },
    age: {
        type: Number
    },
    contactNumber: {
        type: String
    },
    email: requiredString,
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    profilePictureUrl: {
        type: String
    },
    recordStatus: requiredString

}, { timestamps: true });


const FinanceModel = mongoose.model('finance',financeSchema);
module.exports = FinanceModel;