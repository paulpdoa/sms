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
    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;
    const [sectionId, setSectionId] = useState('');
    const [adviser, setAdviser] = useState('');
    const [studentRecord, setStudentRecord] = useState(null);
    const withStrands = [11, 12];

    const fetchStudentSubjects = async () => {
        try {
            const data = '';
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (studentRecord) {
            setSectionId(studentRecord?.academicId?.sectionId?._id);

            
        }
    }, [studentRecord]);

    const filteredSections = sections.filter(section => section.gradeLevel?.gradeLevel === studentRecord?.academicId?.gradeLevelId?.gradeLevel);

    const handleSectionChange = (e) => {
        setSectionId(e.target.value);
    }

    const studentLists = students?.filter(student => student?.academicId?.isRegistered && student?.academicId?.isAdmitted).map(student => ({
        ...student,
        firstName: student.firstName,
        lastName: student.lastName,
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: (student?.academicId?.gradeLevelId?.gradeLevel.includes('11') || student?.academicId?.gradeLevelId?.gradeLevel.includes('12')) ? student?.academicId?.strandId?.strand : 'Not applicable',
        section: student?.academicId?.sectionId?.section || 'Not Assigned',
        adviser: student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser?.firstName} ${student?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned'
    }));

    const submitSectioning = async (e) => {
        e.preventDefault();

        const sectioningInfo = {
            sessionId: currentSession,
            studentId: studentRecord._id,
            sectionId: sectionId,
            inputter: currentUserId,
            gradeLevelId: studentRecord?.academicId?.gradeLevelId?._id,
            strandId: studentRecord?.academicId?.strandId?._id,
            lastSchoolAttended: studentRecord?.academicId?.lastSchoolAttended,
            role,
            session: currentSession
        }

        try {
            const data = await axios.post(`${baseUrl()}/sectioning`, sectioningInfo);
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
            }, 2000);
        } catch (err) {
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

    // Subject assigning function
    const assignSubjects = async () => {

        try {
            const data = await axios.get(`${baseUrl()}/assign-subjects-student?session=${currentSession}`);
            console.log(data);
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
            <div className="flex justify-between items-end">
            <TabActions title="Assign Subject to Students" noView={true} />
            <button
                onClick={assignSubjects}
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
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg p-5">
                                    <h1 className="font-semibold text-xl">Subjects Assigned to { studentRecord.firstName } { studentRecord.lastName }</h1>
                                    
                                    <div className="grid grid-cols-3 gap-5 py-5">
                                        <div className="text-sm py-2 border border-gray-300 rounded-md p-2">
                                            <h2>Filipino - FIL12</h2>
                                            <p>Adviser: Paul Andres</p>
                                            <p>Time: 12:30 - 1:30</p>                                    
                                        </div>
                                        <div className="text-sm py-2 border border-gray-300 rounded-md p-2">
                                            <h2>Filipino - FIL12</h2>
                                            <p>Adviser: Paul Andres</p>
                                            <p>Time: 12:30 - 1:30</p>                                    
                                        </div>
                                        <div className="text-sm py-2 border border-gray-300 rounded-md p-2">
                                            <h2>Filipino - FIL12</h2>
                                            <p>Adviser: Paul Andres</p>
                                            <p>Time: 12:30 - 1:30</p>                                    
                                        </div>
                                    </div>
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
