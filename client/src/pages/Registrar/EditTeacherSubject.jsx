import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const EditTeacherSubject = () => {
    const { id } = useParams();
    const { records: teacherSubject } = useFetch(`${baseUrl()}/teacher-subject/${id}`);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [teacherId, setTeacherId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [roomNumberId, setRoomNumberId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [daySchedules, setDaySchedules] = useState([]);

    const { genericPath,role } = useContext(MainContext);

    useEffect(() => {
        if (teacherSubject) {
            setTeacherId(teacherSubject.teacherId?._id || '');
            setSubjectId(teacherSubject.subjectId?._id || '');
            setRoomNumberId(teacherSubject.roomNumberId?._id || '');
            setStartTime(teacherSubject.startTime || '');
            setEndTime(teacherSubject.endTime || '');
            setDaySchedules(teacherSubject.daySchedule || []);
        }
    }, [teacherSubject, id]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);
    const { records: subjects } = useFetch(`${baseUrl()}/subjects`);
    const { records: roomNumbers } = useFetch(`${baseUrl()}/room-numbers`);

    const handleDayScheduleChange = (day) => {
        setDaySchedules((prevDays) => {
            if (prevDays.includes(day)) {
                return prevDays.filter(d => d !== day);
            } else {
                return [...prevDays, day];
            }
        });
    };

    const editTeacherSubject = async (e) => {
        e.preventDefault();
        try {
            // Add your axios PUT request here to update the teacher subject
            const data = await axios.patch(`${baseUrl()}/edit-assigned-teacher-subject/${id}`,{  teacherId,
                subjectId,
                roomNumberId,
                startTime,
                endTime,
                daySchedules,
                role
            });

            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate(`/${genericPath}/teachers-subject`);                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating teachers subject', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    return (
        <main className="p-8 bg-gray-100 flex items-center justify-center">
            <form onSubmit={editTeacherSubject} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">
                    Update Teacher {teacherSubject?.teacherId?.firstName}'s Subject
                </h1>

                <section>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="teacher">Teacher</label>
                            <select
                                onChange={(e) => setTeacherId(e.target.value)}
                                className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                                value={teacherId}
                            >
                                <option value="" hidden>Select teacher</option>
                                {teachers?.map(teacher => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.firstName} {teacher.lastName}
                                    </option>
                                ))}
                                <option value="">N/A</option>
                            </select>
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="subject">Subject</label>
                            <select
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                                value={subjectId}
                            >
                                <option value="" hidden>Select subject</option>
                                {subjects?.map(subject => (
                                    <option key={subject._id} value={subject._id}>
                                        {subject.subjectName} - {subject.subjectCode}
                                    </option>
                                ))}
                                <option value="">N/A</option>
                            </select>
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="room number">Room Number</label>
                            <select
                                onChange={(e) => setRoomNumberId(e.target.value)}
                                className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                                value={roomNumberId}
                            >
                                <option value="" hidden>Select room number</option>
                                {roomNumbers?.map(rn => (
                                    <option key={rn._id} value={rn._id}>
                                        {rn.roomNumber}
                                    </option>
                                ))}
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
                                value={startTime}
                            />
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="schedule">End Time</label>
                            <input
                                onChange={(e) => setEndTime(e.target.value)}
                                className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                                type="time"
                                required
                                value={endTime}
                            />
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="day schedule">Day Schedule</label>
                            <div className="grid grid-cols-2 gap-2">
                                {days.map((day, key) => (
                                    <div key={key} className="flex items-center gap-2 justify-between text-sm border border-gray-300 p-1">
                                        <label htmlFor="day">{day}</label>
                                        <input
                                            type="checkbox"
                                            checked={daySchedules.includes(day)}
                                            onChange={() => handleDayScheduleChange(day)}
                                            className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <button 
                    className="p-2 bg-customView hover:bg-blue-600 text-gray-100 text-sm rounded-md"
                >
                        Update Teacher Subject
                </button>
                <button
                    type="button"
                    onClick={() => navigate(`/${genericPath}/teachers-subject`)}
                    className="p-2 bg-customCancel ml-2 hover:bg-red-600 text-gray-100 text-sm rounded-md"
                >
                        Cancel
                </button>
            </form>
        </main>
    );
};

export default EditTeacherSubject;
