const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const paymentTermSchema = new mongoose.Schema({
    term: requiredString,
    payEvery: {
      type: Number,
      required: true  
    },
    installmentBy: {
        type: Number,
        required: true
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

const PaymentTermModel = mongoose.model('paymentTerm',paymentTermSchema);
module.exports = PaymentTermModel;