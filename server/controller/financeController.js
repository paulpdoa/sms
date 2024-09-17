const StudentPayment = require('../model/StudentPayment');
const Student = require('../model/Students');
const User = require('../model/Users');
const Finance = require('../model/Finance');

module.exports.get_finance_dashboard = async (req,res) => {

    const { session } = req.query;
    const { userId } = req.params;
    let financeName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const finance = await Finance.findById(user.financeId);
        if(!finance) {
            return res.status(404).json({ mssg: 'Finance information is not existing' });
        }
        financeName = `${finance.firstName} ${finance.middleName} ${finance.lastName}`;

        res.status(200).json({ financeName });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching finance dashboard details' });
    }
}

module.exports.get_finance_payment_schedule = async(req,res) => {

   
    const { session } = req.query;
    const { userId } = req.params;
    let financeName = '';

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const finance = await Finance.findById(user.financeId);
        if(!finance) {
            return res.status(404).json({ mssg: 'Finance information is not existing' });
        }
        financeName = `${finance.firstName} ${finance.middleName} ${finance.lastName}`;

        const students = await Student.find({ recordStatus: 'Live' }).populate({ path: 'academicId', populate: {
            path: 'gradeLevelId'
        } });
        if(!students) {
            return res.status(404).json({ mssg: 'Student information is not existing' });
        }
        const studentFilteredLists = students.filter(student => student.academicId?.isAdmitted && student.academicId?.isRegistered && student.academicId?.isEnrolled && student?.academicId?.isAssessed && student?.academicId?.gradeLevelId);

        const studentPayments = await StudentPayment.find({ recordStatus: 'Live', sessionId: session })
        .populate({ path: 'paymentScheduleId', populate: {
            path: 'paymentTermId'
        } })
        .populate({ path: 'manageFeeId', populate: {
            path: 'feeDescription', populate: {
                path: 'feeCateg'
            }
        } })
        .populate('feeCodeId gradeLevelId textBookId studentDiscountId')
        if(!studentPayments) {
            return res.status(404).json({ mssg:'Student payments is not existing' });
        }


        res.status(200).json({ financeName, students: studentFilteredLists, studentPayments });
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching finance dashboard details' });
    }
}

module.exports.get_finance_account_payments = async (req, res) => {
    const { userId } = req.params;
    const { session } = req.query;

    let financeName = '';

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ mssg: 'User is not existing' });
        }

        const finance = await Finance.findById(user.financeId);
        if (!finance) {
            return res.status(404).json({ mssg: 'Finance information is not existing' });
        }
        financeName = `${finance.firstName} ${finance.middleName} ${finance.lastName}`;

        const students = await Student.find({ recordStatus: 'Live' }).populate({
            path: 'academicId', populate: { path: 'gradeLevelId' }
        });
        if (!students) {
            return res.status(404).json({ mssg: 'Student information is not existing' });
        }

        const studentFilteredLists = students.filter(student => 
            student.academicId?.isAdmitted && student.academicId?.isRegistered && 
            student.academicId?.isEnrolled && student?.academicId?.isAssessed && 
            student?.academicId?.gradeLevelId
        );

        const studentPayments = await StudentPayment.find({ recordStatus: 'Live', sessionId: session })
            .populate({ path: 'paymentScheduleId', populate: { path: 'paymentTermId' } })
            .populate({ path: 'manageFeeId', populate: { path: 'feeDescription', populate: { path: 'feeCateg' } } })
            .populate('feeCodeId gradeLevelId textBookId studentDiscountId');

        if (!studentPayments) {
            return res.status(404).json({ mssg: 'Student payments is not existing' });
        }

        // Grouping payments by studentId and summing textbook amounts
        const studentPaymentLists = studentPayments.reduce((acc, studentPayment) => {
            const studentId = studentPayment.studentId;
            const bookAmount = studentPayment.textBookId ? studentPayment.textBookId.bookAmount : 0;
            const miscellaneousAmount = studentPayment?.manageFeeId?.feeDescription?.feeCateg?.category === 'Miscellaneous' 
            ? studentPayment.manageFeeId.amount : 0; 
            

            if (!acc[studentId]) {
                acc[studentId] = {
                    ...studentPayment._doc, // Copy the studentPayment data
                    textbookTotalAmount: bookAmount, // Initialize total amount with the book amount
                    miscTotalAmount: miscellaneousAmount
                };
            } else {
                // If the student already exists in the accumulator, add the book amount
                acc[studentId].textbookTotalAmount += bookAmount;
                acc[studentId].miscTotalAmount += miscellaneousAmount;  
            }

            return acc;
        }, {});

        // Convert the result back into an array
        const studentPaymentArray = Object.values(studentPaymentLists);

        res.status(200).json({ financeName, students: studentFilteredLists, studentPayments: studentPaymentArray });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching finance dashboard details' });
    }
};


// For payments

module.exports.add_finance_payment = async(req,res) => {
    
}