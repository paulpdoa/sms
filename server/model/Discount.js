const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const requiredNumber = {
    type: Number,
    required: true
}

const discountSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    gradeLevelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'gradeLevel'
    },
    discountType: requiredString,
    discountPercent: requiredNumber,
    amount: requiredNumber,
    discountCode: requiredString,

}, { timestamps: true })

const DiscountModel = mongoose.model('discount',discountSchema);
module.exports = DiscountModel;