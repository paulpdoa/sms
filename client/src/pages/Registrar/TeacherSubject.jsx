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

    const [studentRecord, setStudentRecord] = useState(null);

    const [teacherId,setTeacherId] = useState('');
    const [subjectId,setSubjectId] = useState('');
    const [roomNumber,setRoomNumber] = useState('');
    const [schedule,setSchedule] = useState('');


    const columns = [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'studentNo', header: 'Student No' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'adviser', header: 'Adviser' }
    ];

    const teacherLists = teachersSubject?.map((teacher) => ({
        ...teacher,

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
                            <option value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>
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
                            <option value={subject._id}>{subject.subjectName} - {subject.subjectCode}</option>
                        )) }
                        <option value="">N/A</option>
                    </select>            
                </div>
                
                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="room number">Room Number</label>
                    <input
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="outline-none p-2 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2"
                        type="number"
                        required
                    />
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
            const data = await axios.post(`${baseUrl()}/assign-teacher-subject`,{ teacherId,subjectId,roomNumber,schedule,inputter: currentUserId, sessionId: currentSession });
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
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
                        viewRecord={setStudentRecord}
                        onShow={setShowForm}
                    />
                </div>
            </div>
            <ToastContainer />          
        </main>
    )
}

export default TeacherSubject;