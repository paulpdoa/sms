const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const sectionSchema = new mongoose.Schema({
    section: {
        type:String,
        required:true,
        unique:true
    },
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gradeLevel' 
    },
    adviser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'teacher' 
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'department' 
    }
    
}, { timestamps: true })

const SectionModel = mongoose.model('section',sectionSchema);
module.exports = SectionModel;