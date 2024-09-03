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

const SubjectAssigning = () => {
    const columns = [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'studentNo', header: 'Student No' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'adviser', header: 'Adviser' }
    ];

    const navigate = useNavigate();
    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role } = useContext(MainContext);

    const { records: studentSubjects } = useFetch(`${baseUrl()}/student-subjects`);
    console.log(studentSubjects);

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;
    const [sectionId, setSectionId] = useState('');
    const [adviser, setAdviser] = useState('');
    const [studentRecord, setStudentRecord] = useState(null);
    const withStrands = [11, 12];

    const studentLists = students?.filter(student => student?.academicId?.isRegistered && student?.academicId?.isAdmitted && student?.academicId?.gradeLevelId && student?.academicId?.sectionId).map(student => ({
        ...student,
        firstName: student.firstName,
        lastName: student.lastName,
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: (student?.academicId?.gradeLevelId?.gradeLevel.includes('11') || student?.academicId?.gradeLevelId?.gradeLevel.includes('12')) ? student?.academicId?.strandId?.strand : 'Not applicable',
        section: student?.academicId?.sectionId?.section || 'Not Assigned',
        adviser: student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser?.firstName} ${student?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned'
    }));

    // Subject assigning function
    const assignSubjects = async () => {
        const toastId = toast.loading('Please wait while assigning subjects to students');

        try {
            const data = await axios.get(`${baseUrl()}/assign-subjects-student?session=${currentSession}&currentUserId=${currentUserId}`);
            toast.update(toastId, {
                render: data.data.mssg,
                type: "success",
                isLoading: false,
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
            toast.update(toastId, {
                render: err.response.data.mssg,
                type: "error",
                isLoading: false,
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
            <div className="flex justify-between items-end">
                <TabActions title="Assign Subject to Students" noView={true} />
                <button
                    onClick={!isYearDone && assignSubjects}
                    className="bg-blue-500 p-2 rounded-md text-gray-200 text-sm hover:bg-blue-600 mb-2">
                    Assign Subjects
                </button>   
            </div>
            <div className={`gap-2 mt-5`}>
                {showForm &&    
                    (
                        studentRecord ?
                            // Show here the form for the subjects assigned to student
                            // MasterDataForm(form, submitSectioning, setShowForm)
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                                <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-xl p-6">
                                    <h1 className="font-semibold text-2xl text-gray-800 mb-4">
                                    Subjects Assigned to {studentRecord.firstName} {studentRecord.lastName}
                                    </h1>

                                    <div className="grid grid-cols-2 gap-6 py-4">
                                    {studentSubjects?.filter(subj => subj.studentId._id === studentRecord._id)?.map(subj => {
                                        let bgColorClass = '';

                                        switch (subj.subjectId.subjectName) {
                                        case 'Mathematics':
                                            bgColorClass = 'bg-blue-100';
                                            break;
                                        case 'Science':
                                            bgColorClass = 'bg-green-100';
                                            break;
                                        case 'English':
                                            bgColorClass = 'bg-yellow-100';
                                            break;
                                        case 'Filipino':
                                            bgColorClass = 'bg-red-100';
                                            break;
                                        case 'Social Studies':
                                            bgColorClass = 'bg-orange-100';
                                            break;
                                        default:
                                            bgColorClass = 'bg-gray-50';
                                        }

                                        return (
                                        <div key={subj._id} className={`${bgColorClass} border border-gray-300 rounded-lg p-4 text-gray-700 h-fit`}>
                                            <h2 className="font-medium text-lg">{subj.subjectId.subjectName}</h2>
                                            <p className="text-sm text-gray-500">{subj.subjectId.subjectCode}</p>
                                            { subj.teacherSubjectId && (
                                                <div className="text-sm text-gray-500 mt-5">
                                                    <p>Teacher: {subj.teacherSubjectId.teacherId.firstName} {subj.teacherSubjectId.teacherId.middleName} {subj.teacherSubjectId.teacherId.lastName}</p>
                                                    <p>Room No: {subj.teacherSubjectId.roomNumberId.roomNumber}</p>

                                                    { subj.teacherSubjectId.daySchedule.length > 0 && (
                                                        <div className="border border-gray-400 p-2 rounded-md mt-2">
                                                            <label htmlFor="time">Time:</label>
                                                            <p>{subj.teacherSubjectId.startTime} - {subj.teacherSubjectId.endTime}</p>
                                                        
                                                            <label htmlFor="days">Days:</label>
                                                            <div className="flex items-center flex-wrap gap-2 text-sm">
                                                                { subj.teacherSubjectId.daySchedule?.map(dy => (
                                                                    <p>{dy}</p>
                                                                )) }                                                            
                                                            </div>
                                                        </div>
                                                    ) }
                                                </div>
                                            ) }
                                        </div>
                                        );
                                    })}
                                    </div>

                                    <button 
                                    onClick={() => {
                                        setShowForm(false);
                                        setStudentRecord(null);
                                    }} 
                                    className="mt-6 w-24 text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition duration-150 ease-in-out"
                                    >
                                    Close
                                    </button>
                                </div>
                            </div>


                            :
                            studentLists?.length < 1 ? (
                                <div className="mt-3 p-6 bg-white shadow-md rounded-md h-fit">
                                    <h1 className="text-red-500 text-sm font-semibold">
                                        No student records yet
                                    </h1>
                                </div>
                            ) : (
                                <div className="mt-3 p-6 bg-white shadow-md rounded-md h-fit">
                                    <h1 className="text-red-500 text-sm font-semibold">
                                        Please select view on table to give section to students
                                    </h1>
                                </div>
                            )
                    )
                }
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    <MasterTable
                        data={studentLists}
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

export default SubjectAssigning;

const renderStudentInfo = (label, value, placeholder, options, onChange) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1 font-semibold text-gray-700" htmlFor={label}>{placeholder}</label>
        {label === 'section' ?
            <select className="text-sm p-2 outline-none rounded-md border border-gray-200" onChange={onChange}>
                <option hidden>{value ? value : 'Select Section'}</option>
                {options.map(section => (
                    <option key={section._id} value={section._id}>{section.section}</option>
                ))}
            </select>
            : <span className="text-sm">{value}</span>
        }
    </div>
)
