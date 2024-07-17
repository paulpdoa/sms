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
        { accessorKey: 'academicId.gradeLevelId.gradeLevel', header: 'Grade Level' },
        { accessorKey: 'academicId.strandId.strand', header: 'Strand' },
        { accessorKey: 'academicId.sectionId.section', header: 'Section' },
        {
            accessorKey: 'academicId.sectionId.adviser',
            header: 'Adviser',
            cell: (adviser) => `${adviser?.firstName} ${adviser?.lastName}` || 'Not assigned',
        },
    ];

    const navigate = useNavigate();

    const { searchQuery,showForm,currentUserId } = useContext(MainContext);

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const [sectionId,setSectionId] = useState('');
    const [adviser,setAdviser] = useState('');

    const currentSession = localStorage.getItem('session');

    const studentLists = students.filter(student => student.isRegistered && student.isAdmitted);

    const [studentRecord,setStudentRecord] = useState(null);

    useEffect(() => {
        if(studentRecord) {
            setSectionId(studentRecord?.academicId?.sectionId?._id);
        }
    },[studentRecord])

    const handleSectionChange = (e) => {
        setSectionId(e.target.value);
    }

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
        }

        console.log(sectioningInfo)

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
        }
    }

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <TabActions title="Sectioning" />
            <div className={`${showForm ? 'grid grid-cols-2' : ''} gap-2 mt-5`}>
                { showForm && 
                    (
                        studentRecord ? 
                        <form onSubmit={submitSectioning} className="p-4 col-span-1 bg-white shadow-md rounded-md h-fit border border-gray-300 mt-5">
                            <h1 className="font-semibold text-xl text-green-600">{`${studentRecord?.firstName} ${studentRecord?.lastName}'s Section`}</h1>
                            <div className="grid grid-cols-2 gap-5 mt-4">
                                {renderStudentInfo('student name',`${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`,'Student Name:')}
                                {renderStudentInfo('grade level',`${studentRecord?.academicId?.gradeLevelId?.gradeLevel}`,'Grade Level')}
                                {renderStudentInfo('strand',studentRecord?.academicId?.strandId?.strand,'Strand:')}
                                {renderStudentInfo('section',studentRecord?.academicId?.sectionId?.section,'Section:',sections,handleSectionChange)}
                                {renderStudentInfo('adviser',studentRecord?.academicId?.sectionId?.adviser ? `${studentRecord?.academicId?.sectionId?.adviser?.firstName} ${studentRecord?.academicId?.sectionId?.adviser?.lastName}` : adviser,'Adviser')}
                            </div>

                            <button className="text-gray-100 bg-green-500 p-2 text-sm mt-5 rounded-md hover:dark:bg-green-600">Add Section</button>
                        </form>
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
                                    Please select view on table to view student record
                                </h1>
                            </div>
                        )
                    )
                }
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    <ReusableTable 
                        records={studentLists} 
                        columns={columns}
                        searchQuery={searchQuery}
                        viewRecord={setStudentRecord}
                    />

                    {/* <MasterTable 
                        data={studentLists}
                        columns={columns}
                        searchQuery={searchQuery}
                        viewRecord={setStudentRecord}
                    /> */}
                </div>
            </div>
            <ToastContainer />
        </main>
    )
}

export default Sectioning;

const renderStudentInfo = (label,value,placeholder,options,onChange) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1 font-semibold text-green-600" htmlFor={label}>{placeholder}</label>
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