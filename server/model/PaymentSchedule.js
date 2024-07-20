const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const paymentScheduleSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    paymentTermId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paymentTerm'
    },
    dateSchedule: requiredString
}, { timestamps: true })


paymentScheduleSchema.pre('remove', async function (next) {
    try {
        await StudentPayment.deleteMany({ paymentScheduleId: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

const PaymentScheduleModel = mongoose.model('paymentSchedule',paymentScheduleSchema);
module.exports = PaymentScheduleModel;