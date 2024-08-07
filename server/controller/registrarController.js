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

const moment = require('moment');

module.exports.get_students = async (req,res) => {
    try {
        // const students = await Student.find().populate('sex religion nationality sy_id gradeLevel academicId');
        const students = await Student.find()
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
        .populate({ path: 'nationality',
            populate: [
                { path: 'nationalityCodeId' }
            ]
         })
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

        console.log(filteredEnrolledStudents);
        res.status(200).json(filteredEnrolledStudents);
    } catch (err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while getting enrolled students' });
    }
};


module.exports.add_student = async (req,res) => {
    const { firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,email,contactNumber,address,currentUserId: inputter,sessionId } = req.body;
    const isAdmitted = false;

    try {
        const addStudent = await Student.create({ firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,email,contactNumber,address,isAdmitted,inputter,session });
        res.status(200).json({ mssg: `${firstName} ${lastName}'s record has been created`, redirect:'/students' });
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while adding student record'});
    }
} 

module.exports.delete_student = async (req,res) => {
    const { id } = req.params;

    try {
        const studentFind = await Student.findByIdAndDelete(id);
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
        res.status(400).json({ mssg: err.message });
    }
}

module.exports.get_student_detail = async (req, res) => {
    const { id } = req.params;  

    try {
        const studentFind = await Student.findById(id)
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
        res.status(500).json({ error: 'Internal server error' });
    }
};


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
        const admissions = await Admission.find().populate('sessionId requirementId studentId');
        res.status(200).json(admissions);
    } catch(err) {
        console.log(err);
    }
}



module.exports.add_admission = async (req, res) => {
    const { schoolYear, studentId, requirements } = req.body;
    console.log('Submitted requirements:', requirements);
    
    try {
        // Check for Academic Record of student if existing
        const studentAcademicExist = await Academic.findOne({ studentId });
        
        // Fetch all required documents
        const requiredDocs = await Requirement.find({ sessionId: schoolYear, isRequired: true });
        const requiredDocIds = requiredDocs.map(doc => doc._id.toString());
        console.log('Required Documents:', requiredDocIds);

        // Check if the student already submitted the required documents
        const existingAdmissions = await Admission.find({ studentId, sessionId: schoolYear });
        const existingDocIds = existingAdmissions.map(admission => admission.requirementId.toString());
        console.log('Existing Admissions:', existingDocIds);

        // Remove existing admissions that are no longer in the submitted requirements
        const toRemove = existingDocIds.filter(id => !requirements.includes(id));
        console.log('To Remove:', toRemove);
        for (let i = 0; i < toRemove.length; i++) {
            await Admission.findOneAndDelete({ studentId, requirementId: toRemove[i] });
        }

        // Add new requirements
        const toAdd = requirements.filter(id => !existingDocIds.includes(id));
        console.log('To Add:', toAdd);
        for (let i = 0; i < toAdd.length; i++) {
            await Admission.create({ sessionId: schoolYear, studentId, requirementId: toAdd[i] });
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
                const academic = await Academic.create({ studentId, isAdmitted: true, sessionId: schoolYear });
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
                await Academic.create({ studentId, isAdmitted: false, sessionId: schoolYear });
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
        res.status(500).json({ mssg: 'Server error' });
    }
};



module.exports.get_admission_student = async (req,res) => {
    const { student } = req.params;
    const { session } = req.query;

    try {
        const admission = await Admission.find({ studentId: student,sessionId: session });
        res.status(200).json(admission);
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while getting admission records'});
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
        const studentAcademic = await Academic.findOne({ studentId: id, sessionId: session });
        console.log('student Academic', studentAcademic);

        if (!studentAcademic?.isAdmitted) {
            return res.status(404).json({ mssg: 'Please complete students requirements first before adding academic record' });
        }

        const latestStudent = await Student.findOne({ studentNo: { $exists: true } }).sort({ _id: -1 });
        console.log('Latest Student: ', latestStudent);

        const studentAcademicNewRecord = await Academic.findByIdAndUpdate(studentAcademic._id, { isRegistered, passedReportCard, settledArrears, completedClearance, academicStatus, inputter });
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
                inputter
            },
            { new: true }
        );

        const isStudentRegistered = await Student.findById(id);
        const currentSession = await SchoolYear.findById(session);

        if (currentSession) {
            currentYear = currentSession.startYear.split('-')[0];
        } else {
            return res.status(400).json({ mssg: 'Session not found' });
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
        const academics = await Academic.find({ sessionId: session })
        .populate({ path: 'sectionId', populate: { path: 'adviser' }})
        .populate('gradeLevelId studentId departmentId strandId sessionId');
        res.status(200).json(academics);
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: 'An error occurred while fetching academic record'});
    }
}

