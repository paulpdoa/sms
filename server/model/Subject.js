const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    gradeLevelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gradeLevel'
    },
    strandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'strand'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recordStatus: {
        type: String,
        required:true
    }

}, { timestamps: true });


const SubjectModel = mongoose.model('subject',subjectSchema);
module.exports = SubjectModel;