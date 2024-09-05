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
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    status: {
        type: Boolean
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    },
    recordStatus: requiredString
}, { timestamps: true })

roleSchema.statics.addRole = async function(userRole,inputter,status,sessionId,recordStatus) {

    const exist = await this.findOne({ userRole });
    if(exist && exist.status){
        throw Error('This role is already existing');
    } 

    const newRole = await this.create({ userRole,inputter,status,recordStatus: 'Live' })
    return newRole

}

const RoleModel = mongoose.model('role',roleSchema);
module.exports = RoleModel;