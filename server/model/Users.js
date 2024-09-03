const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const SchoolYear = require('../model/SchoolYear');
const UserRole = require('../model/Roles');

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
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parent'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    password: requiredString,
    profilePictureUrl: {
        type: String
    },
    recordStatus: requiredString

}, { timestamps: true });

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();

    if(!validator.isStrongPassword(this.password)) {
        throw Error('Password not strong enough, please create another password')
    }

    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// create static login method for user
userSchema.statics.login = async function(username,password,session) {
    const user = await this.findOne({ username });

    // This will check if the school year table is still empty, meaning it's a new system
    const schoolYears = await SchoolYear.find();

    if(!user) {
        throw Error(`${username} does not exist`);
    }

    const { userRole } = await UserRole.findOne({ _id: user.role });

    const allowedAddSyUsers = ['Super Admin','School Admin'];

    if(session === 'true') {
        if(!allowedAddSyUsers.includes(userRole)) {
            throw Error('You cannot create new school year with this user');
        }
    }

    if(schoolYears.length > 0 && !session) { // meaning no records yet
        // allow user to login wihout having to request for session
        throw Error('Session must not be empty');
    }

    if(!user.isActive) {
        throw Error('Your user is not active, please contact your administrator for recovery');
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

userSchema.statics.updateUser = async function(id, firstName, middleName, lastName, role, username, password, isActive) {
    const user = await this.findOne({ username });

    if (user && user._id.toString() !== id.toString()) {
        throw Error('This username is already taken, please choose another username');
    }

    if(!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough, please create another password')
    }

    const salt = await bcrypt.genSalt();
    const newPassword = password ? await bcrypt.hash(password, salt) : undefined;

    const updatedFields = {
        firstName,
        middleName,
        lastName,
        role,
        username,
        isActive,
    };

    if (newPassword) {
        updatedFields.password = newPassword;
    }

    return await this.findByIdAndUpdate(id, updatedFields, { new: true });
};


const UserModel = mongoose.model('user',userSchema);
module.exports = UserModel;