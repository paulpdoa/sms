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
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const { session, currentUserId,setTeacherSubjectSelected } = useContext(MainContext);
    const { records } = useFetch(`${baseUrl()}/teacher-dashboard/${currentUserId}`);

    const navigate = useNavigate();

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleAttendance = subjectId => {
        console.log(subjectId);
        

    }

    const handleGrading = subjectId => {
        setTeacherSubjectSelected(subjectId._id);
        navigate(`/teacher/student-grading`);
    }

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
            </header>

            {/* Subject for today */}
            <section className="w-full px-7 mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Classes Today</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records?.teacherSubjects?.filter(ts => ts.daySchedule.includes(records?.todayValue)).length > 0 ? (
                        records?.teacherSubjects?.filter(ts => ts.daySchedule.includes(records?.todayValue)).map((teacherSubject, index) => (
                            <div key={index} className="relative bg-white border border-gray-300 shadow-sm rounded-lg p-6 hover:-translate-y-1 transition cursor-pointer group">
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
                                
                                {/* Hidden buttons that appear on hover */}
                                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex space-x-4">
                                        <button
                                            className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                                            onClick={() => handleAttendance(teacherSubject)}>
                                            Attendance
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
                                            onClick={() => handleGrading(teacherSubject.subjectId)}>
                                            Grading
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-red-500 text-lg font-semibold animate-pulse">No subjects scheduled for today</p>
                    )}
                </div>
            </section>

            {/* All Subjects assigned to a teacher */}
            <section className="w-full px-7 mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Class Schedule/s</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records?.teacherSubjects?.length > 0 ? (
                        records?.teacherSubjects?.map((teacherSubject, index) => (
                            <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6 hover:-translate-y-1 transition">
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
                        ))
                    ) : (
                        <p className="text-red-500 text-lg font-semibold animate-pulse">No subjects yet assigned to you</p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default TeacherDashboard;
