const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const schoolYearSchema = new mongoose.Schema({
    schoolTheme: {
        type: String,
        unique: true
    },
    startYear: requiredString,
    endYear: requiredString,
    isYearDone: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const SchoolYearModel = mongoose.model('schoolYear',schoolYearSchema);
module.exports = SchoolYearModel;