module.exports.get_student_academic = async (req,res) => {
    const { session } = req.query;
    try {
        const studentAcademic = await Academic.find({ sessionId: session }).populate({ path: 'studentId' });
        res.status(200).json(studentAcademic);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_student_academic_detail = async (req,res) => {
    const { studentId } = req.params;
    const { session } = req.query;
    
    try {
        const studentAcademic = await Academic.find({ studentId, sessionId: session },{ sort: { 'createdAt': -1 } });
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
        const studentAcademic = await Academic.findOne({ studentId,sessionId });

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
        res.status(400).json({ mssg: 'Error on creating academic record, please ensure all fields were entered' });
    }
}

module.exports.delete_academic = async (req,res) => {
    const { id } = req.params;

    console.log(id);
    try {
        const academic = await Academic.findByIdAndDelete(id);
        res.status(200).json({mssg: `Academic record has been deleted`});
        
    } catch(err) {
        console.log(err);
        res.status(400).json({mssg:'Failed to delete academic record'});
    }
}

// For Discounts

module.exports.get_discounts = async (req,res) => {
    const { session } = req.query;
    try {
        const discount = await Discount.find({ sessionId: session }).populate('sessionId gradeLevelId inputter');
        res.status(200).json(discount);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_discount_detail = async (req,res) => {
    const { id } = req.params;
    const { session } = req.query;

    try {
        const discount = await Discount.findOne({ _id: id,sessionId: session }).populate('sessionId gradeLevelId inputter');
        res.status(200).json(discount);
    } catch(err) {
        console.log(err);
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
            await Discount.create({ sessionId, discountType, discountPercent, discountCode, inputter });
        } else {
            await Discount.create({ sessionId, gradeLevelId, discountType, discountPercent, amount, discountCode, inputter });
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

    try {
        const discount = await Discount.findByIdAndDelete(id);
        res.status(200).json({ mssg: 'Discount was deleted successfully!' });
    } catch(err) {
        console.log(err);
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
    }
}

// For Student Discount

module.exports.get_student_discounts = async (req,res) => {
    
    try {
        const studentDiscounts = await StudentDiscount.find().populate('studentId sessionId discountId inputter');
        res.status(200).json(studentDiscounts);
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_student_discount = async (req,res) => {
    const { id } = req.params;

    try {
        const studentDiscount = await StudentDiscount.findByIdAndDelete(id);
        res.status(200).json({ mssg: 'Student discount has been removed successfully!' });
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_student_discount_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const studentDiscount = await StudentDiscount.findById(id).populate('studentId sessionId discountId inputter');
        res.status(200).json(studentDiscount);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_discounts_of_student = async (req,res) => {
    const { studentId } = req.params;

    try {
        const studentDiscount = await StudentDiscount.find({ studentId: studentId }).populate('studentId sessionId discountId inputter');
        res.status(200).json(studentDiscount);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_student_discount = async (req,res) => {
    const { studentId,sessionId,discountId,inputter } = req.body;

    try {

        const discount = await Discount.findById(discountId);
        const discountPrice = discount.amount * discount.discountPercent;
        

        const studentDiscount = await StudentDiscount.create({ studentId,sessionId,discountId,inputter,discount: discountPrice });
        res.status(200).json({ mssg: 'Discount has been added to the student' });
    } catch(err) {
        console.log(err);
    }

}

module.exports.edit_student_discount = async(req,res) => {

    const { id } = req.params;
    const { studentId,sessionId,discountId,inputter } = req.body;

    try {
        const studentDiscount = await StudentDiscount.create({ studentId,sessionId,discountId,inputter });
        res.status(200).json({ mssg: 'Discount has been added to the student' });
    } catch(err) {
        console.log(err);
    }

}

// For Sectioning

module.exports.get_sectioning = async (req,res) => {
    try {
        const sectionings = await Sectioning.find({  }).populate('sessionId studentId sectionId inputter');
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
        const academicFound = await Academic.findOne({ studentId }).populate('gradeLevelId studentId');
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
        const addSectioning = await Sectioning.create({ sessionId,studentId,sectionId,inputter });
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
        const managedFees = await ManageFee.find({ sessionId: session })
        .populate({ path: 'feeDescription',populate: { path: 'feeCateg' } })
        .populate('sessionId gradeLevelId strandId');
        res.status(200).json(managedFees);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_manage_fee_detail = async(req,res) => {

    const { id } = req.params;
    const { session } = req.query;

    try {
        const managedFee = await ManageFee.findById({ _id: id,sessionId: session })
        .populate({ path: 'feeDescription',populate: { path: 'feeCateg' } })
        .populate('sessionId gradeLevelId strandId');
        res.status(200).json(managedFee);
    } catch(err) {
        console.log(err)
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
                await ManageFee.create({ sessionId,gradeLevelId:gradeLevelIds[i],nationality,strandId,feeDescription,amount,isApplied, inputter});
            } else {
                await ManageFee.create({ sessionId,gradeLevelId:gradeLevelIds[i],nationality,feeDescription,amount,isApplied, inputter });
            }

        }
        res.status(200).json({mssg: 'Fees has been added to the record'});
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error has occurred while creating fees' });
    }
}

// This function will automate the creation of fees for grade levels and assign them fees
module.exports.automate_fees = async (req, res) => {

    const { isReset,session,inputter } = req.body

    try {

        if(isReset) {
            await ManageFee.deleteMany({ sessionId: session });
        }
        // Fetch all grade levels, fees, and strands
        const [gradeLevels, fees, strands] = await Promise.all([
            GradeLevel.find(),
            FeeCode.find(),
            Strand.find({ status: true })
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
                            strandId: strand._id
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
        await ManageFee.findByIdAndDelete(id);
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
        // Fetch students who are registered and admitted
        const students = await Student.find({ isRegistered: true, isAdmitted: true })
            .populate({
                path: 'academicId',
                populate: [
                    { path: 'studentId' },
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
            .populate({
                path: 'nationality',
                populate: { path: 'nationalityCodeId' }
            })
            .populate('sex')
            .populate('religion')
            .populate('sy_id')
            .populate('gradeLevel');

        // Fetch tables to be assigned to students fees
        const manageFees = await ManageFee.find({ sessionId: currentYear })
            .populate({ path: 'feeDescription', populate: { path: 'feeCateg' } })
            .populate('sessionId gradeLevelId strandId');
        
        const textbooks = await Textbook.find({ sessionId: currentYear }).populate('inputter gradeLevel strand schoolYear');

        const paymentSchedules = await PaymentSchedule.find({ sessionId: currentYear }).populate('sessionId paymentTermId');
        const studentDiscounts = await StudentDiscount.find({ sessionId: currentYear }).populate('studentId sessionId discountId');
        console.log('Payment Schedules Lists: ' + paymentSchedules);
        console.log('Current School Year Id: ' + currentYear);
        console.log(studentDiscounts);
        // Fetch the current school year
        const currYear = await SchoolYear.findById(currentYear);

        if(paymentSchedules.length > 0) {
            if (currYear) {
                for (const student of students) {
                    let totalPaymentAmount = 0; // Initialize total amount for each student
                    for (const fee of manageFees) {
                        // Check if the fee matches the current year, student's grade level, and nationality code
                        const matchesSchoolYear = fee.sessionId?._id.equals(currYear._id);
                        const matchesGradeLevel = fee.gradeLevelId?._id.equals(student.academicId.gradeLevelId._id);
                        const matchesNationality = !fee.nationality || fee.nationality === student.nationality.nationalityCodeId?.nationality

                        console.log('Fee Conditions: ', {
                            matchesSchoolYear,
                            matchesGradeLevel,
                            matchesNationality
                        })

                        if(matchesSchoolYear && matchesGradeLevel && matchesNationality) {
                            console.log('Matching Fee:', {
                                studentName: student.firstName,
                                feeSyId: fee.sessionId._id,
                                currYearId: currYear._id,
                                feeGradeLevelId: fee.gradeLevelId._id,
                                studentGradeLevelId: student.academicId.gradeLevelId._id,
                                feeNationalityCodeId: fee.nationalityCodeId?._id,
                                studentNationalityCodeId: student.nationality.nationalityCodeId?.nationalityCode,
                                manageFeeId: fee._id,
                                amount: fee.amount // Add amount to the log
                            });
    
                            const paymentInfo = {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                feeCodeId: fee.feeDescription._id,
                                manageFeeId: fee._id,
                                amount: fee.amount // Add amount to the payment info
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
                        const matchesSchoolYear = textbook.schoolYear._id.equals(currYear._id);
                        const matchesGradeLevel = textbook.gradeLevel?._id.equals(student.academicId.gradeLevelId?._id);
                        const matchesStrand = !textbook.strand || textbook.strand._id.equals(student.academicId?.strandId?._id);
    
                        console.log('Textbook Conditions:', {
                            matchesSchoolYear,
                            matchesGradeLevel,
                            matchesStrand
                        });
    
                        if (matchesSchoolYear && matchesGradeLevel && matchesStrand) {
                            console.log('Student Textbooks:', {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                textBookId: textbook._id,
                                bookAmount: textbook.bookAmount // Add bookAmount to the log
                            });
    
                            const studentTextbook = {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                textBookId: textbook._id,
                                bookAmount: textbook.bookAmount // Add bookAmount to the textbook info
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
                        console.log(matchesSchoolYear,matchesPaymentTerm);
                        if (matchesSchoolYear && matchesPaymentTerm) {
                            console.log('Student Payment Schedule', {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                paymentScheduleId: paymentSchedule._id,
                                totalPaymentAmount, // Log the total amount,
                                payEveryAmount: totalPaymentAmount / student.academicId.paymentTermId.installmentBy
                            });
    
                            const paymentScheduleInfo = {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                paymentScheduleId: paymentSchedule._id,
                                totalPaymentAmount, // Include the total amount in the payment schedule info
                                payEveryAmount: totalPaymentAmount / student.academicId.paymentTermId.installmentBy
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
                            console.log('Student Discount:', {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                studentDiscountId: studentDiscount._id,
                            });
    
                            const studentDiscountInfo = {
                                sessionId: currYear._id,
                                studentId: student._id,
                                gradeLevelId: student.academicId.gradeLevelId._id,
                                studentDiscountId: studentDiscount._id,
                            };
    
                            const existingStudentDiscount = await StudentPayment.findOne(studentDiscountInfo);
    
                            if (!existingStudentDiscount) {
                                await StudentPayment.create(studentDiscountInfo);
                                console.log('Student Discount has been created')
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
        const studPayments = await StudentPayment.find({ sessionId: session })
        .populate({ path: 'studentId', 
            populate: [
                { path: 'nationality', populate: 'nationalityCodeId' },
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
        const studentPayments = await StudentPayment.find({ studentId: id,sessionId: session })
        .populate({ path: 'studentId', 
            populate: [
                { path: 'nationality', populate: 'nationalityCodeId' },
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
        const paymentSchedules = await PaymentSchedule.find({ sessionId:session })
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
        const paymentTerms = await PaymentTerm.find();

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
                    inputter
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
        res.status(500).json({ mssg: err.message });
    }
}


