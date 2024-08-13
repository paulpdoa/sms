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
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    recordStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const ReligionModel = mongoose.model('religion',religionSchema);
module.exports = ReligionModel;