const Student = require('../model/Students');
const Admission = require('../model/Admission');
const SchoolYear = require('../model/SchoolYear');
const Academic = require('../model/Academic');
const Requirement = require('../model/Requirement');
const Discount = require('../model/Discount');
const StudentDiscount = require('../model/StudentDiscount');
const Sectioning = require('../model/Sectioning');
const ManageFee = require('../model/ManageFee');
const GradeLevel = require('../model/GradeLevel');
const StudentPayment = require('../model/StudentPayment');
const Textbook = require('../model/Textbook'); 
const PaymentSchedule = require('../model/PaymentSchedule');
const PaymentTerm = require('../model/PaymentTerm');
const FeeCode = require('../model/FeeCode');
const Strand = require('../model/Strand');
const Subject = require('../model/Subject');
const StudentSubject = require('../model/StudentSubject');
const TeacherSubject = require('../model/TeacherSubject');
const Teacher = require('../model/Teacher');
const TeacherAcademic = require('../model/TeacherAcademic');
const User = require('../model/Users');
const Role = require('../model/Roles');

const moment = require('moment');

module.exports.get_students = async (req,res) => {
    try {
        // const students = await Student.find().populate('sex religion nationality sy_id gradeLevel academicId');
        const students = await Student.find({recordStatus: 'Live'})
        .populate({
            path: 'academicId',
            populate: [
                { path: 'studentId' },
                { path: 'strandId' },
                { path: 'departmentId' },
                { path: 'gradeLevelId' },
                { path: 'sessionId' },
                { path: 'paymentTermId' },
                { 
                    path: 'sectionId',
                    populate: { path: 'adviser' }
                }
            ]
        })
        .populate('nationality')
        .populate('religion')
        .populate('sy_id')
        .populate('gradeLevel')
        res.status(200).json(students);
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while fetching students records' });
    }
}


// This is to get enrolled students
module.exports.get_enrolled_students = async (req, res) => {
    const { id } = req.params; // Id of session to get current students who have fees

    try {
        const enrolledStudents = await StudentPayment.find({ sessionId: id });

        const uniqueStudentIds = new Set();
        const filteredEnrolledStudents = [];

        for (const enrolledStudent of enrolledStudents) {
            if (!uniqueStudentIds.has(enrolledStudent.studentId.toString())) {
                uniqueStudentIds.add(enrolledStudent.studentId.toString());
                filteredEnrolledStudents.push(enrolledStudent);
            }
        }

        res.status(200).json(filteredEnrolledStudents);
    } catch (err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while getting enrolled students' });
    }
};


module.exports.add_student = async (req,res) => {
    const { firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,email,contactNumber,address,currentUserId: inputter,sessionId,password,confirmPassword,username } = req.body;
    const isAdmitted = false;

    try {

        if(password !== confirmPassword) {
            return res.status(400).json({ mssg: 'Password does not match, please check your password' });
        }

        // Create a user record 
        const userRole = await Role.findOne({ userRole: 'Student', recordStatus: 'Live' });
        if(!userRole) {
            return res.status(404).json({ mssg: 'This role is not existing, please contact your administrator' });
        }

        const student = await Student.create({ firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,email,contactNumber,address,isAdmitted,inputter,sessionId,recordStatus: 'Live' });
        const user = await User.create({
            username,
            role: userRole._id,
            studentId: student._id,
            recordStatus: 'Live',
            password,
            isActive: true,
            inputter
        });

        if(!user) {
            // Delete the student if user creation fails
            await Student.findByIdAndDelete(student._id);
        }
        
        res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been created`, redirect:'/students' });
    } catch(err) {
        console.log(err);

        if(err.keyPattern?.email) {
            return res.status(400).json({ mssg: `The email ${err.keyValue.email} is already in use, please choose another email` });
        }

        res.status(400).json({ mssg: err.message });
    }
} 

module.exports.delete_student = async (req,res) => {
    const { id } = req.params;
    const { recordStatus } = req.body; 

    try {
        const studentFind = await Student.findByIdAndUpdate(id,{ recordStatus });
        res.status(200).json({ mssg: `${studentFind.firstName}'s record has been deleted`});
    } catch(err) {
        console.log(err)
        res.status(400).json({ mssg: 'An error occurred while deleting records for student record' });
    }
}

