const Teacher = require('../model/Teacher');

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
     console.log(req.body)
    try {
        if(password === confirmPassword) {
            const addTeacher = await Teacher.create({firstName,
                middleName,
                lastName,
                suffix,
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