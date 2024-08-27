import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";
import MasterDataForm from '../../components/MasterDataForm';

const TeacherSubject = () => {

    const { records: teachersSubject } = useFetch(`${baseUrl()}/teachers-subject`);
    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;


    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);
    const { records: subjects } = useFetch(`${baseUrl()}/subjects`);
    const { records: roomNumbers } = useFetch(`${baseUrl()}/room-numbers`)

    const [studentRecord, setStudentRecord] = useState(null);

    const [teacherId,setTeacherId] = useState('');
    const [subjectId,setSubjectId] = useState('');
    const [roomNumberId,setRoomNumberId] = useState('');
    const [schedule,setSchedule] = useState('');


    const columns = [
        { accessorKey: 'teacher', header: 'Teacher', editable: true, selectOptions: teachers?.map(teacher => ({ label: `${teacher.firstName} ${teacher.lastName }`, value: teacher._id })) },
        { accessorKey: 'subject', header: 'Subject', editable: true, selectOptions: subjects?.map(subject => ({ label: subject.subjectName, value: subject._id})) },
        { accessorKey: 'roomNumber', header: 'Room Number', editable: true,type: 'number', selectOptions: roomNumbers?.map(rn => ({ label: rn.roomNumber, value: rn._id })) },
        { accessorKey: 'timeSchedule', header: 'Schedule', editable: true, type: "time" }

    ];

    const teacherLists = teachersSubject?.map((teacher) => ({
        ...teacher,
        teacher: `${teacher.teacherId.firstName} ${teacher.teacherId.lastName}`,
        subject: teacher.subjectId.subjectName,
        roomNumber: teacher.roomNumberId.roomNumber
    }))

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
                    <label className="text-sm" htmlFor="schedule">Schedule</label>
                    <input
                        onChange={(e) => setSchedule(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                        type="time"
                        required
                    />
                </div>
            </div>
        </>
    )

    const assignTeacherSubject = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(`${baseUrl()}/assign-teacher-subject`,{ teacherId,subjectId,roomNumberId,schedule,inputter: currentUserId, sessionId: currentSession,role });
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
            },2000)

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

    const editAssignedSubject = async (id,updatedData) => {

        try {   
            const data = await axios.patch(`${baseUrl()}/edit-assigned-teacher-subject/${id}`,updatedData);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            // setTimeout(() => {
            //     window.location.reload();
            // },2000)

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

    const deleteAssignedSubject = async (id) => {

        try {
            const data = await axios.put(`${baseUrl()}/assigned-teacher-subject/${id}`,{ recordStatus: 'Deleted' });
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
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
                    />
                </div>
            </div>
            <ToastContainer />          
        </main>
    )
}

export default TeacherSubject;