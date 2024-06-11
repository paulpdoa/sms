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
    }
}, { timestamps: true })

const NationalityModel = mongoose.model('nationality',nationalitySchema);
module.exports = NationalityModel;