const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const gradeLevelSchema = new mongoose.Schema({
    gradeLevel: {
        type:String,
        required:true,
        unique:true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }
}, { timestamps: true })

const GradeLevelModel = mongoose.model('gradeLevel',gradeLevelSchema);
module.exports = GradeLevelModel;