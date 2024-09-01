const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
}

const GradingCategorySchema = new mongoose.Schema({
    gradingCategory: requiredString,
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

const GradingCategoryModel = mongoose.model('gradingCategory',GradingCategorySchema);
module.exports = GradingCategoryModel;