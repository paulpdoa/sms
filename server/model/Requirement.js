const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const requirementSchema = new mongoose.Schema({
    requirement: {
        type:String,
        required:true,
        unique:true
    },
    isRequired: {
        type: Boolean,
        required: true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }
}, { timestamps: true })

const RequirementModel = mongoose.model('requirement',requirementSchema);
module.exports = RequirementModel;