const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const nationalityCodeSchema = new mongoose.Schema({
    nationality: {
        type:String,
        required:true,
        unique:true
    },
    nationalityCode: {
        type: String,
        required: true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const NationalityCodeModel = mongoose.model('nationalityCode',nationalityCodeSchema);
module.exports = NationalityCodeModel;