const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const parentSiblingSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parent'
    },
    siblingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sibling'
    },
    siblingRank: { // This will define how many are the siblings of the student/ child of the parent
        type: Number,
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

const ParentSiblingModel = mongoose.model('parentSibling',parentSiblingSchema);
module.exports = ParentSiblingModel;