module.exports.edit_student = async(req,res) => {
    const { id } = req.params;

    const { firstName,middleName,lastName,suffix,dateOfBirth,age,gender,religion,nationality,placeOfBirth,email,contactNumber,address,currentUserId: inputter,sessionId } = req.body;

    try {   

        const student = await Student.findById(id);
        if(!student) {
            return res.status(404).json({ mssg: 'Sorry, this student is not in the record, please try again', redirect: '/students' });
        }

        await Student.findByIdAndUpdate({ _id: id },{ firstName,middleName,lastName,suffix,dateOfBirth,age,gender,religion,nationality,placeOfBirth,email,contactNumber,address,inputter,sessionId });
        res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been updated successfully`, redirect: '/students' });

    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: err.message });
    }
}

module.exports.get_student_detail = async (req, res) => {
    const { id } = req.params;  

    try {
        const studentFind = await Student.findOne({ _id: id, recordStatus: 'Live'})
            .populate({
                path: 'academicId',
                populate: [
                    { path: 'studentId' },
                    { path: 'strandId' },
                    { path: 'departmentId' },
                    { path: 'gradeLevelId' },
                    { path: 'sessionId' },
                    { path: 'paymentTermId' },
                    { 
                        path: 'sectionId',
                        populate: { path: 'adviser' }
                    }
                ]
            })
            .populate('sex')
            .populate('religion')
            .populate('nationality')
            .populate('sy_id')
            .populate('gradeLevel')
        res.status(200).json(studentFind);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching student information' });
    }
};


module.exports.submit_student_requirements = async (req,res) => {
    const { id } = req.params;
    const { requirements } = req.body;

    let studentSubmitted = false;
    
    try {
        for(let i = 0; i < requirements.length; i++) {
            const existReq = await Student.find({ submittedRequirements: requirements[i], recordStatus: 'Live' });

            if(!existReq) {
                studentSubmitted = true;
                await Student.findByIdAndUpdate({_id:id},{ $push: {submittedRequirements: requirements[i]}, recordStatus: 'Live' });
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
        res.status(500).json({ mssg: 'An error occurred while processing student requirements' });
    }
}

// Admission

module.exports.get_admission = async (req,res) => {
    try {
        const admissions = await Admission.find({ recordStatus: 'Live' }).populate('sessionId requirementId studentId');
        res.status(200).json(admissions);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching admission details' });
    }
}



module.exports.add_admission = async (req, res) => {
    const { schoolYear, studentId, requirements } = req.body;
    console.log('Submitted requirements:', requirements);
    
    try {
        // Check for Academic Record of student if existing
        const studentAcademicExist = await Academic.findOne({ studentId,recordStatus: 'Live' });
        
        // Fetch all required documents
        const requiredDocs = await Requirement.find({ sessionId: schoolYear, isRequired: true, recordStatus: 'Live' });
        const requiredDocIds = requiredDocs.map(doc => doc._id.toString());
        console.log('Required Documents:', requiredDocIds);

        // Check if the student already submitted the required documents
        const existingAdmissions = await Admission.find({ studentId, sessionId: schoolYear, recordStatus: 'Live' });
        const existingDocIds = existingAdmissions.map(admission => admission.requirementId.toString());
        console.log('Existing Admissions:', existingDocIds);

        // Remove existing admissions that are no longer in the submitted requirements
        const toRemove = existingDocIds.filter(id => !requirements.includes(id));
        console.log('To Remove:', toRemove);
        for (let i = 0; i < toRemove.length; i++) {
            await Admission.findOneAndUpdate({ studentId, requirementId: toRemove[i] });
        }

        // Add new requirements
        const toAdd = requirements.filter(id => !existingDocIds.includes(id));
        console.log('To Add:', toAdd);
        for (let i = 0; i < toAdd.length; i++) {
            await Admission.create({ sessionId: schoolYear, studentId, requirementId: toAdd[i], recordStatus: 'Live' });
        }

        // Combine existing and new submissions
        const allSubmittedDocs = [...new Set([...existingDocIds, ...requirements])];
        console.log('All Submitted Documents:', allSubmittedDocs);

        // Check if the student has submitted all required documents
        const allRequirementsMet = requiredDocIds.every(docId => allSubmittedDocs.includes(docId));
        console.log('All Requirements Met:', allRequirementsMet);

        if (allRequirementsMet) {
            if (studentAcademicExist) {
                const foundAcademic = await Academic.findByIdAndUpdate(studentAcademicExist._id, { isAdmitted: true, sessionId: schoolYear });
                console.log('Found Academic Record:', foundAcademic);
                await Student.findByIdAndUpdate(studentId, { isAdmitted: true, dateAdmitted: new Date(), academicId: foundAcademic._id });
            } else { // if student academic not existing, create new record
                const academic = await Academic.create({ studentId, isAdmitted: true, sessionId: schoolYear, recordStatus: 'Live' });
                await Student.findByIdAndUpdate(studentId, { isAdmitted: true, dateAdmitted: new Date(), academicId: academic._id });
                console.log('Creating academic')
            }
            // Admit the student
            // const result = await Student.findByIdAndUpdate(studentId, { isAdmitted: true, dateAdmitted: new Date() });
            // console.log('Student admitted:', result);
        } else {
            if (studentAcademicExist) {
                const foundAcademic = await Academic.findByIdAndUpdate(studentAcademicExist._id, { isAdmitted: false,sessionId: schoolYear });
                await Student.findByIdAndUpdate(studentId, { isAdmitted: true, dateAdmitted: new Date(), academicId: foundAcademic._id });
                console.log('Found Academic Record:', foundAcademic);
            } else { // if student academic not existing, create new record
                await Academic.create({ studentId, isAdmitted: false, sessionId: schoolYear, recordStatus: 'Live' });
                await Student.findByIdAndUpdate(studentId, { isAdmitted: true, dateAdmitted: new Date(), academicId: academic._id });
                console.log('Creating academic')
            }

            // Set isAdmitted to false if any requirement is unchecked
            const result = await Student.findByIdAndUpdate(studentId, { isAdmitted: false });
            console.log('Student not admitted:', result);
        }

        res.status(200).json({ mssg: 'Student requirement has been updated' });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ mssg: 'An error occurred while processing admission' });
    }
};



module.exports.get_admission_student = async (req,res) => {
    const { student } = req.params;
    const { session } = req.query;

    try {
        const admission = await Admission.find({ studentId: student,sessionId: session,recordStatus: 'Live' });
        res.status(200).json(admission);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while getting admission records'});
    }
}

module.exports.update_student_info = async (req, res) => {
    const { id } = req.params;
    let studentNo = '';
    let currentYear = '';
    let studentName = '';
    let dateRegistered = '';

    let {
        firstName,
        lastName,
        middleName,
        gender,
        dateOfBirth,
        placeOfBirth,
        address,
        nationality,
        religion,
        contactNumber,
        email,
        status,
        academicStatus,
        suffix,
        lrn,
        passedReportCard,
        settledArrears,
        completedClearance,
        session,
        isRegistered,
        currentUserId: inputter
    } = req.body;

    if (completedClearance && passedReportCard && settledArrears) {
        isRegistered = true;
    } else {
        isRegistered = false;
    }

    try {
        const studentAcademic = await Academic.findOne({ studentId: id, sessionId: session,recordStatus: 'Live' });
        console.log('student Academic', studentAcademic);

        if (!studentAcademic?.isAdmitted) {
            return res.status(404).json({ mssg: 'Please complete students requirements first before adding academic record' });
        }

        const latestStudent = await Student.findOne({ studentNo: { $exists: true }, recordStatus: 'Live' }).sort({ _id: -1 });
        console.log('Latest Student: ', latestStudent);

        const studentAcademicNewRecord = await Academic.findByIdAndUpdate(studentAcademic._id, { isRegistered, passedReportCard, settledArrears, completedClearance, academicStatus, inputter, recordStatus: 'Live' });
        console.log('New Record: ', studentAcademicNewRecord);

        const student = await Student.findByIdAndUpdate(
            id,
            {
                firstName,
                middleName,
                lastName,
                sex: gender,
                dateOfBirth,
                placeOfBirth,
                address,
                nationality,
                religion,
                contactNumber,
                email,
                status,
                suffix,
                lrn,
                academicId: studentAcademicNewRecord._id,
                inputter,
                recordStatus: 'Live'
            },
            { new: true }
        );

        const isStudentRegistered = await Student.findById(id);
        const currentSession = await SchoolYear.findOne({ _id: session, recordStatus: 'Live'});

        if (currentSession) {
            currentYear = currentSession.startYear.split('-')[0];
        } else {
            return res.status(404).json({ mssg: 'Session not found' });
        }

        if (isRegistered) {
            dateRegistered = new Date();

            if (!student.studentNo) {
                if (latestStudent?.studentNo?.slice(0, 4) == currentYear) {
                    const plusOne = parseInt(latestStudent.studentNo.slice(-4)) + 1;
                    const paddedNumber = plusOne.toString().padStart(4, '0');
                    studentNo = `${currentYear}${paddedNumber}`;
                } else {
                    const paddedNumber = '0001';
                    studentNo = `${currentYear}${paddedNumber}`;
                }

                console.log(`Assigning new student number: ${studentNo}`);
                student.studentNo = studentNo;
            }

            student.dateRegistered = dateRegistered;
        }

        studentName = student.firstName;
        await student.save();

        res.status(200).json({ mssg: `${studentName}'s record has been updated successfully!` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'Server error' });
    }
};

