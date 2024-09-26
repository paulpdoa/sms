import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useContext } from 'react';
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";
import { useSnackbar } from 'notistack';

const SubjectAssigning = () => {
    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'adviser', header: 'Adviser' }
    ];

    // For student subjects 
    const studentSubjectColumns = [
        { accessorKey: 'subject', header: 'Subject' },
        { accessorKey: 'teacher', header: 'Teacher' },
        { accessorKey: 'room', header: 'Room No.' },
        { accessorKey: 'time', header: 'Time' },
        { accessorKey: 'days', header: 'Scheduled Days' }
    ]
    
    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role, snackbarKey } = useContext(MainContext);

    const { records: studentSubjects } = useFetch(`${baseUrl()}/student-subjects`);
    

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;
    const [sectionId, setSectionId] = useState('');
    const [adviser, setAdviser] = useState('');
    const [studentRecord, setStudentRecord] = useState(null);
    const withStrands = [11, 12];

    const studentLists = students?.filter(student => student?.academicId?.isEnrolled && student.studentNo && student?.academicId?.gradeLevelId).map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: (student?.academicId?.gradeLevelId?.gradeLevel.includes('11') || student?.academicId?.gradeLevelId?.gradeLevel.includes('12')) ? student?.academicId?.strandId?.strand : 'Not applicable',
        section: student?.academicId?.sectionId?.section || 'Not Assigned',
        adviser: student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser?.firstName} ${student?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned'
    })).sort((a,b) => a.lastName.localeCompare(b.lastName));

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const studentSubjectData = studentSubjects?.filter(subj => subj.studentId?._id === studentRecord?._id)?.map(subj => ({
        ...subj,
        subject: `${subj.subjectId.subjectName} ${subj.subjectId.subjectCode}`,
        teacher: `${subj.teacherSubjectId.teacherId.firstName} ${subj.teacherSubjectId.teacherId.middleName} ${subj.teacherSubjectId.teacherId.lastName}`,
        room: subj.teacherSubjectId.roomNumberId.roomNumber,
        startTime: subj.teacherSubjectId.startTime,
        time: `${formatTime(subj.teacherSubjectId.startTime)} - ${formatTime(subj.teacherSubjectId.endTime)}`,
        days: subj.teacherSubjectId.daySchedule?.map(dy => dy + ' ')
    })).sort((a, b) => {
        // Compare by start time
        const timeA = a.startTime;
        const timeB = b.startTime;
    
        return timeA.localeCompare(timeB); // Sort by start time
    });

    // Subject assigning function
    const assignSubjects = async () => {
        const loading = snackbarKey('Please wait while assigning subjects to students');

        try {
            const data = await axios.get(`${baseUrl()}/assign-subjects-student?session=${currentSession}&currentUserId=${currentUserId}`);
            closeSnackbar(loading)
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            closeSnackbar(snackbarKey())
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while assigning subjects', { 
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

    return (
        <main className="p-2 relative">
            <div className="flex justify-between items-end">
                <TabActions title="Assign Subject to Students" noView={true} />
                <button
                    onClick={!isYearDone && assignSubjects}
                    className="bg-customView p-2 rounded-md text-gray-200 text-sm hover:bg-customHighlight mb-2 min-w-fit">
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
                                <div className="relative w-auto max-w-auto mx-auto my-8 bg-white rounded-lg shadow-xl p-6">
                                    <h1 className="font-semibold text-2xl text-gray-800 mb-4">
                                    Subjects Assigned to {studentRecord.firstName} {studentRecord.lastName}
                                    </h1>

                                    <MasterTable 
                                        columns={studentSubjectColumns}
                                        searchQuery={searchQuery}
                                        data={studentSubjectData}
                                        disableAction={true}
                                    />
                                    {/* <div className="grid grid-cols-2 gap-6 py-4">
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
                                    </div> */}

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
