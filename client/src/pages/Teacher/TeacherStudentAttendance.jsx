import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from '../../baseUrl';
import { useState, useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";

const TeacherStudentAttendance = () => {
    
    const { currentUserId,searchQuery } = useContext(MainContext);
    const { records } = useFetch(`${baseUrl()}/teacher-student-attendance/${currentUserId}`);

    const mainColumns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        
    ];
    const mainStudentData = records?.teacherStudentLists?.map(student => ({
        ...student,
        fullName: `${student.studentId.firstName} ${student.studentId.middleName} ${student.studentId.lastName}`
    }))

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
                {/* <p className="text-lg text-gray-600">Session: {session}</p> */}
            </header>


            <section className="w-full px-4 mt-5">
                <TabActions title="Students Attendance" noView={true} />
                <MasterTable 
                    columns={mainColumns}
                    data={mainStudentData || []}
                    searchQuery={searchQuery}
                />
            </section>

        </main>
    )
}

export default TeacherStudentAttendance;