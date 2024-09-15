import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from '../../baseUrl';
import { useState, useContext, useEffect } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import axios from 'axios';

const TeacherStudentAttendance = () => {
    const { currentUserId, searchQuery, session } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/teacher-student-attendance/${currentUserId}`);
    console.log(records);

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
            </header>

            <section className="px-4 mt-5 w-full">
                <TabActions title="Students Attendance" noView={true} />
                
                
                
            </section>
        </main>
    );
};

export default TeacherStudentAttendance;
