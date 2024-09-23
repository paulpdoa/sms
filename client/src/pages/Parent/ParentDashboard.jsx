import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';

const ParentDashboard = () => {

    const { currentUserId } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/parent-dashboard/${currentUserId}`);
    console.log(records.students);
    

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };  


    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.parentName}!</h1>
                {/* <p className="text-sm text-gray-500">Parent of {records?.studentName}</p> */}
            </header>

            { records?.students?.map((student) => (
                <section key={student._id} className="w-full px-7 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Subjects of {student.firstName} {student.middleName} {student.lastName} today</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        { records?.studentSubjects?.teacherSubjectId?.filter(ts => ts.daySchedule.includes(records?.todayValue))?.length > 0 ? (
                            records?.studentSubjects?.filter(subject => subject.studentId._id === student._id)?.map((studentSubject,index) => (
                                <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6 w-full break-words hover:-translate-y-1 transition overflow-hidden">
                                    <h3 className="text-xl font-semibold text-indigo-600 mb-2 truncate">
                                        { studentSubject.subjectId.subjectName }
                                    </h3>
                                    <p className="text-gray-700 mb-2 truncate">
                                        <span className="font-semibold">Room No.:</span> {studentSubject.teacherSubjectId.roomNumberId.roomNumber}
                                    </p>
                                    <p className="text-gray-700 mb-2 truncate">
                                        <span className="font-semibold">Time:</span> {formatTime(studentSubject.teacherSubjectId.startTime)} - {formatTime(studentSubject.teacherSubjectId.endTime)}
                                    </p>
                                    <p className="text-gray-700 flex items-center gap-1 truncate">
                                        <span className="font-semibold">Schedule:</span> 
                                        {studentSubject.teacherSubjectId.daySchedule.map((dy, i) => (
                                        <span 
                                            key={i} 
                                            className={dy === records?.todayValue ? 'text-indigo-600 font-semibold truncate' : ''}>
                                            {dy}{i < studentSubject.teacherSubjectId.daySchedule.length - 1 ? ', ' : ''}
                                        </span>
                                        ))}
                                    </p>
                                    <p className="text-gray-700 mb-2 truncate">
                                        <span className="font-semibold">Teacher:</span> { studentSubject.teacherSubjectId.teacherId.firstName } { studentSubject.teacherSubjectId.teacherId.lastName }
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-500 text-lg font-semibold animate-pulse">No subjects scheduled for today</p>
                        ) }
                    </div>
                    
                </section>
            )) }

            { records?.students?.map((student) => (
                <section key={student._id} className="w-full px-7 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">All Subjects of {student.firstName} {student.middleName} {student.lastName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        { records?.studentSubjects?.length > 0 ? (
                            records?.studentSubjects?.filter(subject => subject.studentId._id === student._id)?.map((studentSubject,index) => (
                                <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-6 w-full break-words hover:-translate-y-1 transition overflow-hidden">
                                    <h3 className="text-xl font-semibold text-indigo-600 mb-2 truncate">
                                        { studentSubject.subjectId.subjectName }
                                    </h3>
                                    <p className="text-gray-700 mb-2 truncate">
                                        <span className="font-semibold">Room No.:</span> {studentSubject.teacherSubjectId.roomNumberId.roomNumber}
                                    </p>
                                    <p className="text-gray-700 mb-2 truncate">
                                        <span className="font-semibold">Time:</span> {formatTime(studentSubject.teacherSubjectId.startTime)} - {formatTime(studentSubject.teacherSubjectId.endTime)}
                                    </p>
                                    <p className="text-gray-700 flex items-center gap-1 truncate">
                                        <span className="font-semibold">Schedule:</span> 
                                        {studentSubject.teacherSubjectId.daySchedule.map((dy, i) => (
                                        <span 
                                            key={i} 
                                            className={dy === records?.todayValue ? 'text-indigo-600 font-semibold truncate' : ''}>
                                            {dy}{i < studentSubject.teacherSubjectId.daySchedule.length - 1 ? ', ' : ''}
                                        </span>
                                        ))}
                                    </p>
                                    <p className="text-gray-700 mb-2 truncate">
                                        <span className="font-semibold">Teacher:</span> { studentSubject.teacherSubjectId.teacherId.firstName } { studentSubject.teacherSubjectId.teacherId.lastName }
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-500 text-lg font-semibold animate-pulse">No subjects scheduled for today</p>
                        ) }
                    </div>

                    
                </section>
            )) }
        </main>
    )
}

export default ParentDashboard;