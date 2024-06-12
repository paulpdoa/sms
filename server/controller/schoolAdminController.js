const Teacher = require('../model/Teacher');
const Role = require('../model/Roles');
const User = require('../model/Users');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 24 * 60;
const createToken = (token) => {
    return jwt.sign({ token }, process.env.SECRET, {
        expiresIn: maxAge
    })
}

module.exports.get_teachers = async (req,res) => {
    try {
        const teachers = await Teacher.find().populate('sex religion nationality');
        res.status(200).json(teachers);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_teacher = async (req,res) => {
    const { firstName,
        middleName,
        lastName,
        dateOfBirth,
        age,
        sex,
        religion,
        nationality,
        placeOfBirth,
        email,
        contactNumber,
        address,
        spouseName,
        spouseCel,
        education,
        schoolGraduated,
        yearGraduated,
        yearsOfExperience,
        joiningDate,
        department,
        gradeLevel,
        section,
        username,
        password,
        confirmPassword
     } = req.body;


     const role = 'Teacher';
     const activeStatus = true;

    try {
        if(password === confirmPassword) {
            const findRoleId = await Role.find({ userRole: role });
            const addTeacherToUser = await User.create({ firstName,middleName,lastName,username,password,role: findRoleId[0]._id, isActive: activeStatus});
            const addTeacher = await Teacher.create({firstName,
                middleName,
                lastName,
                dateOfBirth,
                age,
                sex,
                religion,
                nationality,
                placeOfBirth,
                email,
                contactNumber,
                address,
                spouseName,
                spouseCel,
                education,
                schoolGraduated,
                yearGraduated,
                yearsOfExperience,
                joiningDate,
                department,
                gradeLevel,
                section,
                username,
                password });
                const token = createToken(addTeacher._id);
            res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been created`, redirect:'/teachers' });
        }
    } catch(err) {
        console.log(err);
    }
} 

module.exports.delete_teacher = async (req,res) => {
    const { id } = req.params;

    try {
        const teacherFind = await Teacher.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${teacherFind.firstName}'s record has been deleted`});
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_teacher_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const teacherFind = await Teacher.findById(id);
        res.status(200).json(teacherFind);
    } catch(err) {
        console.log(err);
    }
}