import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from '../../baseUrl';
import { useState, useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherStudentAttendance = () => {
    const { currentUserId, searchQuery, session, role } = useContext(MainContext);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [currentRemarks, setCurrentRemarks] = useState('');
    const [withRemarks, setWithRemarks] = useState(false);
    const [openAttendance, setOpenAttendance] = useState(false);
    const [currentStudent, setCurrentStudent] = useState('');
    const [studentsAttendanceId, setStudentsAttendanceId] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const { records } = useFetch(`${baseUrl()}/teacher-student-attendance/${currentUserId}?currentDate=${currentDate}`);
    const [studentId, setStudentId] = useState('');
    const [remarks, setRemarks] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [comment,setComment] = useState('');

    const [error, setError] = useState({ remarks: '', currentDate: '' });

    const remarkSelections = [
        { id: 1, value: 'Present' },
        { id: 2, value: 'Late' },
        { id: 3, value: 'Absent' },
        { id: 4, value: 'Excused' },
    ];

    const currentDay = days[new Date().getDay()];

    const formatDateReadable = (dateStr) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const studentColumns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'subject', header: 'Subject' },
        { accessorKey: 'remarks', header: 'Remarks', editable: true, selectOptions: ['Present', 'Absent', 'Late', 'Other'].map(reason => ({ value: reason, label: reason })) },
    ];

    const studentsOfTeacher = records?.studentsWithAttendance?.map(student => ({
        ...student,
        fullName: `${student.studentId.lastName}, ${student.studentId.firstName} ${student.studentId.middleName}`,
        subject: `${student.subjectId.subjectName} - ${student.subjectId.subjectCode}`,
        remarks: student.remarks,
    }));

    const viewStudentRecord = (studentRecord) => {
        setOpenAttendance(true);
        setStudentId(studentRecord.studentId._id);
        setCurrentRemarks(studentRecord.remarks);
        setWithRemarks(studentRecord.remarks === 'No remarks' ? true : false);
        setSubjectId(studentRecord.subjectId._id);
        setStudentsAttendanceId(studentRecord.studentsAttendanceId);
        setCurrentStudent(`${studentRecord.studentId.firstName} ${studentRecord.studentId.middleName} ${studentRecord.studentId.lastName}`);
    };

    const handleAttendanceSubmit = async (e, action) => {
        e.preventDefault();
        const attendanceInformation = {
            dateToday: currentDate,
            remarks,
            sessionId: session,
            studentId,
            subjectId,
            inputter: currentUserId,
            recordStatus: 'Live',
            comment,
            role,
        };

        if (!remarks || !currentDate) {
            setError({
                remarks: remarks ? '' : 'Remarks cannot be empty',
                currentDate: currentDate ? '' : 'Current date cannot be empty',
            });
            return;
        }

        try {
            const url = action === 'add' 
                ? `${baseUrl()}/teacher-student-attendance`
                : `${baseUrl()}/teacher-student-update-attendance/${studentsAttendanceId}`;
            const method = action === 'add' ? 'post' : 'patch';
            const { data } = await axios[method](url, attendanceInformation);

            toast.success(data.mssg, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: true,
                theme: 'colored',
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.mssg, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'colored',
            });
        }
    };

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
            </header>

            <section className="px-6 mt-8 w-full">
                <h2 className="text-lg text-gray-700">{currentDay}, {formatDateReadable(currentDate)}</h2>
                <div className="flex items-end justify-between mt-4">
                    <TabActions title="Students Attendance" noView={true} />
                    <input 
                        type="date" 
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 ring-blue-500 outline-none" 
                        value={currentDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCurrentDate(e.target.value)} 
                    />
                </div>
                
                <MasterTable 
                    columns={studentColumns}
                    data={studentsOfTeacher || []}
                    searchQuery={searchQuery}
                    viewRecord={viewStudentRecord}
                />
            </section>

            {openAttendance && (
                <div>
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white w-full h-fit md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg relative">
                            <div className="flex flex-col mb-4">
                                <h1 className="font-semibold text-2xl text-gray-700">{currentStudent}</h1>
                                <p className="text-sm text-gray-500">Add attendance for {formatDateReadable(currentDate)}</p>
                            </div>

                            <form className="grid gap-4" onSubmit={(e) => handleAttendanceSubmit(e, withRemarks ? 'add' : 'update')}>
                                <select
                                    value={currentRemarks || ''} 
                                    className="p-3 border border-gray-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                                    onChange={(e) => {
                                        setRemarks(e.target.value);
                                        setCurrentRemarks(e.target.value);
                                    }}
                                >
                                    <option hidden>Select remarks</option>
                                    {remarkSelections.map(remark => (
                                        <option key={remark.id} value={remark.value}>{remark.value}</option>
                                    ))}
                                </select>

                                <input
                                    className="p-3 border border-gray-300 rounded-md focus:ring-2 ring-blue-500 outline-none" 
                                    type="text" 
                                    placeholder="Leave a comment..."
                                    onChange={(e) => setComment(e.target.value)} 
                                />

                                {error.remarks && <span className="text-xs text-red-500">{error.remarks}</span>}

                                <div className="flex space-x-4">
                                    <button 
                                        type="submit"
                                        className={`${withRemarks ? 'bg-blue-500' : 'bg-green-500'} hover:bg-blue-600 text-white p-2 rounded-md w-full`}
                                    >
                                        {withRemarks ? 'Submit' : 'Update'}
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md w-full"
                                        onClick={() => setOpenAttendance(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </main>
    );
};

export default TeacherStudentAttendance;
