const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const sectioningSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'section'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    recordStatus: requiredString
    
}, { timestamps: true })


const SectioningModel = mongoose.model('sectioning',sectioningSchema);
module.exports = SectioningModel;