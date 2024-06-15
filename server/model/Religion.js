const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const religionSchema = new mongoose.Schema({
    religion: {
        type:String,
        required:true,
        unique:true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const ReligionModel = mongoose.model('religion',religionSchema);
module.exports = ReligionModel;