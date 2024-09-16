import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from '../../baseUrl';
import { useState, useContext, useEffect } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherStudentAttendance = () => {

    const { currentUserId, searchQuery, session, role } = useContext(MainContext);

    const days = ['Sunday','Monday','Tuesday','Wednedsay','Thursday','Friday','Saturday'];


    // set the current remark if the student has one
    const [currentRemarks,setCurrentRemarks] = useState('');
    const [withRemarks,setWithRemarks] = useState(false);

    // The day today
    const currentDay = days[new Date().getDay()];

    const [openAttendance,setOpenAttendance] = useState(false);
    const [currentStudent,setCurrentStudent] = useState('');

    // For students attendance id for updating record
    const [studentsAttendanceId,setStudentsAttendanceId] = useState('');
    // current date
    const [currentDate,setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    // Must fetch record depending on the value of current date
    const { records } = useFetch(`${baseUrl()}/teacher-student-attendance/${currentUserId}?currentDate=${currentDate}`);
    
    const [studentId,setStudentId] = useState('');
    const [remarks,setRemarks] = useState('');
    const [subjectId,setSubjectId] = useState('');
    const remarkSelections = [
        { id: 1, value: 'Present' },
        { id: 2, value: 'Late' },
        { id: 3, value: 'Absent'},
        { id: 4, value: 'Excused' }  
    ];

    const [error,setError] = useState({ remarks: '', currentDate: '' });

    const formatDateReadable = (dateStr) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const studentColumns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'subject', header: 'Subject' },
        { accessorKey: 'remarks', header: 'Remarks', editable: true, selectOptions: ['Present','Absent','Late','Other'].map(reason => ({ value: reason, label: reason })) }
    ]

    const studentsOfTeacher = records?.studentsWithAttendance?.map(student => ({
        ...student,
        fullName: `${student.studentId.lastName}, ${student.studentId.firstName} ${student.studentId.middleName}`,
        subject: `${student.subjectId.subjectName} - ${student.subjectId.subjectCode}`,
        remarks: student.remarks
    }));
    console.log(records);

    const viewStudentRecord = (studentRecord) => {
        console.log(studentRecord);

        // Open attendance when view is clicked
        setOpenAttendance(true);
        setStudentId(studentRecord.studentId._id);

        // Set the current remarks of the student upon viewing
        setCurrentRemarks(studentRecord.remarks)
        setWithRemarks(studentRecord.remarks === 'No remarks' ? true : false);
        
        // Set the subject attended by the student
        setSubjectId(studentRecord.subjectId._id);

        // Set the students attendance id for updating the record if needed
        setStudentsAttendanceId(studentRecord.studentsAttendanceId);

        setCurrentStudent(`${studentRecord.studentId.firstName} ${studentRecord.studentId.middleName} ${studentRecord.studentId.lastName}`)
    }


    const addAttendance = async (e) => {
        e.preventDefault();
        const attendanceInformation = {
            dateToday: currentDate,
            remarks,
            sessionId: session,
            studentId,
            subjectId,
            inputter: currentUserId,
            recordStatus: 'Live',
            role
        }

        if(!remarks) setError(prev => ({ ...prev, remarks: 'Remarks cannot be empty' }));
        if(!currentDate) setError(prev => ({ ...prev, currentDate: 'Current date cannot be empty' }));

        if(!remarks || !currentDate) return

        try {
            const data = await axios.post(`${baseUrl()}/teacher-student-attendance`, attendanceInformation);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const updateAttendance = async (e) => {
        e.preventDefault();
        const attendanceInformation = {
            dateToday: currentDate,
            remarks,
            sessionId: session,
            studentId,
            subjectId,
            inputter: currentUserId,
            recordStatus: 'Live',
            role
        }

        if(!remarks) setError(prev => ({ ...prev, remarks: 'Remarks cannot be empty' }));
        if(!currentDate) setError(prev => ({ ...prev, currentDate: 'Current date cannot be empty' }));

        if(!remarks || !currentDate) return

        try {
            const data = await axios.patch(`${baseUrl()}/teacher-student-update-attendance/${studentsAttendanceId}`, attendanceInformation);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center relative">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
            </header>

            <section className="px-4 mt-5 w-full">
                <h2 className="text-lg text-gray-700 px-4">{currentDay}, {formatDateReadable(currentDate)}</h2>
                <div className="flex items-end justify-between">
                    <TabActions title="Students Attendance" noView={true} />
                    {/* This must filter the table below when changed */}
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

            { openAttendance && (
                <div>
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                    
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white w-full h-full md:w-fit md:h-auto p-4 rounded-lg border border-gray-300 shadow-lg overflow-y-auto relative">
                            <div className="flex flex-col justify-between mb-3">
                                <h1 className="font-semibold text-2xl text-gray-700">
                                    {currentStudent}
                                </h1>
                                <p className="text-xs text-gray-500">Add attendance for {formatDateReadable(currentDate)}</p>
                            </div>

                            <form className="grid grid-cols-2 gap-5" onSubmit={withRemarks ? addAttendance : updateAttendance}>
                                <input 
                                    type="date" 
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 ring-blue-500 outline-none" 
                                    value={currentDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setCurrentDate(e.target.value)} 
                                    disabled
                                />
                                { error.remarks && <span className="text-xs text-red-500">{error.remarks}</span> }

                                <select
                                    value={currentRemarks || ''} // Display the current remarks
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 ring-blue-500 outline-none" 
                                    onChange={(e) => {
                                        setRemarks(e.target.value);  // Update the remarks state
                                        setCurrentRemarks(e.target.value);  // Update currentRemarks as well
                                    }}
                                >
                                    <option hidden>Select remarks</option>
                                    { remarkSelections.map(remark => (
                                        <option key={remark.id} value={remark.value}>{remark.value}</option> // Use value attribute in the options
                                    )) }
                                </select>
                                { error.currentDate && <span className="text-xs text-red-500">{error.currentDate}</span> }
                                

                                <button 
                                    className={`text-sm ${withRemarks ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-gray-100 p-2 rounded-md`}
                                >
                                    { withRemarks ? 'Submit' : 'Update' }
                                </button>
                                <button 
                                    className="text-gray-100 bg-red-500 hover:bg-red-600 text-sm p-2 rounded-md"
                                    onClick={() => {
                                        setOpenAttendance(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </form>

                            
                        </div>
                    </div>
                </div>
            ) }
            <ToastContainer />
        </main>
    );
};

export default TeacherStudentAttendance;
