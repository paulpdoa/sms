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
    discountType: {
        type: String,
        unique:true,
        required: true
    },
    discountPercent: requiredNumber,
    amount: {
        type: Number
    },
    discountCode: requiredString,
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const DiscountModel = mongoose.model('discount',discountSchema);
module.exports = DiscountModel;