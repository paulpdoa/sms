const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const roomNumberSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    recordStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const RoomNumberModel = mongoose.model('roomNumber',roomNumberSchema);
module.exports = RoomNumberModel;