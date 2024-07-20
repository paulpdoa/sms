const mongoose = require('mongoose');
const validator = require('validator');

const requiredString = {
    type: String,
    required: true
}

const siblingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    firstName: requiredString,
    middleName: requiredString,
    lastName: requiredString,
    email: {
        type: String,
        unique: true,
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

const SiblingModel = mongoose.model('sibling',siblingSchema);
module.exports = SiblingModel;