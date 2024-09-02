const StudentGrade = require('../model/StudentGrade');

module.exports.get_student_grades = async (req,res) => {
    const { session } = req.query;

    try {
        const studentGrades = await StudentGrade.find({ recordStatus: 'Live', sessionId: session })
        .populate('studentId subjectId gradingCategoryId')

        if(!studentGrades) {
            return res.status(404).json({ mssg: 'Student grades is empty' });
        }

        res.status(200).json(studentGrades);
;
    } catch(err) {
        console.log(err);
        res.status(500).json({ mssg: 'An error occurred while fetching student grade records' })
    }
}

module.exports.add_student_grade = async (req, res) => {
    const {
        studentId,
        subjectId,
        gradingCategoryId,
        academicPeriod,
        dateTaken,
        dueDate,
        taskTotal,
        passingScore,
        gradeRemark,
        remarks,
        studentScore,
        inputter,
        sessionId
    } = req.body;

    if(taskTotal < 1 || passingScore < 0 || studentScore < 0) {
        return res.status(400).json({ mssg: 'Scores cannot be a negative number' });
    }

    // Check if any required field is missing or empty
    const requiredFields = {
        studentId,
        subjectId,
        gradingCategoryId,
        academicPeriod,
        dateTaken,
        taskTotal,
        passingScore,
        gradeRemark,
        remarks,
        studentScore
    };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === null || value === '') {
            return res.status(400).json({ mssg: `${key} is required and cannot be empty` });
        }
    }

    // If all checks pass, proceed with creating the record
    try {
        await StudentGrade.create({
            studentId,
            subjectId,
            gradingCategoryId,
            academicPeriod,
            dateTaken,
            dueDate,
            taskTotal,
            passingScore,
            gradeRemark,
            remarks,
            studentScore,
            inputter, // assuming you have the inputter from the authenticated user
            sessionId, // assuming you have the session ID
            recordStatus: 'Live'
        });

        res.status(200).json({ mssg: 'Student grade added successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mssg: 'An error occurred while adding student grade' });
    }
};
