const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
    unique: [true, `${this.category} is already existing, please choose another`]
}

const FeeCategorySchema = new mongoose.Schema({
    category: requiredString,
    code: requiredString,
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
}, { timestamps: true })

const FeeCategoryModel = mongoose.model('feeCategory',FeeCategorySchema);
module.exports = FeeCategoryModel;