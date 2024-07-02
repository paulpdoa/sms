const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const paymentScheduleSchema = new mongoose.Schema({
    sy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    paymentTermId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paymentTerm'
    },
    dateSchedule: requiredString
}, { timestamps: true })

const PaymentScheduleModel = mongoose.model('paymentSchedule',paymentScheduleSchema);
module.exports = PaymentScheduleModel;