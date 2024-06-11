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
    }
}, { timestamps: true })

const RequirementModel = mongoose.model('requirement',requirementSchema);
module.exports = RequirementModel;