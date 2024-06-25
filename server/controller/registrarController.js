const Student = require('../model/Students');
const Admission = require('../model/Admission');
const SchoolYear = require('../model/SchoolYear');
const Academic = require('../model/Academic');
const Requirement = require('../model/Requirement');
const Discount = require('../model/Discount');

module.exports.get_students = async (req,res) => {
    try {
        // const students = await Student.find().populate('sex religion nationality sy_id gradeLevel academicId');
        const students = await Student.find()
        .populate({ path: 'academicId',populate: { path: 'studentId' } })
        .populate({ path: 'academicId', populate: { path: 'strandId' } })
        .populate({ path: 'academicId', populate: { path: 'departmentId' } })
        .populate({ path: 'academicId', populate: { path: 'gradeLevelId' } })
        .populate({ path: 'academicId', populate: { path: 'sessionId' } })
        .populate('sex religion nationality sy_id gradeLevel');
        res.status(200).json(students);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_student = async (req,res) => {
    const { firstName,middleName,lastName,suffix,dateOfBirth,age,sex,religion,nationality,placeOfBirth,email,contactNumber,address } = req.body;
    const isAdmitted = false;
    const status = 'New'

   
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
        const studentFind = await Student.findById(id)
        .populate({ path: 'academicId',populate: { path: 'studentId' } })
        .populate({ path: 'academicId', populate: { path: 'strandId' } })
        .populate({ path: 'academicId', populate: { path: 'departmentId' } })
        .populate({ path: 'academicId', populate: { path: 'gradeLevelId' } })
        .populate({ path: 'academicId', populate: { path: 'sessionId' } })
        .populate('sex religion nationality sy_id gradeLevel');
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



module.exports.add_admission = async (req, res) => {
    const { schoolYear, studentId, requirements } = req.body;
    
    try {
        // Fetch all required documents
        const requiredDocs = await Requirement.find({});
        const requiredDocIds = requiredDocs.map(doc => doc._id.toString());

        // Check if the student already submitted the required documents
        const existingAdmissions = await Admission.find({ studentId });
        const existingDocIds = existingAdmissions.map(admission => admission.requirementId.toString());

        // Remove existing admissions that are no longer in the submitted requirements
        const toRemove = existingDocIds.filter(id => !requirements.includes(id));
        for (let i = 0; i < toRemove.length; i++) {
            await Admission.findOneAndDelete({ studentId, requirementId: toRemove[i] });
        }

        // Add new requirements
        const toAdd = requirements.filter(id => !existingDocIds.includes(id));
        for (let i = 0; i < toAdd.length; i++) {
            await Admission.create({ schoolYear, studentId, requirementId: toAdd[i] });
        }

        // Combine existing and new submissions
        const allSubmittedDocs = [...new Set([...existingDocIds, ...requirements])];

        // Check if the student has submitted all required documents
        const allRequirementsMet = requiredDocIds.every(docId => allSubmittedDocs.includes(docId));

        if (allRequirementsMet) {
            // Admit the student
            await Student.findByIdAndUpdate(studentId, { isAdmitted: true, dateAdmitted: new Date() });
        } else {
            // Set isAdmitted to false if any requirement is unchecked
            await Student.findByIdAndUpdate(studentId, { isAdmitted: false });
        }

        res.status(200).json({ mssg: 'Student requirement has been updated' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'Server error' });
    }
};


module.exports.get_admission_student = async (req,res) => {
    const { student } = req.params;

    try {
        const admission = await Admission.find({ studentId: student });
        res.status(200).json(admission);
    } catch(err) {
        console.log(err);
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
        lrn,
        passedReportCard,
        settledArrears,
        completedClearance,
        session,
        isRegistered,
    } = req.body;

    if(completedClearance && passedReportCard && settledArrears) {
        isRegistered = true
    } else {
        isRegistered = false;
    }

    console.log(`Clearance-${completedClearance} /n ReportCard-${passedReportCard} /n Arrears-${settledArrears}`)

    try {
        // Fetch the latest registered student sorted by creation date
        const latestStudent = await Student.findOne({ isRegistered: true }).sort({ _id: -1 });
        console.log("Latest student:", latestStudent);

        const isStudentRegistered = await Student.findById(id);
        const currentSession = await SchoolYear.findById(session);

        if (currentSession) {
            currentYear = currentSession.startYear.split('-')[0];
        } else {
            return res.status(400).json({ mssg: 'Session not found' });
        }

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
                lrn,
                passedReportCard,
                settledArrears,
                completedClearance,
                isRegistered
            },
            { new: true }
        );

        if (isRegistered) {
            dateRegistered = new Date();

            // Ensure student number is only assigned if the student is newly registered
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
    try {
        const academics = await Academic.find().populate('gradeLevelId studentId departmentId strandId sessionId');
        res.status(200).json(academics);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_student_academic = async (req,res) => {
    
    try {
        const studentAcademic = await Academic.find().populate({ path: 'studentId' });
        res.status(200).json(studentAcademic);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_student_academic_detail = async (req,res) => {
    const { studentId } = req.params;
    
    try {
        const studentAcademic = await Academic.find({ studentId },{ sort: { 'createdAt': -1 } });
        res.status(200).json(studentAcademic);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_academic = async (req,res) => {

    const { strandId,departmentId,gradeLevelId,sessionId,studentId,lastSchoolAttended } = req.body;

    // This will also update students info upon posting

    try {
        
        const academic = await Academic.create({ strandId,departmentId,gradeLevelId,sessionId,studentId,lastSchoolAttended });
        console.log(academic);
        const student = await Student.findByIdAndUpdate({ _id: studentId }, { academicId: academic._id });
        res.status(200).json({ mssg: `${student.firstName} ${student.lastName}'s academic record has been created successfully` });
    } catch(err) {
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

    try {
        const discount = await Discount.find().populate('sessionId gradeLevelId');
        res.status(200).json(discount);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_discount_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const discount = await Discount.findById(id).populate('sessionId gradeLevelId');
        res.status(200).json(discount);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_discount = async (req,res) => {
    let { schoolYear: sessionId,gradeLevel: gradeLevelId,discountType,discountPercentage: discountPercent,amount,discountCode } = req.body;

    discountPercent = discountPercent / 100 //Divide to 100 to get decimal percentage equivalent

    try {
        const discount = await Discount.create({ sessionId,gradeLevelId,discountType,discountPercent,amount,discountCode });
        res.status(200).json({ mssg: `${discountType} discount has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

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

    const { sessionId,gradeLevelId,discountType,discountPercent,amount,discountCategory } = req.body;

    try {
        const discount = await Discount.findByIdAndUpdate({_id:id},{ sessionId,gradeLevelId,discountType,discountPercent,amount,discountCategory });
        res.status(200).json({ mssg: `${discount.discountType} has been updated successfully!` });
    } catch(err) {
        console.log(err);
    }
}