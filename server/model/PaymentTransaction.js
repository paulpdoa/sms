const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const paymentTransactionSchema = new mongoose.Schema({
    amountPaid: {
        type: Number,
        required: true
    },
    referenceCode: {
        type:String,
        required: true
    },
    balanceAmount: {
        type: Number
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    recordStatus: requiredString
}, { timestamps: true })

const PaymentTranscationModel = mongoose.model('paymentTransaction',paymentTransactionSchema);
module.exports = PaymentTranscationModel;