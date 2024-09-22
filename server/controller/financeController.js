const StudentPayment = require('../model/StudentPayment');
const Student = require('../model/Students');
const User = require('../model/Users');
const Finance = require('../model/Finance');
const PaymentTransaction = require('../model/PaymentTransaction');

const crypto = require('crypto');

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
    // Get the total textbook, tuition fee, and miscellaneous amounts   
   
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
            path: 'gradeLevelId sectionId'
        } })
        .populate('sessionId')
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

        const students = await Student.find({ recordStatus: 'Live' })
        .populate({
            path: 'academicId',
            populate: [
                { path: 'gradeLevelId' },  // Separate populate for gradeLevelId
                { path: 'strandId' },      // Separate populate for strandId
                { path: 'sectionId' },     // Separate populate for sectionId
                { path: 'paymentTermId' }  // Separate populate for paymentTermId
            ]
        })
        .populate('nationality')
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

        res.status(200).json({ financeName, students: studentFilteredLists, studentPayments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching finance dashboard details' });
    }
};


// For payments

module.exports.add_finance_payment = async (req, res) => {
    const { cleanupPaymentsData: paymentRecords } = req.body;

    try {
        const referenceCode = crypto.randomBytes(3).toString('hex').toUpperCase() + '-' + Date.now();
        for (const payment of paymentRecords) {
            console.log('Payment Amount: ', payment.amount)

            // split the numbers into a real number before inserting to the table
            // const convertedToNumber = Number((payment.amount).split('.')[0]);

            
            const studentPaymentExist = await StudentPayment.findById(payment._id);
            // Generate reference code
            if (studentPaymentExist) {
                console.log('Posting payment to table');
                await PaymentTransaction.create({
                    sessionId: payment.sessionId,
                    inputter: payment.inputter,
                    studentPaymentId: payment._id,
                    amountPaid: payment.amount,
                    referenceCode: referenceCode,
                    recordStatus: 'Live',
                    studentId: payment.studentId
                });

                await StudentPayment.findByIdAndUpdate(payment._id, { isPaid: true, inputter: payment.inputter });
                console.log('Student Payment record has been paid');
            } else {
                // Additional fees, no studentPaymentId
                await PaymentTransaction.create({
                    sessionId: payment.sessionId,
                    inputter: payment.inputter,
                    amountPaid: payment.amount,
                    referenceCode: referenceCode,
                    recordStatus: 'Live',
                    studentId: payment.studentId
                });
            }
        }

        res.status(200).json({ mssg: 'Payment has been posted' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while posting payment transactions' });
    }
};

module.exports.get_finance_payment_transactions = async (req,res) => {
    const { session } = req.query;

    try {
        const paymentTransactions = await PaymentTransaction.find({ sessionId: session, recordStatus: 'Live' });
        if(!paymentTransactions) {
            return res.status(404).json({ mssg: 'Payment transaction is not existing' });
        }

        res.status(200).json(paymentTransactions);
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching payment transactions' });
    }
}

// For payment history
module.exports.get_finance_payment_history = async(req,res) => {
    const { session } = req.query;
    const { userId } = req.params;

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

        const students = await Student.find({ recordStatus: 'Live' })
        .populate({
            path: 'academicId',
            populate: [
                { path: 'gradeLevelId' },  // Separate populate for gradeLevelId
                { path: 'strandId' },      // Separate populate for strandId
                { path: 'sectionId' },     // Separate populate for sectionId
                { path: 'paymentTermId' }  // Separate populate for paymentTermId
            ]
        })
        .populate('nationality')
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

        const paymentTransactions = await PaymentTransaction.find({ recordStatus: 'Live', sessionId: session })
        .populate('studentId')
        .populate({ path: 'studentPaymentId', populate: [
            { path: 'feeCodeId paymentScheduleId textBookId' },
            { path: 'manageFeeId', populate: [
                { path: 'feeDescription', populate: 'feeCateg' }
            ] }
        ] })
        if(!paymentTransactions) { 
            return res.status(404).json({ mssg: 'Payment transaction is not existing' });
        }

        res.status(200).json({ financeName, students: studentFilteredLists, studentPayments,paymentTransactions });

    } catch(err) {
        console.log(err);
    }
}