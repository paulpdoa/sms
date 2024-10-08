const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
}

const FeeCategorySchema = new mongoose.Schema({
    category: requiredString,
    code: requiredString,
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    recordStatus: requiredString
}, { timestamps: true })

const FeeCategoryModel = mongoose.model('feeCategory',FeeCategorySchema);
module.exports = FeeCategoryModel;