// For Academic

module.exports.get_academics = async (req,res) => {
    const { session } = req.query;

    try {
        const academics = await Academic.find({ sessionId: session,recordStatus: 'Live' })
        .populate({ path: 'sectionId', populate: { path: 'adviser' }})
        .populate('gradeLevelId studentId departmentId strandId sessionId');
        res.status(200).json(academics);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching academic record'});
    }
}

module.exports.get_student_academic = async (req,res) => {
    const { session } = req.query;
    try {
        const studentAcademic = await Academic.find({ sessionId: session,recordStatus: 'Live' }).populate({ path: 'studentId' });
        res.status(200).json(studentAcademic);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_student_academic_detail = async (req,res) => {
    const { studentId } = req.params;
    const { session } = req.query;
    
    try {
        const studentAcademic = await Academic.find({ studentId, sessionId: session,recordStatus: 'Live' },{ sort: { 'createdAt': -1 } });
        console.log(studentAcademic)
        res.status(200).json(studentAcademic);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_academic = async (req,res) => {

    let { strandId,gradeLevelId,sessionId,studentId,lastSchoolAttended,paymentTermId,academicStatus,inputter } = req.body;
    // This will also update students info upon posting

    if(strandId === '') {
        strandId = undefined;
    }

    if(paymentTermId === '') {
        paymentTermId = undefined
    }

    try {

        //await Academic.findOneAndDelete({ studentId: studentId });
        const studentAcademic = await Academic.findOne({ studentId,sessionId,recordStatus: 'Live' });

        if(!studentAcademic.isRegistered || !studentAcademic.isAdmitted) {
            return res.status(400).json({ mssg: 'Please admit or register the student first before creating academic record' });
        }

        if(!lastSchoolAttended) {
            return res.status(404).json({ mssg: 'Please enter last school attended by student' });
        }

        if(studentAcademic) {
            const academic = await Academic.findOneAndUpdate({ studentId: studentId, sessionId: sessionId },{strandId,gradeLevelId,sessionId,studentId,lastSchoolAttended,paymentTermId,academicStatus, inputter})
            await Student.findByIdAndUpdate({ _id: studentId }, { academicId: academic._id });
        }

        // Student will be updated and academic table will be appended many times by 1 student
        // const academic =  await Academic.create({ strandId,gradeLevelId,sessionId,studentId,lastSchoolAttended,paymentTermId,academicStatus });
        // const student = await Student.findByIdAndUpdate({ _id: studentId }, { academicId: academic._id });
        res.status(200).json({ mssg: `Students academic record has been created successfully` });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'Error on creating academic record, please ensure all fields were entered' });
    }
}

module.exports.delete_academic = async (req,res) => {
    const { id } = req.params;
    const { recordStatus } = req.body;
  
    try {
        await Academic.findByIdAndUpdate(id, { recordStatus: 'Deleted' });
        res.status(200).json({ mssg: `Academic record has been deleted` });
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg:'Failed to delete academic record' });
    }
}

// For Discounts

module.exports.get_discounts = async (req,res) => {
    const { session } = req.query;
    try {
        const discount = await Discount.find({ sessionId: session,recordStatus: 'Live' }).populate('sessionId gradeLevelId inputter');
        res.status(200).json(discount);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg:'An error occurred while fetching discount records' });
    }
}

module.exports.get_discount_detail = async (req,res) => {
    const { id } = req.params;
    const { session } = req.query;

    try {
        const discount = await Discount.findOne({ _id: id,sessionId: session,recordStatus: 'Live' }).populate('sessionId gradeLevelId inputter');
        res.status(200).json(discount);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg:'An error occurred while fetching discount records' });
    }
}

module.exports.add_discount = async (req, res) => {
    let { schoolYear: sessionId, gradeLevel: gradeLevelId, discountType, discountPercentage: discountPercent, amount, discountCode, inputter } = req.body;
    discountPercent = discountPercent / 100; // Divide to 100 to get decimal percentage equivalent

    if (amount !== null && amount < 0) {
        return res.status(400).json({ mssg: "Discount amount cannot be negative" });
    }   

    try {
        if(gradeLevelId === '') {
            await Discount.create({ sessionId, discountType, discountPercent, discountCode, inputter,recordStatus: 'Live' });
        } else {
            await Discount.create({ sessionId, gradeLevelId, discountType, discountPercent, amount, discountCode, inputter,recordStatus: 'Live' });
        }
        res.status(200).json({ mssg: `${discountType} discount has been added to the record` });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.status(400).json({ mssg: `${discountType} has been already added to the record, please create new discount type` });
        }
    }
};


