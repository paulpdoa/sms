const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const nationalitySchema = new mongoose.Schema({
    nationality: {
        type:String,
        required:true,
        unique:true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const NationalityModel = mongoose.model('nationality',nationalitySchema);
module.exports = NationalityModel;