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
        const studentFilteredLists = students.filter(student => student.academicId?.isAdmitted && student.academicId?.isRegistered);

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