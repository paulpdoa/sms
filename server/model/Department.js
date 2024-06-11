const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const departmentSchema = new mongoose.Schema({
    department: {
        type:String,
        required:true,
        unique:true
    }
}, { timestamps: true })

const DepartmentModel = mongoose.model('department',departmentSchema);
module.exports = DepartmentModel;