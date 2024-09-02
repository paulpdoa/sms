import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useContext } from 'react';
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";
import MasterDataForm from '../../components/MasterDataForm';
import { Link } from 'react-router-dom';


const StudentGrading = () => {

    // Table of students
    // After clicking view, will display subjects taken by student
    // After clicking the subject, scores will be displayed depending on category 

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: studentSubjects } = useFetch(`${baseUrl()}/student-subjects`);
    const { records: gradingCategories } = useFetch(`${baseUrl()}/grading-categories`);
    const { records: studentGrades } = useFetch(`${baseUrl()}/student-grades`);
    
    const { searchQuery,showForm,currentUserId,setShowForm, session, role } = useContext(MainContext);

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

    const navigate = useNavigate();

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'strand', header: 'Strand' }
    ]

    const studentData = students?.filter(student => student?.academicId?.isRegistered && student?.academicId?.isAdmitted && student?.academicId?.gradeLevelId).map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        gradeLevel: `${student.academicId.gradeLevelId.gradeLevel}`,
        section: `${student.academicId.sectionId.section}`,
        strand:  student.academicId.strandId ? `${student.academicId.strandId.strand}` : 'Not Applicable'
    }));

    const addStudentGrade = async (e) => {
        e.preventDefault();

        const studentGradeData = {
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
            studentScore
        }
        studentGradeData.inputter = currentUserId;
        studentGradeData.sessionId = session;

        try {
            const data = await axios.post(`${baseUrl()}/student-grade`,studentGradeData);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
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
                                <option className="text-sm" value={student._id}>{student.firstName} {student.lastName}</option>
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
                                    <option value={studentSubject.subjectId._id}>{studentSubject.subjectId.subjectName} - {studentSubject.subjectId.subjectCode}</option>
                            )) }
                            <option className="text-sm" value="">Leave as blank</option>
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
                                    <option value={gradingCategory._id}>{gradingCategory.gradingCategory}</option>
                            )) }
                            <option className="text-sm" value="">Leave as blank</option>
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
                            className="outline-none p-1 text-sm rounded-md border border-gray-300"
                            onChange={(e) => setAcademicPeriod(e.target.value)}
                        >   
                            <option className="text-sm" value='' hidden>Select Academic Period</option>
                            { academicPeriods.map(academicPeriod => (
                                <option key={academicPeriod.id} value={academicPeriod.academicPeriod}>{academicPeriod.academicPeriod}</option>
                            )) }
                            <option className="text-sm" value="">Leave as blank</option>
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
                    <label className="text-sm" htmlFor="grade remarks">Grade Remarks:</label>
                    { studentId ? (
                        <select 
                            className="outline-none p-1 text-sm rounded-md border border-gray-300"
                            onChange={(e) => setGradeRemark(e.target.value)}
                        >   
                            <option className="text-sm" value='' hidden>Select Grade Remark</option>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                            <option className="text-sm" value="">Leave as blank</option>
                        </select>
                    ) : (
                        <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                            Please select student first
                        </div>
                    ) }
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

    const renderSelect = () => {
        return (
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="student">Student</label>
                <select className="outline-none p-1 rounded-md border border-gray-300">
                    <option className="text-sm" value='' hidden>Select Student</option>
                    { students.length > 0 ? (
                        students?.filter(student => student.academicId?.isRegistered && student?.academicId?.isAdmitted && student?.academicId?.gradeLevelId).map(student => (
                            <option className="text-sm" value={student._id}>{student.firstName} {student.lastName}</option>
                        ))
                    ) : (
                        <Link className="text-sm" to='/students'>Add Student</Link>
                    ) }
                    <option className="text-sm" value="">Leave as blank</option>
                </select>
            </div>
        )
    }

    const viewStudentsGrade = (student) => {
        setStudent(student);
        // Will show popup for students subjects and grades
        setShowStudentSubject(true);
        console.log(student);

        // Set student id after clicking View on table to capture in form
        setStudentId(student._id);
    }

    const getStudentGrades = (id) => {
        console.log(id);
        setCurrentTabSubject(`${id.subjectId.subjectName} - ${id.subjectId.subjectCode}`);
        console.log(`${id.subjectId.subjectName} - ${id.subjectId.subjectCode}`);

        // Set subject after clicking the tab subjects
        setSubjectId(id.subjectId._id);
    }

    

    return (
        <main className="p-2 relative">
            <TabActions title="Student Grades" noView={true} />
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addStudentGrade,setShowForm,'Fill Student Grades',setStudentId) }
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    <MasterTable
                        data={studentData}
                        columns={columns}
                        searchQuery={searchQuery}
                        // onUpdate={editAssignedSubject}
                        // onDelete={deleteAssignedSubject}                       
                        // onShow={setShowForm}
                        viewRecord={viewStudentsGrade}
                    />
                </div>
            </div>

            
            {/* Popup for students subject with grades */}
            { showStudentSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-100 p-5 rounded-md w-1/2">
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold text-2xl text-gray-700">Subjects taken by {student.firstName} {student.lastName}</h1>
                            <button onClick={() => {
                                setStudent({});
                                setShowStudentSubject(false);
                                setCurrentTabSubject('');
                            }} className="text-red-500 text-sm hover:text-red-600 cursor-pointer">Close</button>
                        </div>
                        <div className="flex gap-2 items-center mt-3">
                            { studentSubjects?.filter(studSubj => student._id === studSubj.studentId._id).map(student => (
                                <button
                                    onClick={() => getStudentGrades(student)} 
                                    className={`${currentTabSubject === `${student.subjectId.subjectName} - ${student.subjectId.subjectCode}` ? 'bg-gray-700 text-gray-300 hover:bg-gray-800' : 'bg-none text-gray-800 hover:bg-gray-700 hover:text-gray-300'} text-sm transition font-semibold p-2 rounded-md border border-gray-400`} 
                                    key={student._id}>
                                    {student.subjectId.subjectName} - {student.subjectId.subjectCode}
                                </button>
                            )) }
                        </div>

                        <div>
                            { !currentTabSubject ? (
                                <p className="text-red-500 font-semibold text-sm mt-1 p-2">Please select a subject to view student grades</p>
                            ) : (
                            <div>
                               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                                    {academicPeriods.map(academicPeriod => (
                                        <button 
                                            key={academicPeriod.academicPeriod}
                                            onClick={() => setCurrentAcademicPeriod(academicPeriod.academicPeriod)} 
                                            className={`text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out 
                                                        ${currentAcademicPeriod === academicPeriod.academicPeriod 
                                                            ? 'bg-blue-500 text-white'  // Active state styles
                                                            : 'text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500'} // Default and hover styles
                                                        `}
                                        >
                                            {academicPeriod.academicPeriod}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                    {studentGrades?.filter(student => student.studentId._id === studentId && student.subjectId._id === subjectId && student.academicPeriod === currentAcademicPeriod).length > 0 
                                        ? studentGrades
                                            .filter(student => student.studentId._id === studentId && student.subjectId._id === subjectId && student.academicPeriod === currentAcademicPeriod)
                                            .map(studentGrade => (
                                                <div key={studentGrade._id} className="p-4 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out">
                                                    <h1 className="font-bold text-lg text-gray-800 mb-2">{studentGrade.academicPeriod}</h1>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        <span className="font-medium text-gray-700">{studentGrade.gradingCategoryId?.gradingCategory}</span>: 
                                                        {studentGrade.studentScore}/{studentGrade.taskTotal}
                                                    </p>
                                                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                                                        <p><span className="font-medium text-gray-700">Passing Score:</span> {studentGrade.passingScore}</p>
                                                        <p><span className="font-medium text-gray-700">Grade Remarks:</span> {studentGrade.gradeRemark}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2"><span className="font-medium text-gray-700">Date Taken:</span> {studentGrade.dateTaken}</p>
                                                    <p className="text-sm text-gray-600 mt-1"><span className="font-medium text-gray-700">Remarks:</span> {studentGrade.remarks}</p>
                                                </div>
                                            ))
                                        : (
                                            <div className="col-span-full text-center text-gray-500">
                                                <p className="text-lg font-semibold">This student doesn't have any grades for the selected subject and academic period.</p>
                                            </div>
                                        )
                                    }
                                </div>
                                <button onClick={() => {
                                    setShowForm(true)
                                    setShowStudentSubject(false);
                                }} className="text-sm bg-blue-500 hover:bg-blue-600 cursor-pointer p-2 rounded-md text-gray-100 mt-3">Add New Student Grades</button>
                            </div>
                            ) }
                        </div>
                    </div>
                </div>
            ) }
            <ToastContainer />      
        </main>
    )
}

export default StudentGrading;