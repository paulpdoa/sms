const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const requirementSchema = new mongoose.Schema({
    requirement: {
        type:String,
        required:true,
    },
    isRequired: {
        type: Boolean,
        required: true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    }
}, { timestamps: true })

const RequirementModel = mongoose.model('requirement',requirementSchema);
module.exports = RequirementModel;