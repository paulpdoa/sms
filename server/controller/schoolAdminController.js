const Teacher = require('../model/Teacher');
const Role = require('../model/Roles');
const User = require('../model/Users');
const Strand = require('../model/Strand');
const Textbook = require('../model/Textbook');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 24 * 60;
const createToken = (token) => {
    return jwt.sign({ token }, process.env.SECRET, {
        expiresIn: maxAge
    })
}

module.exports.get_teachers = async (req,res) => {
    try {
        const teachers = await Teacher.find().populate('religion nationality');
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
        gender: sex,
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
        // department,
        // gradeLevel,
        // section,
        // username,
        // password,
        // confirmPassword
     } = req.body;

     console.log(req.body);

    //  const role = 'Teacher';
     const activeStatus = true;

    try {
           
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
            });
        res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been created`, redirect:'/teachers' });
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: err.message })
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
        const teacherFind = await Teacher.findById(id).populate('religion nationality');
        res.status(200).json(teacherFind);
    } catch(err) {
        console.log(err);
    }
}

// Update teacher
module.exports.edit_teacher = async (req,res) => {

    const { id } = req.params;
    const { firstName,middleName,lastName,dateOfBirth,sex,placeOfBirth,nationality,religion,email,contactNumber,address,spouseName,spouseCel,education,schoolGraduated,yearGraduated,yearsOfExperience,joiningDate } = req.body;

    try {
        await Teacher.findByIdAndUpdate({ _id: id }, { firstName,middleName,lastName,nationality,religion,dateOfBirth,sex,placeOfBirth,email,contactNumber,address,spouseName,spouseCel,education,schoolGraduated,yearGraduated,yearsOfExperience,joiningDate });
        res.status(200).json({ mssg: `${firstName} ${lastName}'s teacher record has been updated successfully`, redirect:'/teachers' })
    } catch(err) {
        console.log(err);
    }
}

// For Strand
module.exports.get_strands = async (req,res) => {
    try {
        const strands = await Strand.find({ status: true }).populate('inputter');
        res.status(200).json(strands);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_strand = async (req,res) => {

    const { strand,inputter } = req.body;
    const status = true;

    try {
        const newStrand = await Strand.addStrand(strand,inputter,status);
        res.status(200).json({ mssg: `${strand} has been added to the record` });
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ mssg: err.message });
    }
}

module.exports.delete_strand = async (req,res) => {
    const { id } = req.params;
    const status = false;

    try {
        const strandFind = await Strand.findByIdAndUpdate({ _id: id },{ status });
        res.status(200).json({ mssg: `${strandFind.strand} record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_strand_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const strandFind = await Strand.findById(id);
        res.status(200).json(strandFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_strand = async (req,res) => {
    const { id } = req.params;

    const { newStrand: strand, inputter } = req.body;

    try {   
        const newStrand = await Strand.findByIdAndUpdate({ _id: id }, { strand, inputter });
        res.status(200).json({ mssg: `${newStrand.strand} has been edited successfully!` });
    } catch(err) {
        console.log(err);
    }
}

// For textbooks
module.exports.get_textbooks = async (req,res) => {
    const { session } = req.query;

    try {
        // Will return active statuses
        const textbooks = await Textbook.find({ status: true,sessionId: session })
        .populate('inputter gradeLevel strand sessionId schoolYear');
        res.status(200).json(textbooks);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_textbook = async (req,res) => {

    const status = true;
    let { schoolYear,bookCode,bookTitle,bookAmount,gradeLevel,strand,inputter,session } = req.body;
    
    if(strand === '') {
        strand = undefined;
    }

    try {
        await Textbook.create({ schoolYear,bookCode,bookTitle,bookAmount,gradeLevel,strand,inputter,sessionId: session, status });
        res.status(200).json({ mssg: `${bookTitle} has been added to the record` });
    } catch(err) {
        if(err.code === 11000) {
            console.log(err.keyValue.bookCode);
            res.status(400).json({ mssg: err.keyValue.bookCode + ' has been added in the record, please add unique book code' });
        }
    }
}

module.exports.delete_textbook = async (req,res) => {
    const { id } = req.params;
    const status = false;

    try {
        const textbookFind = await Textbook.findByIdAndUpdate({ _id: id },{ status });
        res.status(200).json({ mssg: `${textbookFind.bookTitle} record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_textbook_detail = async (req,res) => {
    const { id } = req.params;

    const { session } = req.query;

    try {
        const textbookFind = await Textbook.findOne({ _id: id, sessionId: session});
        res.status(200).json(textbookFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_textbook = async (req,res) => {
    const { id } = req.params;

    const { newBookCode: bookCode,newBookTitle:bookTitle,newBookAmount:bookAmount,newGradeLevel:gradeLevel,newStrand:strand,newInputter:inputter,newSession:session,newSchoolYear:schoolYear } = req.body;
    
    try { 
        if(strand === '') {
            await Textbook.findByIdAndUpdate({ _id: id }, { bookTitle,bookCode,bookAmount,gradeLevel,inputter,sessionId: session,schoolYear });
        } else {
            await Textbook.findByIdAndUpdate({ _id: id }, { bookTitle,bookCode,bookAmount,gradeLevel,strand,inputter,sessionId: session,schoolYear });
        }

        
        res.status(200).json({ mssg: `${bookTitle} has been edited successfully!` });
    } catch(err) {
        console.log(err);
    }
}