const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const manageFeeSchema = new mongoose.Schema({
    sy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    gradeLevelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gradeLevel'
    },
    strandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'strand'
    },
    feeDescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feeCode'
    },
    amount: {
        type: Number,
        required: true
    },
    nationalityCodeId   : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nationalityCode'
    },
    isApplied: {
        type: Boolean
    }
}, { timestamps: true })

const ManageFeeModel = mongoose.model('manageFee',manageFeeSchema);
module.exports = ManageFeeModel;