const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const roleSchema = new mongoose.Schema({
    userRole: {
        type:String,
        required:true,
        unique:true
    }
}, { timestamps: true })

const RoleModel = mongoose.model('role',roleSchema);
module.exports = RoleModel;