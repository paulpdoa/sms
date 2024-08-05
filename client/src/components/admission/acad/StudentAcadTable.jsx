import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MasterTable from "../../MasterTable";
import { useContext } from 'react';
import { MainContext } from '../../../helpers/MainContext';

const StudentAcadTable = ({ setViewRecord, searchQuery }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name'
        },
        {
            accessorKey: 'studentNo',
            header: 'Student No.'
        },
        {
            accessorKey: 'gradeLevel',
            header: 'Grade Level'
        },
        {
            accessorKey: 'nationality',
            header: 'Nationality'
        },
        {
            accessorKey: 'strand',
            header: 'Strand'
        },
        {
            accessorKey: 'section',
            header: 'Section'
        },
        {
            accessorKey: 'adviser',
            header: 'Adviser'
        },
        {
            accessorKey: 'paymentTerm',
            header: 'Payment Term'
        }
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { session } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone ? true : false;

    const deleteAcadRecord = async (id) => {
        try {
            const data = await axios.delete(`${baseUrl()}/academic/${id}`);
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
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    } 

    const actions = (student) => (
        <>
        <div className="flex gap-2 items-center">
            <button onClick={() => setViewRecord(student)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">View</button>
            <button onClick={() => {
                !isYearDone && deleteAcadRecord(student.academicId._id)
            }} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} bg-red-500 text-white px-4 py-2 rounded-md mr-2`}>Delete</button>
        </div>
        </>
    );
    const formattedStudents = students?.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student?.studentNo ?? 'Not Registered yet',
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel ?? 'Not assigned yet',
        nationality: student?.nationality?.nationality ?? 'Not assigned yet',
        strand: student?.academicId?.strandId?.strand ?? 'Not Assigned yet',
        section: student?.academicId?.sectionId?.section ?? 'Not Assigned yet',
        adviser: `${student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser.firstName} ${student?.academicId?.sectionId?.adviser.lastName}` : 'Not Assigned'}`,
        paymentTerm: student?.academicId?.paymentTermId?.term ?? 'Not Assigned'
    }))

    

    return (
        <>  
            <MasterTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} />
            <ToastContainer /> 
        </> 
    )
}

export default StudentAcadTable;