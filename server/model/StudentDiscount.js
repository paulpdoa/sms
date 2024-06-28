const mongoose = require('mongoose');

const studentDiscountSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discount'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    discount: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const StudentDiscountSchema = mongoose.model('studentDiscount',studentDiscountSchema);
module.exports = StudentDiscountSchema;