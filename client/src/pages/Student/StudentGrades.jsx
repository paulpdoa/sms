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

const StudentGrades = () => {

    const { currentUserId,searchQuery } = useContext(MainContext);
    const { records } = useFetch(`${baseUrl()}/student-grade/${currentUserId}`);

    const studentSubjectsColumns = [
        { accessorKey: 'student', header: 'Student' },
        { accessorKey: 'subject', header: 'Subject' },
        // { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'teacher', header: 'Teacher' }
    ]

    const studentSubjects = records?.studentSubjects?.map(studentSubject => ({
        ...studentSubject,
        student: `${studentSubject.studentId.firstName} ${studentSubject.studentId.lastName}`,
        subject: `${studentSubject.subjectId.subjectName} - ${studentSubject.subjectId.subjectCode}`,
        teacher: `${studentSubject.teacherSubjectId.teacherId.firstName} ${studentSubject.teacherSubjectId.teacherId.middleName} ${studentSubject.teacherSubjectId.teacherId.lastName}`
    }));
    console.log(studentSubjects);
    const viewMyGrades = (record) => {
        console.log(record);
        console.log('records', records);
    }
    
    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center relative">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.studentName}!</h1>
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


            {/* Modal Viewing of grades of student */}
        </main>
    )
}

export default StudentGrades;