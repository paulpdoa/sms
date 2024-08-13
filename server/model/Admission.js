const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const admissionSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'schoolYear'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    requirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'requirement'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recordStatus: requiredString
}, { timestamps: true })

const AdmissionModel = mongoose.model('admission',admissionSchema);
module.exports = AdmissionModel;