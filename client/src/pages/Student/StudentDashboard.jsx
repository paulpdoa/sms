import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';


const StudentDashboard = () => {

    const { currentUserId } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/student-dashboard/${currentUserId}`);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.studentName}!</h1>
            </header>

            <section className="w-full px-7 mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Subjects For Today</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { records?.studentSubjects?.teacherSubjectId?.filter(ts => ts.daySchedule.includes(records?.todayValue))?.length > 0 ? (
                        records?.studentSubjects?.map((studentSubject,index) => (
                            <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6 hover:-translate-y-1 transition">
                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                    { studentSubject.subjectId.subjectName }
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Room No.:</span> {studentSubject.teacherSubjectId.roomNumberId.roomNumber}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Time:</span> {formatTime(studentSubject.teacherSubjectId.startTime)} - {formatTime(studentSubject.teacherSubjectId.endTime)}
                                </p>
                                <p className="text-gray-700 flex items-center gap-1">
                                    <span className="font-semibold">Schedule:</span> 
                                    {studentSubject.teacherSubjectId.daySchedule.map((dy, i) => (
                                        <span 
                                            key={i} 
                                            className={dy === records?.todayValue ? 'text-indigo-600 font-semibold' : ''}>
                                            {dy}{i < studentSubject.teacherSubjectId.daySchedule.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Teacher:</span> { studentSubject.teacherSubjectId.teacherId.firstName } { studentSubject.teacherSubjectId.teacherId.lastName }
                                </p>
                            </div>
                        )) 
                    ) : (
                        <p className="text-red-500 text-lg font-semibold animate-pulse">No subjects scheduled for today</p>
                    ) }
                </div>
            </section>
            
            <section className="w-full px-7 mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Subjects Assigned to me</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { records?.studentSubjects?.length > 0 ? (
                        records?.studentSubjects?.map((studentSubject,index) => (
                            <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6 hover:-translate-y-1 transition">
                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                    { studentSubject.subjectId.subjectName }
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Room No.:</span> {studentSubject.teacherSubjectId.roomNumberId.roomNumber}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Time:</span> {formatTime(studentSubject.teacherSubjectId.startTime)} - {formatTime(studentSubject.teacherSubjectId.endTime)}
                                </p>
                                <p className="text-gray-700 flex items-center gap-1">
                                    <span className="font-semibold">Schedule:</span> 
                                    {studentSubject.teacherSubjectId.daySchedule.map((dy, i) => (
                                        <span 
                                            key={i} 
                                            className={dy === records?.todayValue ? 'text-indigo-600 font-semibold' : ''}>
                                            {dy}{i < studentSubject.teacherSubjectId.daySchedule.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Teacher:</span> { studentSubject.teacherSubjectId.teacherId.firstName } { studentSubject.teacherSubjectId.teacherId.lastName }
                                </p>
                            </div>
                        )) 
                    ) : (
                        <p className="text-red-500 text-lg font-semibold animate-pulse">No subjects scheduled for today</p>
                    ) }
                </div>
            </section>
        </main>
    )
}

export default StudentDashboard;