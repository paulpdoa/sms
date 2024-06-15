const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const genderSchema = new mongoose.Schema({
    gender: {
        type:String,
        required:true,
        unique:true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const GenderModel = mongoose.model('gender',genderSchema);
module.exports = GenderModel;