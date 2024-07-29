const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const penaltySchema = new mongoose.Schema({
    penaltyPercentage: {
        type:String,
        required:true,
    },
    paymentStarts: {
        type: String
    },
    paymentEnds: {
        type: String
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const PenaltyModel = mongoose.model('penalty',penaltySchema);
module.exports = PenaltyModel;