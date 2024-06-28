import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdmissionTable from '../AdmissionTable';

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
        { accessorKey: 'action', header: 'Action' }
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);

    const deleteAcadRecord = async (id) => {
        try {
            const data = await axios.delete(`${baseUrl()}/academic/${id}`);
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
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    } 

    const actions = (student) => (
        <>
        {console.log(student)}
        <div className="flex gap-2 items-center">
            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
            <button onClick={() => deleteAcadRecord(student.academicId._id)} className="font-medium text-red-500 dark:text-red-500 hover:underline">Delete</button>
        </div>
        </>
    );
    const formattedStudents = students?.filter(student => student.isAdmitted).map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.isRegistered ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        action: actions(student)
    }));

    

    return (
        <>
            <AdmissionTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} />
            <ToastContainer /> 
        </> 
    )
}

export default StudentAcadTable;