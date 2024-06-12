const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const textbookSchema = new mongoose.Schema({
    schoolYear: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'schoolYear' 
    },
    bookCode: {
        type:String,
        required:true,
        unique: true
    },
    bookTitle: requiredString,
    bookAmount: {
        type: Number,
        required:true
    },
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gradeLevel'
    },
    strand: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'strand'
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    session: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'schoolYear'
    },
    status: requiredString
}, { timestamps: true })

const TextbookModel = mongoose.model('textbook',textbookSchema);
module.exports = TextbookModel;