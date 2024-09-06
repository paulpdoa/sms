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

const TeacherDashboard = () => {
    const { session, currentUserId } = useContext(MainContext);
    const { records } = useFetch(`${baseUrl()}/teacher-dashboard/${currentUserId}`);

    console.log(records?.teacherSubjects);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
                {/* <p className="text-lg text-gray-600">Session: {session}</p> */}
            </header>


            {/* Subject for today */}
            <section className="w-full px-7 mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your subjects class today</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records?.teacherSubjects?.filter(ts => ts.daySchedule.includes(records?.todayValue)).map((teacherSubject, index) => (
                        <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                {teacherSubject.subjectId.subjectName} ({teacherSubject.subjectId.subjectCode})
                            </h3>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Room No.:</span> {teacherSubject.roomNumberId.roomNumber}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Time:</span> {formatTime(teacherSubject.startTime)} - {formatTime(teacherSubject.endTime)}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Schedule:</span> 
                                {teacherSubject.daySchedule.map((dy, i) => (
                                    <span 
                                        key={i} 
                                        className={dy === records?.todayValue ? 'text-indigo-600 font-semibold' : ''}>
                                        {dy}{i < teacherSubject.daySchedule.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
         
            {/* All Subjects assigned to a teacher */}
            <section className="w-full px-7 mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Subjects Assigned to You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records?.teacherSubjects?.map((teacherSubject, index) => (
                        <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                {teacherSubject.subjectId.subjectName} ({teacherSubject.subjectId.subjectCode})
                            </h3>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Room No.:</span> {teacherSubject.roomNumberId.roomNumber}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Time:</span> {formatTime(teacherSubject.startTime)} - {formatTime(teacherSubject.endTime)}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Schedule:</span> {teacherSubject.daySchedule.map(dy => dy + ' ')}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default TeacherDashboard;
