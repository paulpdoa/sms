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
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
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
            <button onClick={() => !isYearDone && deleteAcadRecord(student.academicId._id)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} bg-red-500 text-white px-4 py-2 rounded-md mr-2`}>Delete</button>
        </div>
        </>
    );
    const formattedStudents = students?.map(student => ({
        ...student, 
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.isRegistered ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
    }));

    

    return (
        <>  
            <MasterTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} />
            <ToastContainer /> 
        </> 
    )
}

export default StudentAcadTable;