module.exports.delete_discount = async (req,res) => {
    const { id } = req.params;
    const { recordStatus } = req.body;

    try {
        await Discount.findByIdAndUpdate(id,{ recordStatus });
        res.status(200).json({ mssg: 'Discount was deleted successfully!' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while deleting discount record' })
    }
}

module.exports.edit_discount = async (req,res) => {
    const { id } = req.params;

    const { sessionId,gradeLevelId,discountType,discountPercent,amount,discountCategory,inputter } = req.body;


    if(amount < 0) {
        return res.status(400).json({ mssg: "Discount amount cannot be negative" });
    }

    try {
        const discount = await Discount.findByIdAndUpdate({_id:id},{ sessionId,gradeLevelId,discountType,discountPercent,amount,discountCategory,inputter });
        res.status(200).json({ mssg: `${discount.discountType} has been updated successfully!` });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while updating discount record' })
    }
}

// For Student Discount

module.exports.get_student_discounts = async (req,res) => {
    
    try {
        const studentDiscounts = await StudentDiscount.find({ recordStatus: 'Live' }).populate('studentId sessionId discountId inputter');
        res.status(200).json(studentDiscounts);
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_student_discount = async (req,res) => {
    const { id } = req.params;
    const { recordStatus } = req.body;

    try {
        await StudentDiscount.findByIdAndUpdate(id,{ recordStatus });
        res.status(200).json({ mssg: 'Student discount has been removed successfully!' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while deleting student discount record' })
    }
}

module.exports.get_student_discount_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const studentDiscount = await StudentDiscount.findOne({ _id: id, recordStatus: 'Live' }).populate('studentId sessionId discountId inputter');
        res.status(200).json(studentDiscount);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student discount record' })
    }
}

module.exports.get_discounts_of_student = async (req,res) => {
    const { studentId } = req.params;

    try {
        const studentDiscount = await StudentDiscount.find({ studentId: studentId,recordStatus: 'Live' }).populate('studentId sessionId discountId inputter');
        res.status(200).json(studentDiscount);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student discount record' })
    }
}

module.exports.add_student_discount = async (req,res) => {
    const { studentId,sessionId,discountId,inputter } = req.body;

    try {

        const discount = await Discount.findOne({ _id: discountId, recordStatus: 'Live' });
        const discountPrice = discount.amount * discount.discountPercent;
        

        await StudentDiscount.create({ studentId,sessionId,discountId,inputter,discount: discountPrice, recordStatus: 'Live' });
        res.status(200).json({ mssg: 'Discount has been added to the student' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while adding student discount record' })

    }

}

module.exports.edit_student_discount = async(req,res) => {

    const { id } = req.params;
    const { studentId,sessionId,discountId,inputter } = req.body;

    try {
        await StudentDiscount.create({ studentId,sessionId,discountId,inputter });
        res.status(200).json({ mssg: 'Discount has been added to the student' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while updating student discount record' })
    }

}

// For Sectioning

module.exports.get_sectioning = async (req,res) => {
    try {
        const sectionings = await Sectioning.find({ recordStatus: 'Live' }).populate('sessionId studentId sectionId inputter');
        res.status(200).json(sectionings);
    } catch(err) {
        console.log(err);
    }
} 

module.exports.add_sectioning = async (req,res) => {
    const { sessionId,studentId,sectionId,inputter,gradeLevelId,strandId,lastSchoolAttended } = req.body;
    
    try {   
        // insert record in Academic table 

        // check if student already has academic record
        const academicFound = await Academic.findOne({ studentId, recordStatus: 'Live' }).populate('gradeLevelId studentId');
        console.log('academic found: ', academicFound);

        const withStrands = ['11','12'];

        // This block of code will only check if the student is grade 11 or 12, then will not allow if there is no strand selected yet for student
        if(academicFound.gradeLevelId.gradeLevel.includes(withStrands) && !academicFound.strandId) {
            // if the academicFound is grade 11 or 12, do not ask user to input academic strand
            return res.status(404).json({ mssg: 'Student does not have grade level or strand record yet, please go to admission page' });
        }
        
        if(academicFound) {
            if(!sectionId) {
                return res.status(404).json({ mssg: `Section cannot be blank, please select one section for ${academicFound.studentId.firstName} ${academicFound.studentId.lastName}` });
            }
            const academicNewRecord = await Academic.findOneAndUpdate({ _id: academicFound._id, sessionId }, { sessionId,studentId,sectionId,inputter,gradeLevelId,strandId,lastSchoolAttended,inputter });
            await Student.findByIdAndUpdate({_id: studentId},{ academicId: academicNewRecord._id, inputter });
        } else {
            return res.status(404).json({ mssg: 'Please make sure the student is already admitted or registered.' });
        }
        
        // insert in sectioning table
        const addSectioning = await Sectioning.create({ sessionId,studentId,sectionId,inputter,recordStatus: 'Live' });
        console.log('addSectioning',addSectioning);
        res.status(200).json({ mssg: `Student has been added new section successfully` });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'There is an error in creating sectioning, please contact admin' })
    }
}

// For Manage Fees

module.exports.get_manage_fees = async (req,res) => {

    const { session } = req.query;

    try {
        const managedFees = await ManageFee.find({ sessionId: session,recordStatus: 'Live' })
        .populate({ path: 'feeDescription',populate: { path: 'feeCateg' } })
        .populate('sessionId gradeLevelId strandId');
        res.status(200).json(managedFees);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching managed fees record' })
    }
}

module.exports.get_manage_fee_detail = async(req,res) => {

    const { id } = req.params;
    const { session } = req.query;

    try {
        const managedFee = await ManageFee.findById({ _id: id,sessionId: session, recordStatus: 'Live' })
        .populate({ path: 'feeDescription',populate: { path: 'feeCateg' } })
        .populate('sessionId gradeLevelId strandId');
        res.status(200).json(managedFee);
    } catch(err) {
        console.log(err)
        res.status(500).json({ mssg: 'An error occurred while fetching managed fees record' })

    }
}

module.exports.add_manage_fees = async (req,res) => {
    let { sessionId, gradeLevelIds, strandId, feeDescription, amount, isApplied,nationality,inputter } = req.body;

    // Fee Code > fee code + grade level + nationality Code
    // Fee description > fee description + grade level + nationality Code
    // Filter here if the gradelevel id is not 11 or 12, if not then do not add strand field
    if(strandId === '') {
        strandId = undefined
    }

    try {
        for(let i = 0; i < gradeLevelIds.length; i++) {
            const checkGradeLevel = await GradeLevel.findById(gradeLevelIds[i]);

            if(checkGradeLevel.gradeLevel.includes(11) || checkGradeLevel.gradeLevel.includes(12)) {
                await ManageFee.create({ sessionId,gradeLevelId:gradeLevelIds[i],nationality,strandId,feeDescription,amount,isApplied, inputter,recordStatus: 'Live'});
            } else {
                await ManageFee.create({ sessionId,gradeLevelId:gradeLevelIds[i],nationality,feeDescription,amount,isApplied, inputter, recordStatus: 'Live' });
            }

        }
        res.status(200).json({mssg: 'Fees has been added to the record'});
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error has occurred while creating fees' });
    }
}

// This function will automate the creation of fees for grade levels and assign them fees
//For Manage Fee page
module.exports.automate_fees = async (req, res) => {

    const { isReset,session,inputter } = req.body

    try {

        if(isReset) {
            await ManageFee.deleteMany({ sessionId: session });
        }
        // Fetch all grade levels, fees, and strands
        const [gradeLevels, fees, strands] = await Promise.all([
            GradeLevel.find({ recordStatus:'Live' }),
            FeeCode.find({recordStatus:'Live'}),
            Strand.find({ status: true,recordStatus:'Live' })
        ]);

        // Assign fees for each grade level
        for (const gradeLevel of gradeLevels) {
            const isSenior = gradeLevel.gradeLevel.includes(11) || gradeLevel.gradeLevel.includes(12);
            const manageFeesInfo = fee => ({
                gradeLevelId: gradeLevel._id,
                feeDescription: fee._id,
                amount: 0,
                nationality: 'Local',
                sessionId: session,
                inputter 
            });

            if (isSenior) {
                for (const strand of strands) {
                    for (const fee of fees) {
                        await ManageFee.create({
                            ...manageFeesInfo(fee),
                            strandId: strand._id,
                            recordStatus:'Live'
                        });
                    }
                }
            } else {
                for (const fee of fees) {
                    await ManageFee.create(manageFeesInfo(fee));
                }
            }
        }

        res.status(200).json({ message: 'Fees have been automatically created' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while automating fees' });
    }
};


module.exports.delete_manage_fee = async(req,res) => {
    const { id } = req.params;

    try {
        await ManageFee.findByIdAndUpdate(id,{ recordStatus: 'Deleted'});
        res.status(200).json({ mssg: `Fee has been deleted successfully` });
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while deleting managed fee record' });
    }
}

module.exports.edit_manage_fee = async (req,res) => {
    const { id } = req.params;
    let { sessionId, gradeLevelId, strandId, feeDescription, amount, isApplied,nationality,inputter } = req.body;

    try {
        await ManageFee.findByIdAndUpdate({ _id: id },{ sessionId, gradeLevelId, strandId, feeDescription, amount, isApplied,nationality,inputter });
        res.status(200).json({ mssg: `Fee has been updated successfully` });
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while updating managed fee record' });
    }
    
}

module.exports.generate_fees = async (req, res) => {
    const { session: currentYear } = req.body;

    try {

        // Delete generated fees when re-running
        await StudentPayment.deleteMany({ recordStatus: 'Live', sessionId: currentYear })

        // Fetch students who are registered and admitted
        const students = await Student.find({ recordStatus: 'Live' })
            .populate({
                path: 'academicId',
                populate: [
                    { path: 'studentId',populate: {
                        path: 'nationality'
                    } },
                    { path: 'strandId' },
                    { path: 'departmentId' },
                    { path: 'gradeLevelId' },
                    { path: 'sessionId' },
                    { 
                        path: 'sectionId',
                        populate: { path: 'adviser' }
                    },
                    { path: 'paymentTermId' }
                ]
            })
            
            .populate('sex')
            .populate('religion')
            .populate('sessionId')
            .populate('gradeLevel');

        // Fetch tables to be assigned to students fees
        const manageFees = await ManageFee.find({ sessionId: currentYear,recordStatus: 'Live' })
            .populate({ path: 'feeDescription', populate: { path: 'feeCateg' } })
            .populate('sessionId gradeLevelId strandId');
        
        const textbooks = await Textbook.find({ sessionId: currentYear,recordStatus:'Live' }).populate('inputter gradeLevel strand sessionId');

        const paymentSchedules = await PaymentSchedule.find({ sessionId: currentYear,recordStatus:'Live' }).populate('sessionId paymentTermId');
        const studentDiscounts = await StudentDiscount.find({ sessionId: currentYear,recordStatus: 'Live' }).populate('studentId sessionId discountId');
        console.log('Payment Schedules Lists: ' + paymentSchedules);
        console.log('Current School Year Id: ' + currentYear);
        console.log(studentDiscounts);
        // Fetch the current school year
        const currYear = await SchoolYear.findOne({_id: currentYear,recordStatus: 'Live'});

        if(paymentSchedules.length > 0) {
            if (currYear) {
                for (const student of students) {
                    if(student?.academicId?.isRegistered && student?.academicId?.isAdmitted) {

                        let totalPaymentAmount = 0; // Initialize total amount for each student
                        console.log('Creating payment fees for : ' + student.firstName);
                        for (const fee of manageFees) {
                            console.log('Fee :', fee._id);
                            // Check if the fee matches the current year, student's grade level, and nationality code
                            const matchesSchoolYear = fee.sessionId?._id.equals(currYear._id);
                            const matchesGradeLevel = fee.gradeLevelId?.gradeLevel.toLowerCase() === student.academicId.gradeLevelId.gradeLevel.toLowerCase();
                            const matchesNationality = !fee.nationality || fee.nationality.toLowerCase() === (student?.academicId?.studentId?.nationality?.nationality === 'Filipino' ? 'local' : 'foreigner')
                            
                            // console.log('Fee Conditions: ', {
                            //     matchesSchoolYear,
                            //     matchesGradeLevel,
                            //     matchesNationality
                            // })

                            if(matchesSchoolYear && matchesGradeLevel && matchesNationality) {
                                // console.log('Matching Fee:', {
                                //     studentName: student.firstName,
                                //     feeSyId: fee.sessionId._id,
                                //     currYearId: currYear._id,
                                //     feeGradeLevelId: fee.gradeLevelId._id,
                                //     studentGradeLevelId: student.academicId.gradeLevelId._id,
                                //     feeNationalityCodeId: fee.nationalityCodeId?._id,
                                //     studentNationalityCodeId: student.nationality?.nationalityCode,
                                //     manageFeeId: fee._id,
                                //     amount: fee.amount // Add amount to the log
                                // });
        
                                const paymentInfo = {
                                    sessionId: currYear._id,
                                    studentId: student._id,
                                    gradeLevelId: student.academicId.gradeLevelId._id,
                                    feeCodeId: fee.feeDescription._id,
                                    manageFeeId: fee._id,
                                    amount: fee.amount, // Add amount to the payment info,
                                    recordStatus: 'Live'
                                };
        
                                const existingPayment = await StudentPayment.findOne(paymentInfo);
        
                                if (!existingPayment) {
                                    await StudentPayment.create(paymentInfo);
                                    totalPaymentAmount += fee.amount; // Accumulate the fee amount
                                    console.log(`Added fee amount: ${fee.amount}, Total Payment Amount: ${totalPaymentAmount}`);
                                }
                            }
                        }
        
                        for (const textbook of textbooks) { 
                            const matchesSchoolYear = textbook.sessionId._id.equals(currYear._id);
                            const matchesGradeLevel = textbook.gradeLevel?._id.equals(student.academicId.gradeLevelId?._id);
                            const matchesStrand = !textbook.strand || textbook.strand._id.equals(student.academicId?.strandId?._id);
        
                            // console.log('Textbook Conditions:', {
                            //     matchesSchoolYear,
                            //     matchesGradeLevel,
                            //     matchesStrand
                            // });
        
                            if (matchesSchoolYear && matchesGradeLevel && matchesStrand) {
                                // console.log('Student Textbooks:', {
                                //     sessionId: currYear._id,
                                //     studentId: student._id,
                                //     gradeLevelId: student.academicId.gradeLevelId._id,
                                //     textBookId: textbook._id,
                                //     bookAmount: textbook.bookAmount // Add bookAmount to the log
                                // });
        
                                const studentTextbook = {
                                    sessionId: currYear._id,
                                    studentId: student._id,
                                    gradeLevelId: student.academicId.gradeLevelId._id,
                                    textBookId: textbook._id,
                                    bookAmount: textbook.bookAmount, // Add bookAmount to the textbook info
                                    recordStatus: 'Live'
                                };
        
                                const existingTextbook = await StudentPayment.findOne(studentTextbook);
        
                                if (!existingTextbook) {
                                    await StudentPayment.create(studentTextbook);
                                    totalPaymentAmount += textbook.bookAmount; // Accumulate the book amount
                                    console.log(`Added book amount: ${textbook.bookAmount}, Total Payment Amount: ${totalPaymentAmount}`);
                                }   
                            }
                        }
        
                        for (const paymentSchedule of paymentSchedules) {
                            const matchesSchoolYear = paymentSchedule.sessionId._id.equals(currYear._id);
                            const matchesPaymentTerm = paymentSchedule.paymentTermId.equals(student.academicId.paymentTermId);
                            // console.log(matchesSchoolYear,matchesPaymentTerm);
                            if (matchesSchoolYear && matchesPaymentTerm) {
                                // console.log('Student Payment Schedule', {
                                //     sessionId: currYear._id,
                                //     studentId: student._id,
                                //     gradeLevelId: student.academicId.gradeLevelId._id,
                                //     paymentScheduleId: paymentSchedule._id,
                                //     totalPaymentAmount, // Log the total amount,
                                //     payEveryAmount: totalPaymentAmount / student.academicId.paymentTermId.installmentBy
                                // });
        
                                const paymentScheduleInfo = {
                                    sessionId: currYear._id,
                                    studentId: student._id,
                                    gradeLevelId: student.academicId.gradeLevelId._id,
                                    paymentScheduleId: paymentSchedule._id,
                                    totalPaymentAmount, // Include the total amount in the payment schedule info
                                    payEveryAmount: totalPaymentAmount / student.academicId.paymentTermId.installmentBy,
                                    recordStatus: 'Live'
                                };
        
                                const existingPaymentSchedule = await StudentPayment.findOne(paymentScheduleInfo);
        
                                if (!existingPaymentSchedule) {
                                    await StudentPayment.create(paymentScheduleInfo);
                                }
                            }
                        }

                        // For setting student assistance 
                        // Get students id in StudentDiscount table
                        // After getting studentDiscount id, insert in StudentPayment Table
                        // Considerations -> must be same student id 
                        // eto ang titingnan dapat ng system:

                        // -nationality
                        // -gradelevel
                        // -payment term
                        // -scholarship (kung meron)
                        // -Sibling Rank
                        // -Employee Gia (kung may parent na worker doon sa school)

                        // dapat lahat yan nakalagay sa profile table or academic table para magamit ng system sa pag match

                        // Ilagay sa Student Discount Table
                        for(const studentDiscount of studentDiscounts) {
                            const matchingStudent = studentDiscount.studentId._id.equals(student._id);

                            if(matchingStudent) {
                                // console.log('Student Discount:', {
                                //     sessionId: currYear._id,
                                //     studentId: student._id,
                                //     gradeLevelId: student.academicId.gradeLevelId._id,
                                //     studentDiscountId: studentDiscount._id,
                                // });
        
                                const studentDiscountInfo = {
                                    sessionId: currYear._id,
                                    studentId: student._id,
                                    gradeLevelId: student.academicId.gradeLevelId._id,
                                    studentDiscountId: studentDiscount._id,
                                    recordStatus: 'Live'
                                };
        
                                const existingStudentDiscount = await StudentPayment.findOne(studentDiscountInfo);
        
                                if (!existingStudentDiscount) {
                                    await StudentPayment.create(studentDiscountInfo);
                                    console.log('Student Discount has been created')
                                }
                            }
                        }

                    }
                        

                }
    
                res.status(200).json({ mssg: 'Fees for students have been generated successfully' });
            } else {
                res.status(404).json({ mssg: 'Current school year not found' });
            }
        } else {
            res.status(400).json({mssg: 'Please generate a payment schedule before creating fees'})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};




module.exports.delete_generated_fees = async (req,res) => {

    const { session } = req.body;
    try {
        await StudentPayment.deleteMany({ sessionId: session });
        res.status(200).json({ mssg: 'All fees has been removed' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'Server error' });
    }
}


// For Student Payment

module.exports.get_student_payments = async (req,res) => {

    const { session } = req.query;
    
    try {
        const studPayments = await StudentPayment.find({ sessionId: session,recordStatus: 'Live' })
        .populate({ path: 'studentId', 
            populate: [
                { path: 'nationality' },
                { path: 'academicId', populate: 'paymentTermId' }
            ]
        })
        .populate({path: 'textBookId', 
            populate: [
                { path: 'strand' }
            ]
        })
        .populate({ path: 'studentDiscountId',
            populate: [
                { path: 'discountId' }
            ]
        })
        .populate('sessionId gradeLevelId feeCodeId manageFeeId paymentScheduleId');
        res.status(200).json(studPayments);
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg:'An error occured while fetching student payments' });
    }
}

module.exports.get_student_payment_detail = async (req,res) => {
    const { id } = req.params;
    
    const { session } = req.query;
   
    try {
        const studentPayments = await StudentPayment.find({ studentId: id,sessionId: session,recordStatus: 'Live' })
        .populate({ path: 'studentId', 
            populate: [
                { path: 'nationality' },
                { path: 'academicId', populate: 'paymentTermId' }
            ]
        })
        .populate({path: 'textBookId', 
            populate: [
                { path: 'strand' }
            ]
        })
        .populate({ path: 'studentDiscountId',
            populate: [
                { path: 'discountId' }
            ]
        })
        .populate('sessionId gradeLevelId feeCodeId manageFeeId paymentScheduleId');
        res.status(200).json(studentPayments);
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg:'An error occured while fetching student payments' });
    }
}

// For Payment Schedule

module.exports.get_payment_schedule = async (req,res) => {

    const { session } = req.query;

    try {
        const paymentSchedules = await PaymentSchedule.find({ sessionId:session,recordStatus: 'Live' })
        .populate('sessionId paymentTermId');
        res.status(200).json(paymentSchedules);
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while fetching payment schedules' });
    }
}


module.exports.add_payment_schedule = async (req, res) => {
    const { session, isReset, currentUserId: inputter } = req.body;

    // Create logic here if isReset = true, then delete PaymentSchedule

    try {
        // Get Payment Terms
        const paymentTerms = await PaymentTerm.find({ recordStatus: 'Live' });

        // Get the current start of school year
        const currentSchoolYear = await SchoolYear.findById(session);
        const yearStart = currentSchoolYear.startYear;
        const initialStartDate = moment(yearStart);

        if(isReset) {
            await PaymentSchedule.deleteMany({ sessionId:session });
        }

        // Create a program that will create a schedule depending on the month iteration 
        let paymentSchedule = [];

        for (const paymentTerm of paymentTerms) {
            const { installmentBy, _id: paymentTermId, payEvery } = paymentTerm;
            
            let startDate = initialStartDate.clone(); // Reset the startDate to initial start date for each term

            for (let j = 0; j < installmentBy; j++) {
                paymentSchedule.push({
                    sessionId: currentSchoolYear._id,
                    paymentTermId: paymentTermId,
                    dateSchedule: startDate.format('YYYY-MM-DD'),
                    inputter,
                    recordStatus: 'Live'
                });

                startDate.add(payEvery, 'months'); // Increment the date by one month for the next installment
            }
        }

        // Further logic to save the paymentSchedule to the database
        for (const sched of paymentSchedule) {
            const schedExists = await PaymentSchedule.findOne(sched);

            if (schedExists) {
                throw new Error(`This payment schedule is already existing, please reset first to generate again`);
            }

            await PaymentSchedule.create(sched);
        }

        res.status(200).json({ mssg: 'Payment schedule has been created successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ mssg: 'An error occurred while generating payment schedule' });
    }
}

// Student Subjects

module.exports.get_student_subjects = async(req,res) => {

    const { session } = req.query;

    try {
        const studentSubjects = await StudentSubject.find({ recordStatus: 'Live', sessionId: session })
        .populate({ path: 'studentId', populate: {
            path: 'academicId', populate: {
                path: 'strandId'
            }
        }})
        .populate({ path: 'studentId', populate: {
            path: 'academicId', populate: {
                path: 'gradeLevelId'
            }
        }})
        .populate({ path: 'studentId', populate: {
            path: 'academicId', populate: {
                path: 'sectionId'
            }
        }})
        .populate({ path: 'teacherSubjectId', populate: {
            path: 'teacherId subjectId roomNumberId'
        } })
        .populate('subjectId inputter');

        const teacherSubjects = await TeacherSubject.find({ recordStatus: 'Live', sessionId: session });

        res.status(200).json(studentSubjects);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student subjects record' });
    }
}

// Assigning subjects per student

module.exports.assign_subject_to_students = async (req, res) => {
    const { session, currentUserId } = req.query;

    try {
        // Check if there are already TeacherSubject content for current session
        const teachersSubject = await TeacherSubject.find({ sessionId: session, recordStatus: 'Live' })
            .populate('subjectId teacherId roomNumberId');
        if (teachersSubject.length < 1) {
            return res.status(404).json({ mssg: 'Teachers must be assigned a schedule and room number before assigning subjects' });
        }

        // Delete current subjects if clicked again for the same session
        await StudentSubject.deleteMany({ sessionId: session });

        // Get all students who are registered, enrolled, and admitted
        const academicOfStudents = await Academic.find({
            sessionId: session,
            recordStatus: 'Live',
            isAdmitted: true,
            isRegistered: true
        }).populate('gradeLevelId strandId');

        // Get all subjects for the session
        const subjects = await Subject.find({
            sessionId: session,
            recordStatus: 'Live'
        }).populate('gradeLevelId');

        for (const acadOfStud of academicOfStudents) {
            if(acadOfStud.gradeLevelId) {
                // Assign subjects to students here
                const gradeLevelOfStudent = acadOfStud.gradeLevelId.gradeLevel.toLowerCase();
                const strandOfStudent = acadOfStud?.strandId?.strand?.toLowerCase();

              

                for(const subject of subjects) {
                    const subjectLevel = subject.gradeLevelId.gradeLevel.toLowerCase();
                    const strand = strandOfStudent ? subject.subjectCode.toLowerCase().includes(strandOfStudent) : true;

                    // Find the corresponding teacher's subject
                    // 1. Check teachers subject
                    // 2. Check subject of students and their strands
                    const teacherSubject = teachersSubject.find(ts => {
                        if(ts.subjectId.subjectCode.toLowerCase() === subject.subjectCode.toLowerCase()) {
                            if(ts.subjectId?.subjectName.toLowerCase() === subject.subjectName.toLowerCase()) {
                                return ts
                            }
                        }
                    });
                    
                    

                    // If same grade level and strand match or there's no strand requirement, create a student subject
                    if(subjectLevel === gradeLevelOfStudent && (!acadOfStud.strandId || strand)) {
                        const studentSubjectData = {
                            subjectId: subject._id,
                            studentId: acadOfStud.studentId,
                            sessionId: session,
                            inputter: currentUserId,
                            recordStatus: 'Live',
                        };

                        // Add teacherSubjectId if a teacher is found teaching that subject and strand
                        if(teacherSubject) {
                            studentSubjectData.teacherSubjectId = teacherSubject._id;
                        }

                        await StudentSubject.create(studentSubjectData);

                        // console.log('Student subject has been created');
                    }
                }
            }
        }

        res.status(200).json({ mssg: 'Assigning of subjects per student is successful' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while assigning subject to students' });
    }
};


// Teacher Subject 
module.exports.get_teacher_subject = async (req,res) => {

    const { session } = req.query;

    try {
        const teacherSubjects = await TeacherSubject.find({ sessionId: session, recordStatus: 'Live' })
        .populate('teacherId subjectId roomNumberId');
        res.status(200).json(teacherSubjects);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching subjects with assigned teacher' });
    }
}

module.exports.get_teacher_subject_details = async (req,res) => {

    const { id } = req.params;
    const { session } = req.query;

    try {
        const teacherSubject = await TeacherSubject.findOne({ _id: id, recordStatus: 'Live', sessionId: session })
        .populate('teacherId roomNumberId subjectId')
        console.log(teacherSubject);
        
        if(!teacherSubject) {
            return res.status(404).json({ mssg: 'There are no teachers assigned to subjects yet' });
        }

        res.status(200).json(teacherSubject);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching teacher subject detail' });
    }
}

// Assuming TeacherSubject, TeacherAcademic, and Teacher models are properly imported here

module.exports.add_teacher_subject = async (req, res) => {
    const { roomNumberId, subjectId, startTime, endTime, inputter, teacherId, sessionId, daySchedule } = req.body;
    
    try {
        // Find the teacher by ID
        const assignedTeacher = await Teacher.findById(teacherId);

        // Check if any other teacher is already teaching this subject
        const teacherSubjectExists = await TeacherSubject.findOne({ subjectId }).populate('teacherId');
        if (teacherSubjectExists) {
            return res.status(400).json({
                mssg: `${teacherSubjectExists.teacherId.firstName} ${teacherSubjectExists.teacherId.lastName} is already teaching this subject, please select another subject`
            });
        }

        // Create the teacher subject entry
        const teacherSubject = await TeacherSubject.create({
            roomNumberId,
            subjectId,
            startTime,
            endTime,
            inputter,
            teacherId,
            recordStatus: 'Live',
            sessionId,
            daySchedule
        });

        // Create teacher academic record after assigning a subject
        const teacherAcademic = await TeacherAcademic.create({
            teacherSubjectId: teacherSubject._id,
            inputter,
            sessionId,
            recordStatus: 'Live'
        });

        // Update teacher's teacherAcademicId (append instead of replacing)
        await Teacher.findByIdAndUpdate(teacherId, {
            $push: { teacherAcademicId: teacherAcademic._id }
        });

        res.status(200).json({
            mssg: `Teacher ${assignedTeacher.firstName} with subject for schedule of ${startTime} to ${endTime} has been assigned successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mssg: 'An error occurred while assigning subject to teacher' });
    }
};


module.exports.delete_teacher_subject = async (req,res) => {

    const { id } = req.params;
    
    try {
        await TeacherSubject.findByIdAndUpdate({ _id: id }, { recordStatus: 'Deleted' });
        res.status(200).json({ mssg: 'Teacher subject has been deleted successfully' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occured while deleting teacher subject record' });
    }

}

module.exports.edit_assigned_teacher_subject = async (req,res) => {
    
    const { id } = req.params;
    const { roomNumberId,teacherId,subjectId,startTime,endTime,inputter,daySchedules:daySchedule } = req.body;
    
    try {
        const teacher = await Teacher.findById(teacherId);

        if(!teacher) {
            res.status(404).json({ mssg: `This teacher is not an existing record` });
        }

        await TeacherSubject.findByIdAndUpdate(id, { roomNumberId,teacherId,subjectId,startTime,endTime,inputter,daySchedule });
        res.status(200).json({ mssg: `Assigned subject to teacher ${teacher.firstName} has been updated successfully!` })
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while updating teacher assigned subject' })
    }
}


// Teacher Academic

module.exports.get_teacher_academics = async (req,res) => {
    const { session } = req.query;

    try {
        const teacherAcademics = await TeacherAcademic.find({ recordStatus: 'Live', sessionId: session })
        .populate(
            { path: 'teacherSubjectId', populate: {
                path: 'teacherId subjectId'
            } }
        );
        if(!teacherAcademics) {
            return res.status(404).json({ mssg: 'Teachers academic record is empty' });
        }

        res.status(200).json(teacherAcademics)
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching teacher academic records' })
    }
}


