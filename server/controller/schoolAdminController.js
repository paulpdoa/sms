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
        const teachers = await Teacher.find({ recordStatus: 'Live' }).populate('religion nationality');
        res.status(200).json(teachers);
    } catch(err) {
        console.log(err);
    }
}


module.exports.add_teacher = async (req, res) => {
    const {
        firstName,
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
        currentUserId: inputter,
        session: sessionId,
        username,
        password,
    } = req.body;


    let teacher;

    try {
        // Check if the teacher already exists
        const existingTeacher = await Teacher.findOne({
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            sessionId,
            recordStatus: 'Live'
        });

        if (existingTeacher) {
            return res.status(400).json({ mssg: 'Teacher with these details already exists' });
        }

        // Create the teacher
        teacher = await Teacher.create({
            firstName,
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
            inputter,
            sessionId,
            recordStatus: 'Live'
        });

        // Hash the password for the user account
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = await Role.findOne({ userRole: 'Teacher', recordStatus: 'Live' });

         // Check if the role was found
         if (!userRole) {
            // Delete the created teacher if the role doesn't exist
            await Teacher.findByIdAndDelete(teacher._id);
            return res.status(400).json({ mssg: 'Role for Teacher not found. Please create the role first.' });
        }

        // Create the user
        await User.create({
            username,
            role: userRole._id,
            teacherId: teacher._id,
            recordStatus: 'Live',
            password,
            isActive: true,
            inputter
        });

        res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been created`, redirect: '/teachers' });

    } catch (err) {
        // If an error occurs, delete the teacher if it was created
        if (err.code && err.code === 11000) {
            return res.status(400).json({ mssg: 'Username already exists. Please choose another one.' });
        }

        // Clean up by deleting the teacher if the user creation fails
        if (teacher) {
            await Teacher.findByIdAndDelete(teacher._id);
        }

        console.log(err);
        res.status(400).json({ mssg: err.message });
    }
};


module.exports.delete_teacher = async (req,res) => {
    const { id } = req.params;
    const { recordStatus } = req.body;

    try {
        const teacherFind = await Teacher.findByIdAndUpdate(id,{ recordStatus });

        const userFind = await User.findByIdAndUpdate(id, { recordStatus });

        res.status(200).json({ mssg: `${teacherFind.firstName}'s record has been deleted`});
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while deleting teacher record' });
    }
}

module.exports.get_teacher_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const teacherFind = await Teacher.findOne({ _id: id, recordStatus: 'Live'}).populate('religion nationality');
        res.status(200).json(teacherFind);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching teacher record' });

    }
}

// Update teacher
module.exports.edit_teacher = async (req,res) => {

    const { id } = req.params;
    const { firstName,middleName,lastName,dateOfBirth,sex,placeOfBirth,nationality,religion,email,contactNumber,address,spouseName,spouseCel,education,schoolGraduated,yearGraduated,yearsOfExperience,joiningDate,inputter,session: sessionId } = req.body;

    try {
        await Teacher.findByIdAndUpdate({ _id: id }, { firstName,middleName,lastName,nationality,religion,dateOfBirth,sex,placeOfBirth,email,contactNumber,address,spouseName,spouseCel,education,schoolGraduated,yearGraduated,yearsOfExperience,joiningDate,inputter,sessionId });
        res.status(200).json({ mssg: `${firstName} ${lastName}'s teacher record has been updated successfully`, redirect:'/teachers' })
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while updating teacher record' });
    }
}

// For Strand
module.exports.get_strands = async (req,res) => {
    try {
        const strands = await Strand.find({ status: true,recordStatus: 'Live' }).populate('inputter');
        res.status(200).json(strands);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching strand record' });

    }
}

module.exports.add_strand = async (req,res) => {

    const { strand,inputter,sessionId } = req.body;
    const status = true;
    const recordStatus = 'Live';

    try {
        const newStrand = await Strand.addStrand(strand,inputter,status,sessionId,recordStatus);
        res.status(200).json({ mssg: `${strand} has been added to the record` });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ mssg: err.message });
    }
}

module.exports.delete_strand = async (req,res) => {
    const { id } = req.params;
    const status = false;

    try {
        const strandFind = await Strand.findByIdAndUpdate({ _id: id },{ status,recordStatus: 'Deleted' });
        res.status(200).json({ mssg: `${strandFind.strand} record has been deleted` });
    } catch(err) {
        console.log(err)
        res.status(500).json({ mssg: 'An error occurred while deleting strand'});
    }
}

module.exports.get_strand_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const strandFind = await Strand.findOne({_id: id, recordStatus: 'Live'});
        res.status(200).json(strandFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_strand = async (req,res) => {
    const { id } = req.params;

    const { newStrand: strand, inputter,sessionId } = req.body;

    try {   
        const newStrand = await Strand.findByIdAndUpdate({ _id: id }, { strand, inputter,sessionId });
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
        const textbooks = await Textbook.find({ status: true,sessionId: session,recordStatus: 'Live' })
        .populate('inputter gradeLevel strand sessionId sessionId');
        res.status(200).json(textbooks);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_textbook = async (req,res) => {

    const status = true;
    let { bookCode,bookTitle,bookAmount,gradeLevel,strand,inputter,session } = req.body;
    
    if(strand === '') {
        strand = undefined;
    }

    try {
        await Textbook.create({ bookCode,bookTitle,bookAmount,gradeLevel,strand,inputter,sessionId: session, status,recordStatus: 'Live' });
        res.status(200).json({ mssg: `${bookTitle} has been added to the record` });
    } catch(err) {
        if(err.code === 11000) {
            console.log(err.keyValue.bookCode);
            res.status(500).json({ mssg: err.keyValue.bookCode + ' has been added in the record, please add unique book code' });
        }
    }
}

module.exports.delete_textbook = async (req,res) => {
    const { id } = req.params;
    const status = false;

    try {
        const textbookFind = await Textbook.findByIdAndUpdate({ _id: id },{ status,recordStatus: 'Deleted' });
        res.status(200).json({ mssg: `${textbookFind.bookTitle} record has been deleted` });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while deleting textbook record'})
    }
}

module.exports.get_textbook_detail = async (req,res) => {
    const { id } = req.params;

    const { session } = req.query;

    try {
        const textbookFind = await Textbook.findOne({ _id: id, sessionId: session, recordStatus: 'Live'});
        res.status(200).json(textbookFind);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching textbook information' })
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
        res.status(500).json({ mssg: 'An error occurred while updating textbook information' })
    }
}