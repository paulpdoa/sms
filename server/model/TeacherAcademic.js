const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const teacherAcademicSchema = new mongoose.Schema({
    teacherSubjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacherSubject'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'schoolYear'
    },
    recordStatus: requiredString
}, { timestamps: true })

const TeacherAcademicModel = mongoose.model('teacherAcademic',teacherAcademicSchema);
module.exports = TeacherAcademicModel;