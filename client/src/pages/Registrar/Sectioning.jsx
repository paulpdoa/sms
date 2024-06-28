import DateTime from "../../components/DateTime";
import ReusableTable from "../../components/ReusableTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState } from 'react';
import Searchbar from "../../components/Searchbar";
import axios from 'axios';

const Sectioning = () =>{

    const columns = [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'studentNo',header: 'Student No'},
        { accessorKey: 'academicId.gradeLevelId.gradeLevel', header: 'Grade Level' },
        { accessorKey: 'academicId.strandId.strand', header: 'Strand' },
        { accessorKey: 'academicId.sectionId.section', header: 'Section' },
        { accessorKey: 'academicId.sectionId.adviser', header: 'Adviser' }
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const [searchQuery, setSearchQuery] = useState('');
    const [sectionId,setSectionId] = useState('');
    const [adviser,setAdviser] = useState('');

    const currentSession = localStorage.getItem('session');
    const currentUserId = localStorage.getItem('id');

    const studentLists = students.filter(student => student.isRegistered && student.isAdmitted);

    const [studentRecord,setStudentRecord] = useState(null);

    const populateField = (section) => {
        const getSection = sections.filter(sect => sect._id === section);
        setAdviser(`${getSection[0].adviser?.firstName} ${getSection[0].adviser?.lastName}`);
        setSectionId(section);
    }

    const submitSectioning = async (e) => {
        e.preventDefault();

        const sectioningInfo = {
            sessionId: currentSession,
            studentId: studentRecord._id,
            sectionId: sectionId,
            inputter: currentUserId,
            gradeLevelId: studentRecord?.academicId?.gradeLevelId._id,
            departmentId: studentRecord?.academicId?.departmentId._id,
            strandId: studentRecord?.academicId?.strandId._id,
            lastSchoolAttended: studentRecord?.academicId?.lastSchoolAttended,
        }

        try {
            const data = await axios.post(`${baseUrl()}/sectioning`,sectioningInfo);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
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
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Sectioning</h1>
                <Searchbar onSearch={setSearchQuery} />
                {/* <AddStudentBtn /> */}
            </div>

            <div className="grid grid-cols-2 gap-2">
                { studentRecord ? 
                    <form onSubmit={submitSectioning} className="p-4 col-span-1 bg-white shadow-md rounded-md h-fit border border-gray-300 mt-5">
                        <h1 className="font-semibold text-xl text-green-600">{`${studentRecord?.firstName} ${studentRecord?.lastName}'s Section`}</h1>
                        <div className="grid grid-cols-2 gap-5 mt-4">
                            {renderStudentInfo('student name',`${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`,'Student Name:')}
                            {renderStudentInfo('grade level',`${studentRecord?.academicId?.gradeLevelId?.gradeLevel}`,'Grade Level')}
                            {renderStudentInfo('strand',studentRecord?.academicId?.strandId?.strand,'Strand:')}
                            {renderStudentInfo('section',studentRecord?.academicId?.sectionId?.section,'Section:',sections,populateField)}
                            {renderStudentInfo('adviser',studentRecord?.academicId?.sectionId?.adviser ? `${studentRecord?.academicId?.sectionId?.adviser?.firstName} ${studentRecord?.academicId?.sectionId?.adviser?.lastName}` : adviser,'Adviser')}
                        </div>

                        <button className="text-gray-100 bg-green-500 p-2 text-sm mt-5 rounded-md hover:dark:bg-green-600">Add Section</button>
                    </form>
                    :
                    <div className="mt-3 p-6 bg-white shadow-md rounded-md h-fit">
                        <h1 className="text-red-500 text-lg font-semibold">
                            Please select view on table to view student record
                        </h1>
                    </div>
                }
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    <ReusableTable 
                        records={studentLists} 
                        columns={columns}
                        searchQuery={searchQuery}
                        viewRecord={setStudentRecord}
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
        <label className="text-sm mb-1 font-semibold text-green-600" htmlFor={label}>{placeholder}</label>
        { label === 'section' && !value ? 
        <select className="text-sm p-2 outline-none rounded-md border border-gray-200" onChange={(e) => onChange(e.target.value)}>
            <option hidden>Select section</option>
            { options.map(section => (
                <option key={section._id} value={section._id}>{section.section}</option>
            )) }
        </select>
        : <span className="text-sm">{value ?? 'Not Assigned'}</span> }
    </div>
)