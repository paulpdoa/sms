import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useContext } from 'react';
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";
import MasterDataForm from '../../components/MasterDataForm';
import { Link, useParams } from 'react-router-dom';
import ViewStudentGrades from './StudentGrading/ViewStudentGrades';
import ViewStudentSubjects from './StudentGrading/ViewStudentSubjects';
import { useSnackbar } from 'notistack';


const StudentGrading = () => {

    // Table of students
    // After clicking view, will display subjects taken by student
    // After clicking the subject, scores will be displayed depending on category 

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: studentSubjects } = useFetch(`${baseUrl()}/student-subjects`);
    
    const { records: gradingCategories } = useFetch(`${baseUrl()}/grading-categories`);
    const { records: studentGrades } = useFetch(`${baseUrl()}/student-grades`);

    const { searchQuery,showForm,currentUserId,setShowForm, session, role, teacherSubjectSelected,setTeacherSubjectSelected } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();


    const { records: teacherSubjects } = useFetch(`${baseUrl()}/teachers-subject/${currentUserId}`);
    // If the user is a teacher
    const { records: user } = useFetch(`${baseUrl()}/user/${currentUserId}`);
    const currentTeacherId = user?.teacherId;
    // const { records: teacherSubject } = useFetch(`${baseUrl()}/teacher-subject/${currentUserId}`);
    // console.log(teacherSubject);

    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);

    const isYearDone = schoolYear.isYearDone;

    const [student,setStudent] = useState({});
    const [showStudentSubject,setShowStudentSubject] = useState(false);

    const academicPeriods = [
        { id: 1, academicPeriod: '1st Grading' },
        { id: 2, academicPeriod: '2nd Grading' },
        { id: 3, academicPeriod: '3rd Grading' },
        { id: 4, academicPeriod: '4th Grading' }
    ]

    // For subjects initialization
    const [currentTabSubject,setCurrentTabSubject] = useState('');

    // For current academic period selected
    const [currentAcademicPeriod,setCurrentAcademicPeriod] = useState('');

    //For student grades
    const [showStudentGrades,setShowStudentGrades] = useState(false);

    // For posting to student grades
    const [studentId,setStudentId] = useState('');
    const [subjectId,setSubjectId] = useState('');
    const [gradingCategoryId,setGradingCategoryId] = useState('');
    const [academicPeriod,setAcademicPeriod] = useState('');
    const [dateTaken,setDateTaken] = useState('');
    const [dueDate,setDueDate] = useState('');
    const [taskTotal,setTaskTotal] = useState('');
    const [passingScore,setPassingScore] = useState('');
    const [gradeRemark,setGradeRemark] = useState('');
    const [remarks,setRemarks] = useState('');
    const [studentScore,setStudentScore] = useState('');

    const [studentGradeId,setStudentGradeId] = useState('');

    const navigate = useNavigate();

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'subject', header: 'Subject' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'strand', header: 'Strand' }
    ]

    // For student grade inside popup modals
    const gradeColumns = [
        { accessorKey: 'gradingCategoryId.gradingCategory', header: 'Category', editable: true },
        { accessorKey: 'studentScore', header: 'Student Score',editable: true, type: 'number' },
        { accessorKey: 'dueDate', header: 'Due Date', editable: true },
        { accessorKey: 'dateTaken', header: 'Date Taken', editable: true },
        { accessorKey: 'taskTotal', header: 'Task Total',editable: true },
        { accessorKey: 'passingScore', header: 'Passing Score', editable: true },
        { accessorKey: 'gradeRemark', header: 'Grade Remarks',editable: true },
        { accessorKey: 'remarks', header: 'Remarks',editable: true }
    ]

    const studentGradeData = studentGrades?.filter(student => student.studentId._id === studentId && student.subjectId._id === subjectId && student.academicPeriod === currentAcademicPeriod).map(studentGrade => ({
        ...studentGrade
    }));


    const studentData = students?.filter(student => student?.academicId?.isRegistered && student?.academicId?.isAdmitted && student?.academicId?.gradeLevelId && student.academicId.sectionId).map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        gradeLevel: `${student.academicId.gradeLevelId.gradeLevel}`,
        section: `${student.academicId.sectionId?.section}`,
        strand:  student.academicId.strandId ? `${student.academicId.strandId.strand}` : 'Not Applicable'
    }));

    const subjectOfTeachers = studentSubjects?.filter(studentSubj => studentSubj?.teacherSubjectId?.teacherId?._id === currentTeacherId && `${studentSubj.subjectId.subjectName} ${studentSubj.subjectId.subjectCode}` === `${studentSubj?.teacherSubjectId?.subjectId?.subjectName} ${studentSubj?.teacherSubjectId?.subjectId?.subjectCode}`);
    const subjectOfTeachersData = subjectOfTeachers?.filter(studentSubj => {
        const filteredStudents = studentSubj.studentId.academicId?.isRegistered 
            && studentSubj.studentId.academicId?.isAdmitted 
            && studentSubj.studentId.academicId.gradeLevelId 
            && studentSubj.studentId.academicId.sectionId;
    
        const subjectOfTeacher = studentSubj?.subjectId?._id === teacherSubjectSelected;
    
        // If a subject is selected, check both subjectOfTeacher and filteredStudents
        if (teacherSubjectSelected) {
            return subjectOfTeacher && filteredStudents; // Both conditions must pass
        }
    
        // If no subject is selected, only check filteredStudents
        return filteredStudents;
    }).map(studentSubject => ({
        ...studentSubject,
        fullName: ` ${studentSubject.studentId.lastName}, ${studentSubject.studentId.firstName} ${studentSubject.studentId.middleName}`,
        subject: `${studentSubject.subjectId.subjectName} - ${studentSubject.subjectId.subjectCode}`,
        gradeLevel: `${studentSubject.studentId.academicId.gradeLevelId.gradeLevel}`,
        section: `${studentSubject.studentId.academicId.sectionId?.section}`,
        strand: studentSubject.studentId.academicId.strandId ? `${studentSubject.studentId.academicId.strandId.strand}` : 'Not Applicable'
    })).sort((a, b) => a.studentId.lastName.localeCompare(b.studentId.lastName));
    
    const renderedSubjects = new Set();

    const addStudentGrade = async (e) => {
        e.preventDefault();

        if(passingScore < studentScore) {
            setGradeRemark('Passed')
        } else {
            setGradeRemark('Failed')
        }

        const studentGradeData = {
            studentId,
            subjectId,
            gradingCategoryId,
            academicPeriod: currentAcademicPeriod,
            dateTaken,
            dueDate,
            taskTotal,
            passingScore,
            gradeRemark,
            remarks,
            studentScore,
            session,
            role
        }
        studentGradeData.inputter = currentUserId;
        studentGradeData.sessionId = session;

        console.log(studentGradeData);

        try {
            const data = await axios.post(`${baseUrl()}/student-grade`,studentGradeData);
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding student grade', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const viewStudentsGrade = (student) => {
        // Will show popup for students subjects and grades
        setShowStudentSubject(true);
        if(role === 'Teacher') {
            setStudent(student.studentId)
            setStudentId(student.studentId._id);
        } else {
            setStudent(student);
            // Set student id after clicking View on table to capture in form
            setStudentId(student._id);
        }
    }

    const getStudentGrades = (id) => {
        console.log(id);
        setCurrentTabSubject(`${id.subjectId.subjectName} - ${id.subjectId.subjectCode}`);
        console.log(`${id.subjectId.subjectName} - ${id.subjectId.subjectCode}`);

        // Set subject after clicking the tab subjects
        setSubjectId(id.subjectId._id);
    }

    const viewEditStudentGrade = (studentGrade) => {
        setShowStudentGrades(true);
        setShowStudentSubject(false)

        
        setStudentGradeId(studentGrade._id);

        // set initial values after opening view for edit mode
        setGradingCategoryId(studentGrade.gradingCategoryId._id);
        setAcademicPeriod(studentGrade.academicPeriod);
        setDateTaken(studentGrade.dateTaken);
        setDueDate(studentGrade.dueDate);
        setStudentScore(studentGrade.studentScore);
        setTaskTotal(studentGrade.taskTotal);
        setPassingScore(studentGrade.passingScore);
        setGradeRemark(studentGrade.gradeRemark);
        setRemarks(studentGrade.remarks);
    }


    // Update a students grade
    const updateStudentGrade = async (e) => {
        e.preventDefault();

        const studentGradeData = {
            studentId,
            subjectId,
            gradingCategoryId,
            academicPeriod: currentAcademicPeriod,
            dateTaken,
            dueDate,
            taskTotal,
            passingScore,
            gradeRemark,
            remarks,
            studentScore,
            role,
            session
        }

        try {
            const data = await axios.patch(`${baseUrl()}/student-grade/${studentGradeId}`,studentGradeData);
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating student grade', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add Student Grade</h1>

            <div className="grid grid-cols-3 gap-5">
                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="student">Student:</label>
                    <select 
                        className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                        onChange={(e) => setStudentId(e.target.value)}
                        value={studentId}
                        disabled
                    >
                        <option className="text-sm" value='' hidden>Select Student</option>
                        { students.length > 0 ? (
                            students?.filter(student => student.academicId?.isRegistered && student?.academicId?.isAdmitted && student?.academicId?.gradeLevelId).map(student => (
                                <option key={student._id} className="text-sm" value={student._id}>{student.firstName} {student.lastName}</option>
                            ))
                        ) : (
                            <Link className="text-sm" to='/students'>Add Student</Link>
                        ) }
                        <option className="text-sm" value="">Leave as blank</option>
                    </select>
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="subject">Subject:</label>
                    { studentId ? (
                        <select 
                            className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                            onChange={(e) => setSubjectId(e.target.value)}
                            value={subjectId}
                            disabled
                        >   
                            <option className="text-sm" value='' hidden>Select Subject</option>
                            { studentSubjects?.filter(studentSubject => studentSubject.studentId._id === studentId).map(studentSubject => (
                                    <option key={studentSubject._id} value={studentSubject.subjectId._id}>{studentSubject.subjectId.subjectName} - {studentSubject.subjectId.subjectCode}</option>
                            )) }
                        </select>
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="grading category">Grading Category:</label>
                    { studentId ? (
                        <select 
                            className="outline-none p-1 text-sm rounded-md border border-gray-300"
                            onChange={(e) => setGradingCategoryId(e.target.value)}
                        >   
                            <option className="text-sm" value='' hidden>Select Grading Category</option>
                            { gradingCategories.map(gradingCategory => (
                                    <option key={gradingCategory._id} value={gradingCategory._id}>{gradingCategory.gradingCategory}</option>
                            )) }
                        </select>
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="academic period">Academic Period:</label>
                    { studentId ? (
                        <select 
                            className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                            onChange={(e) => setAcademicPeriod(e.target.value)}
                            value={academicPeriod || currentAcademicPeriod}
                            disabled
                        >   
                            <option className="text-sm" value='' hidden>Select Academic Period</option>
                            { academicPeriods.map(academicPeriod => (
                                <option key={academicPeriod.id} value={academicPeriod.academicPeriod}>{academicPeriod.academicPeriod}</option>
                            )) }
                        </select>
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="date taken">Date Taken:</label>
                    { studentId ? (
                        <input
                        className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        type="date" onChange={(e) => setDateTaken(e.target.value)} />
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="due date">Due Date:</label>
                    { studentId ? (
                        <input
                        className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        type="date" onChange={(e) => setDueDate(e.target.value)} />
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="student score">Student Score:</label>
                    { studentId ? (
                        <input
                        className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        type="number" onChange={(e) => setStudentScore( e.target.value)} />
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="task total">Task Total:</label>
                    { studentId ? (
                        <input
                        className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        type="number" onChange={(e) => setTaskTotal(e.target.value)} />
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="passing score">Passing Score:</label>
                    { studentId ? (
                        <input
                        className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        type="number" onChange={(e) => setPassingScore(e.target.value)} />
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="grade-remarks">Grade Remarks:</label>
                    {studentId ? (
                        studentScore < passingScore ? (
                            <span className="outline-none p-1 text-sm rounded-md border border-gray-300 font-semibold text-gray-600">Failed</span>
                        ) : (
                            <span className="outline-none p-1 text-sm rounded-md border border-gray-300 font-semibold text-gray-600">Passed</span>
                        )
                        // <select
                        //     className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        //     onChange={(e) => setGradeRemark(e.target.value)}
                        //     disabled={studentScore === '' || passingScore === ''}
                        // >   
                        //     {/* <option className="text-sm" value='' hidden>Select Grade Remark</option> */}

                        //     {studentScore !== '' && passingScore !== '' ? (
                        //         Number(studentScore) < Number(passingScore) ? (
                        //             <option value="Failed">Failed</option>
                        //         ) : (
                        //             <option value="Passed">Passed</option>
                        //         )
                        //     ) : null}
                        // </select>
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    )}
                </div>



                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="remarks">Remarks:</label>
                    { studentId ? (
                        <input
                        className="outline-none p-1 text-sm rounded-md border border-gray-300"
                        type="text" onChange={(e) => setRemarks(e.target.value)} />
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
                </div>
            </div>
        </>
    )

    

    return (
        <main className="p-2 relative">
            <div className="flex items-end justify-between">
            <TabActions title="Student Grades" noView={true} />

            { role === 'Teacher' && (
                teacherSubjects && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm" htmlFor="subject">My Subjects:</label>
                        <select
                            onChange={(e) => setTeacherSubjectSelected(e.target.value)}
                            value={teacherSubjectSelected}
                            className="p-2 focus:ring-2 border-gray-300 border focus:ring-blue-500 rounded-md outline-none"
                        >
                            { teacherSubjects.map(teacherSubject => (
                                <option 
                                    value={teacherSubject.subjectId._id} 
                                    key={teacherSubject.subjectId._id}
                                >
                                    {teacherSubject.subjectId.subjectName} - {teacherSubject.subjectId.subjectCode}
                                </option>
                            )) }
                        </select>
                    </div>
                ) 
            ) }
            </div>
            
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addStudentGrade,setShowForm,'Fill Student Grades',setStudentId) }

                
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    { role === 'Teacher' ? (
                        <>
                        <MasterTable
                            data={subjectOfTeachersData}
                            columns={columns}
                            searchQuery={searchQuery}
                            // onUpdate={editAssignedSubject}
                            // onDelete={deleteAssignedSubject}                       
                            // onShow={setShowForm}
                            viewRecord={viewStudentsGrade}
                        /> 
                        </>
                    ) : (
                        <MasterTable
                            data={studentData}
                            columns={columns}
                            searchQuery={searchQuery}
                            // onUpdate={editAssignedSubject}
                            // onDelete={deleteAssignedSubject}                       
                            // onShow={setShowForm}
                            viewRecord={viewStudentsGrade}
                        />
                    ) }
                </div>
            </div>

            {/* For Student grades after clicking view inside subjects */}
            { showStudentGrades && (
                <ViewStudentGrades 
                    student={student} 
                    updateStudentGrade={updateStudentGrade}
                    studentId={studentId}
                    students={students}
                    subjectId={subjectId}
                    studentSubjects={studentSubjects}
                    gradingCategoryId={gradingCategoryId}
                    gradingCategories={gradingCategories}
                    academicPeriod={academicPeriod}
                    academicPeriods={academicPeriods}
                    dateTaken={dateTaken}
                    dueDate={dueDate}
                    studentScore={studentScore}
                    taskTotal={taskTotal}
                    passingScore={passingScore}
                    remarks={remarks}
                    setShowStudentGrades={setShowStudentGrades}
                    setShowStudentSubject={setShowStudentSubject}
                    setCurrentAcademicPeriod={setCurrentAcademicPeriod}
                    setGradeRemark={setGradeRemark}
                    setStudentScore={setStudentScore}
                    setTaskTotal={setTaskTotal}
                    setDateTaken={setDateTaken}
                    setDueDate={setDueDate}
                    setPassingScore={setPassingScore}
                    setRemarks={setRemarks}
                />
            ) }
            
            {/* Popup for students subject with grades */}
            { showStudentSubject && (
                <ViewStudentSubjects
                    student={student}
                    setStudent={setStudent}
                    setCurrentTabSubject={setCurrentTabSubject}
                    subjectOfTeachers={subjectOfTeachers}
                    academicPeriods={academicPeriods}
                    studentGrades={studentGrades}
                    currentAcademicPeriod={currentAcademicPeriod}
                    role={role}
                    renderedSubjects={renderedSubjects}
                    currentTabSubject={currentTabSubject}
                    getStudentGrades={getStudentGrades}
                    studentId={studentId}
                    subjectId={subjectId}
                    setCurrentAcademicPeriod={setCurrentAcademicPeriod}
                    gradeColumns={gradeColumns}
                    studentGradeData={studentGradeData}
                    searchQuery={searchQuery}
                    viewEditStudentGrade={viewEditStudentGrade}
                    isYearDone={isYearDone}
                    setShowStudentSubject={setShowStudentSubject}
                    setShowForm={setShowForm}
                />
            ) }
        </main>
    )
}

export default StudentGrading;