const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const requiredString = {
    type: String,
    required: true
}

const userSchema = new mongoose.Schema({
    firstName: requiredString,
    middleName: requiredString, 
    lastName: requiredString,
    username: {
        type: String,
        required: true,
        unique: true
    },
    role:  {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'role',
        required: true
    },
    isActive: {
        type: Boolean
    },
    password: requiredString

}, { timestamps: true });

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();

    if(!validator.isStrongPassword(this.password)) {
        throw Error('Password not strong enough')
    }

    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// create static login method for user
userSchema.statics.login = async function(username,password,session) {
    const user = await this.findOne({ username });

    if(!session) {
        throw Error('Session must not be empty');
    }

    if(user) {
        const auth = await bcrypt.compare(password,user.password);
        if(auth) {
            return user;
        }
        throw Error('Password is incorrect');
    } 
    throw Error('This username doesn\'t exist');
}

const UserModel = mongoose.model('user',userSchema);
module.exports = UserModel;