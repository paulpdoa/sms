const mongoose = require('mongoose');
const validator = require('validator');

const requiredString = {
    type: String,
    required: true
}

const studentPaymentSchema = new mongoose.Schema({
    sy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    gradeLevelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'gradeLevel'
    },
    feeCodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'feeCode'
    },
    manageFeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manageFee'
    },
    textBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'textbook'
    },
    paymentScheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paymentSchedule'
    },
    studentDiscountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentDiscount'
    },
    totalPaymentAmount: {
        type: Number
    },
    payEveryAmount: {
        type: Number
    }
}, { timestamps: true })

const StudentPaymentModel = mongoose.model('studentPayment',studentPaymentSchema);
module.exports = StudentPaymentModel;