const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
}

const feeCodeSchema = new mongoose.Schema({
    description: requiredString,
    code: requiredString,
    feeCateg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feeCategory'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    recordStatus: requiredString
}, { timestamps: true })

const FeeCodeModel = mongoose.model('feeCode',feeCodeSchema);
module.exports = FeeCodeModel;