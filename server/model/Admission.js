const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const admissionSchema = new mongoose.Schema({
    schoolYear: {
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
    }
}, { timestamps: true })

const AdmissionModel = mongoose.model('admission',admissionSchema);
module.exports = AdmissionModel;