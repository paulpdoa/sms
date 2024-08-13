const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const nationalitySchema = new mongoose.Schema({
    nationality: {
        type:String,
        required:true,
        unique:true
    },
    nationalityCode: requiredString,
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    recordStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const NationalityModel = mongoose.model('nationality',nationalitySchema);
module.exports = NationalityModel;