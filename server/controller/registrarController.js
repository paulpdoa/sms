const Student = require('../model/Students');
const Admission = require('../model/Admission');

module.exports.get_students = async (req,res) => {
    try {
        const students = await Student.find().populate('sex religion nationality sy_id gradeLevel');
        res.status(200).json(students);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_student = async (req,res) => {
    const { firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,email,contactNumber,address,status } = req.body;
    const isAdmitted = false
   
    try {
        const addStudent = await Student.create({ firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,status,email,contactNumber,address,isAdmitted });
        res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been created`, redirect:'/students' });
    } catch(err) {
        console.log(err);
    }
} 

module.exports.delete_student = async (req,res) => {
    const { id } = req.params;

    try {
        const studentFind = await Student.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${studentFind.firstName}'s record has been deleted`});
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_student_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const studentFind = await Student.findById(id).populate('sex religion nationality section');
        res.status(200).json(studentFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.submit_student_requirements = async (req,res) => {
    const { id } = req.params;
    const { requirements } = req.body;

    let studentSubmitted = false;
    
    try {
        for(let i = 0; i < requirements.length; i++) {
            const existReq = await Student.find({ submittedRequirements: requirements[i] });

            if(!existReq) {
                studentSubmitted = true;
                const submitReqs = await Student.findByIdAndUpdate({_id:id},{ $push: {submittedRequirements: requirements[i]} });
            } else {
                studentSubmitted = false;
            }
        }

        if(studentSubmitted) {
            res.status(200).json({ mssg:`Requirement has been added to the record` });
        } else {
            res.status(400).json({ mssg: 'Requirements has already been submitted' });
        }

    } catch(err) {
        console.log(err);
    }
}

// Admission

module.exports.get_admission = async (req,res) => {
    try {
        const admissions = await Admission.find().populate('schoolYear requirementId studentId');
        res.status(200).json(admissions);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_admission = async (req,res) => {
    
    const { schoolYear,studentId,requirements } = req.body;
    let studentSubmitted = false;
    
    try {
        // const studentFind = await Admission.find({ studentId });

        // Check if student already has that requirement
        for(let i = 0; i < requirements.length; i++) {
            studentSubmitted = false;
            const newAdmit = await Admission.create({ schoolYear,studentId,requirementId: requirements[i] });
        }

        if(studentSubmitted) {
            res.status(400).json({ mssg: 'Requirements has already been submitted' });
        } else {
            res.status(200).json({ mssg: `Requirement has been submitted` });
        }
        
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_admission_student = async (req,res) => {
    const { student } = req.params;

    try {
        const admission = await Admission.find({ studentId: student });
        res.status(200).json(admission);
    } catch(err) {
        console.log(err);
    }
}