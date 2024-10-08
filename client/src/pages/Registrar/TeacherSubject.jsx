import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useContext } from 'react';
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";
import MasterDataForm from '../../components/MasterDataForm';
import { useSnackbar } from 'notistack';
const TeacherSubject = () => {

    const { records: teachersSubject } = useFetch(`${baseUrl()}/teachers-subject`);
    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role,genericPath } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;
    const { enqueueSnackbar } = useSnackbar();
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);
    const { records: subjects } = useFetch(`${baseUrl()}/subjects`);
    const { records: roomNumbers } = useFetch(`${baseUrl()}/room-numbers`)

    const [teacherId,setTeacherId] = useState('');
    const [subjectId,setSubjectId] = useState('');
    const [roomNumberId,setRoomNumberId] = useState('');
    const [startTime,setStartTime] = useState('');
    const [endTime,setEndTime] = useState('');
    const [daySchedule,setDaySchedule] = useState([]);


    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleDayScheduleChange = (day) => {
        setDaySchedule((prevDaySchedule) => {
            if (prevDaySchedule.includes(day)) {
                return prevDaySchedule.filter((d) => d !== day);
            } else {
                return [...prevDaySchedule, day];
            }
        });
    };

    const navigate = useNavigate();


    const columns = [
        { accessorKey: 'teacher', header: 'Teacher', editable: true, selectOptions: teachers?.map(teacher => ({ label: `${teacher.firstName} ${teacher.lastName }`, value: teacher._id })) },
        { accessorKey: 'subject', header: 'Subject', editable: true, selectOptions: subjects?.map(subject => ({ label: subject.subjectName, value: subject._id})) },
        { accessorKey: 'roomNumber', header: 'Room Number', editable: true,type: 'number', selectOptions: roomNumbers?.map(rn => ({ label: rn.roomNumber, value: rn._id })) },
        { accessorKey: 'time', header: 'Time', editable: true, type: "time" }
    ];

    const teacherLists = teachersSubject?.map((teacher) => ({
        ...teacher,
        teacher: `${teacher.teacherId.firstName} ${teacher.teacherId.lastName}`,
        subject: `${teacher.subjectId.subjectName} - ${teacher.subjectId.subjectCode}`,
        roomNumber: teacher.roomNumberId.roomNumber,
        time: `${formatTime(teacher.startTime)}-${formatTime(teacher.endTime)}`
    })).sort((a, b) => {
        // Compare by start time
        const timeA = a.startTime;
        const timeB = b.startTime;
    
        return timeA.localeCompare(timeB); // Sort by start time
    });

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Assign Teacher Subject</h1>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="teacher">Teacher</label>
                    <select
                        onChange={(e) => setTeacherId(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                    >
                        <option value="" hidden>Select teacher</option>
                        { teachers?.map(teacher => (
                            <option key={teacher._id} value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>
                        )) }
                        <option value="">N/A</option>
                    </select>
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="subject">Subject</label>
                    <select
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                    >
                        <option value="" hidden>Select subject</option>
                        { subjects?.map(subject => (
                            <option key={subject._id} value={subject._id}>{subject.subjectName} - {subject.subjectCode}</option>
                        )) }
                        <option value="">N/A</option>
                    </select>            
                </div>
                
                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="room number">Room Number</label>
                    <select
                        onChange={(e) => setRoomNumberId(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                    >
                        <option value="" hidden>Select room number</option>
                        { roomNumbers?.map(rn => (
                            <option key={rn._id} value={rn._id}>{rn.roomNumber}</option>
                        )) }
                        <option value="">N/A</option>
                    </select>   
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="start time">Start Time</label>
                    <input
                        onChange={(e) => setStartTime(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                        type="time"
                        required
                    />
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="schedule">End Time</label>
                    <input
                        onChange={(e) => setEndTime(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                        type="time"
                        required
                    />
                </div>

                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="day schedule">Day Schedule</label>
                    
                    <div className="grid grid-cols-2 gap-2">
                    { days.map((day,key) => (
                        <div key={key} className="flex items-center gap-2 justify-between text-sm border border-gray-300 p-1">
                            <label htmlFor="day">{day}</label>
                            <input 
                                type="checkbox" 
                                value={day} 
                                onChange={() => handleDayScheduleChange(day)} 
                                className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                            />
                        </div>
                    )) }
                    </div>
                </div>

            </div>
        </>
    )

    const assignTeacherSubject = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(`${baseUrl()}/assign-teacher-subject`,{ teacherId,subjectId,roomNumberId,startTime,endTime,inputter: currentUserId, sessionId: currentSession,role,daySchedule });
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });

        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while assigning subjects to teacher', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const editAssignedSubject = async (id,updatedData) => {

        try {   
            const data = await axios.patch(`${baseUrl()}/edit-assigned-teacher-subject/${id}`,updatedData);
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating assigned subject', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const deleteAssignedSubject = async (id) => {

        try {
            const data = await axios.put(`${baseUrl()}/assigned-teacher-subject/${id}`,{ recordStatus: 'Deleted' });
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting assigned subject', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const goToEdit = (id) => navigate(`/${genericPath}/teacher-subject/${id}`);

    return (
        <main className="p-2 relative">
            <TabActions title="Teachers Subject" />
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,assignTeacherSubject,setShowForm) }
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    <MasterTable
                        data={teacherLists}
                        columns={columns}
                        searchQuery={searchQuery}
                        onUpdate={editAssignedSubject}
                        onDelete={deleteAssignedSubject}                       
                        onShow={setShowForm}
                        goToEdit={goToEdit}
                    />
                </div>
            </div>
        </main>
    )
}

export default TeacherSubject;