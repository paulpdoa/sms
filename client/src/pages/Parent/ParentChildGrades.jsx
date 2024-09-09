import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState, useEffect } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const ParentChildGrades = () => {

    const { currentUserId,searchQuery } = useContext(MainContext);
    const { records } = useFetch(`${baseUrl()}/parent-child-grades/${currentUserId}`);
    const [showGrades,setShowGrades] = useState(false);

    const [subjectViewed,setSubjectViewed] = useState({ currentSubject: '', selectedAcademicPeriod: '1st Grading' });

    const academicPeriods = [
        { id: 1, academicPeriod: '1st Grading' },
        { id: 2, academicPeriod: '2nd Grading' },
        { id: 3, academicPeriod: '3rd Grading' },
        { id: 4, academicPeriod: '4th Grading' }
    ]

    const studentSubjectsColumns = [
        // { accessorKey: 'student', header: 'Student' },
        { accessorKey: 'subject', header: 'Subject' },
        // { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'teacher', header: 'Teacher' }
    ]

    const studentSubjects = records?.studentSubjects?.map(studentSubject => ({
        ...studentSubject,
        // student: `${studentSubject.studentId.firstName} ${studentSubject.studentId.lastName}`,
        subject: `${studentSubject.subjectId.subjectName} - ${studentSubject.subjectId.subjectCode}`,
        teacher: `${studentSubject.teacherSubjectId.teacherId.firstName} ${studentSubject.teacherSubjectId.teacherId.middleName} ${studentSubject.teacherSubjectId.teacherId.lastName}`
    }));
    const viewMyGrades = (record) => {
        setSubjectViewed({ currentSubject: `${record.subjectId.subjectName} - ${record.subjectId.subjectCode}` });
        const gradesPerSubject = records?.studentGrades.filter(sg => sg.subjectId._id === record.subjectId._id);
        console.log(gradesPerSubject);
        setShowGrades(true);
    }


    const gradesOfSubjectsSelectedColumns = [
        { accessorKey: 'gradingCategoryId.gradingCategory', header: 'Category', editable: true },
        { accessorKey: 'studentScore', header: 'Student Score',editable: true, type: 'number' },
        { accessorKey: 'dueDate', header: 'Due Date', editable: true },
        { accessorKey: 'dateTaken', header: 'Date Taken', editable: true },
        { accessorKey: 'taskTotal', header: 'Task Total',editable: true },
        { accessorKey: 'passingScore', header: 'Passing Score', editable: true },
        { accessorKey: 'gradeRemark', header: 'Grade Remarks',editable: true },
        { accessorKey: 'remarks', header: 'Remarks',editable: true }
    ]
    const gradesOfSubjectsSelectedData = records?.studentGrades?.filter(studentGrade => studentGrade.academicPeriod === subjectViewed.selectedAcademicPeriod && `${studentGrade.subjectId.subjectName} - ${studentGrade.subjectId.subjectCode}` === subjectViewed.currentSubject)?.map(studentGrade => ({
        ...studentGrade
    }));

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center relative">
            <header className="w-full bg-white shadow-md py-6 px-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.parentName}!</h1>
                <p className="text-sm text-gray-500">Parent of {records?.studentName}</p>
            </header>
            <section className="w-full px-4 mt-5">
                {/* <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Grades List</h2> */}
                <TabActions title="Your Grades List" noView={true} />
                <MasterTable 
                    columns={studentSubjectsColumns}
                    data={studentSubjects ?? []}
                    searchQuery={searchQuery}
                    viewRecord={viewMyGrades}
                />
            </section>

            {/* Modal for grades popup */}
            { showGrades && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md w-auto relative p-6">

                        <h2 className="font-bold text-gray-700 text-2xl">{subjectViewed.currentSubject}</h2>
                        
                        <div className="flex items-center gap-2 mt-2">
                        { academicPeriods.map(academicPeriod => (
                            <button
                                key={academicPeriod.id}
                                onClick={() => {
                                    setSubjectViewed({ selectedAcademicPeriod: academicPeriod.academicPeriod, currentSubject: subjectViewed.currentSubject })
                                }}
                                className={`${ subjectViewed.selectedAcademicPeriod === academicPeriod.academicPeriod ? 'bg-blue-500 hover:bg-blue-600 text-gray-100' : 'border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-gray-100' } p-2 text-sm  rounded-md transition`}
                            >
                                {academicPeriod.academicPeriod}
                            </button>
                        )) }
                        </div>

                        <div className="mt-5">
                            <MasterTable 
                                columns={gradesOfSubjectsSelectedColumns}
                                data={gradesOfSubjectsSelectedData ?? []}
                                searchQuery={searchQuery}
                                disableAction={true}
                            />
                        </div>

                        <button 
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowGrades(false)}
                        >
                            Cancel
                        </button>
                        {/* Modal content goes here */}
                    </div>
                </div>
            )}


        </main>
    )
}

export default ParentChildGrades;