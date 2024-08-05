import DateTime from "../../components/DateTime";
import ReusableTable from "../../components/ReusableTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState,useEffect,useContext } from 'react';
import Searchbar from "../../components/Searchbar";
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";

const Sectioning = () =>{

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

    const { searchQuery,showForm,currentUserId, setShowForm, session: currentSession,role } = useContext(MainContext);

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;
    const [sectionId,setSectionId] = useState('');
    const [adviser,setAdviser] = useState('');

    const [studentRecord,setStudentRecord] = useState(null);

    useEffect(() => {
        if(studentRecord) {
            setSectionId(studentRecord?.academicId?.sectionId?._id);
        }
    },[studentRecord]);

    // To get sections based on grade level of student
    const filteredSections = sections.filter(section => section.gradeLevel?.gradeLevel === studentRecord?.academicId?.gradeLevelId?.gradeLevel);

    const handleSectionChange = (e) => {
        setSectionId(e.target.value);
    }

    const studentLists = students?.filter(student => student?.academicId?.isRegistered && student?.academicId?.isAdmitted).map(student => ({
        ...student,
        firstName: student.firstName,
        lastName: student.lastName,
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student?.academicId?.strandId?.strand || 'Not Assigned',
        section: student?.academicId?.sectionId?.section || 'Not Assigned',
        adviser: student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser?.firstName} ${student?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned'
    }))

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
            session: currentSession // Passed this to be used by middleware
        }

        try {
            const data = await axios.post(`${baseUrl()}/sectioning`,sectioningInfo);
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
            {/* <DateTime /> */}
            <TabActions title="Sectioning" noView={true} />
            <div className={`gap-2 mt-5`}>
                { showForm && 
                    (
                        studentRecord ? 
                        <div className="absolute w-full top-0 z-50 left-0 flex justify-center">
                            <form onSubmit={submitSectioning} className="p-4 col-span-1 bg-white shadow-md rounded-md h-fit border border-gray-300 mt-5">
                                <h1 className="font-semibold text-xl text-gray-700">{`${studentRecord?.firstName} ${studentRecord?.lastName}'s Section`}</h1>
                                <div className="grid grid-cols-2 gap-5 mt-4">
                                    {renderStudentInfo('student name',`${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`,'Student Name:')}
                                    {renderStudentInfo('grade level',`${studentRecord?.academicId?.gradeLevelId ? studentRecord?.academicId?.gradeLevelId?.gradeLevel : 'Not Assigned'} `,'Grade Level')}
                                    {renderStudentInfo('strand',studentRecord?.academicId?.strandId?.strand,'Strand:')}
                                    {renderStudentInfo('section',studentRecord?.academicId?.sectionId?.section,'Section:',filteredSections,handleSectionChange)}
                                    {renderStudentInfo('adviser',studentRecord?.academicId?.sectionId?.adviser ? `${studentRecord?.academicId?.sectionId?.adviser?.firstName} ${studentRecord?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned','Adviser')}
                                </div>

                                <button disabled={isYearDone} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} text-gray-100 bg-blue-500 p-2 text-sm mt-5 rounded-md hover:bg-blue-600`}>Assign Section</button>
                                <button className="text-gray-100 bg-red-500 p-2 text-sm mt-5 ml-2 rounded-md hover:dark:bg-red-600" type="button" onClick={() => {
                                    setShowForm(false)
                                    setStudentRecord(null)
                                }}>Cancel</button>
                            </form>
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

export default Sectioning;

const renderStudentInfo = (label,value,placeholder,options,onChange) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1 font-semibold text-gray-700" htmlFor={label}>{placeholder}</label>
        { label === 'section' ? 
        <select className="text-sm p-2 outline-none rounded-md border border-gray-200" onChange={onChange}>
            <option hidden>{ value ? value : 'Select Section' }</option>
            { options.map(section => (
                <option key={section._id} value={section._id}>{section.section}</option>
            )) }
        </select>
        : <span className="text-sm">{value ?? 'Not Assigned'}</span> }
    </div>
)