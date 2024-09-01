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


const StudentGrading = () => {

    // Table of students
    // After clicking view, will display subjects taken by student
    // After clicking the subject, scores will be displayed depending on category 

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: studentSubjects } = useFetch(`${baseUrl()}/student-subjects`);
    const { searchQuery,showForm,currentUserId,setShowForm, session, role } = useContext(MainContext);

    const [student,setStudent] = useState({});
    const [showStudentSubject,setShowStudentSubject] = useState(false);

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

        try {

        } catch(err) {
            console.log(err);
        }
    }

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add Student Grade</h1>

        </>
    )

    const viewStudentsGrade = (student) => {
        setStudent(student);
        // Will show popup for students subjects and grades
        setShowStudentSubject(true);
    }

    const getStudentGrades = (id) => {
        console.log(id)
    }

    

    return (
        <main className="p-2 relative">
            <TabActions title="Student Grades" />
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addStudentGrade,setShowForm) }
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
                            }} className="text-red-500 text-sm hover:text-red-600 cursor-pointer">Close</button>
                        </div>
                        <div className="flex gap-2 items-center mt-3">
                            { studentSubjects?.filter(studSubj => student._id === studSubj.studentId._id).map(student => (
                                <button
                                    onClick={() => getStudentGrades(student)} 
                                    className="text-sm hover:bg-gray-700 hover:text-gray-300 transition text-gray-800 font-semibold p-2 rounded-md border border-gray-400" 
                                    key={student._id}>
                                    {student.subjectId.subjectName} - {student.subjectId.subjectCode}
                                </button>
                            )) }
                        </div>
                    </div>
                </div>
            ) }
            <ToastContainer />      
        </main>
    )
}

export default StudentGrading;