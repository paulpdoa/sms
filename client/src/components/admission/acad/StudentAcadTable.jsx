import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAcadTable = ({ setViewRecord }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name',
        },
        {
            accessorKey: 'admitted',
            header: 'Admitted'
        },
        {
            accessorKey: 'dateAdmitted',
            header: 'Date Admitted'
        },
        {
            accessorKey: 'gradelevel',
            header: 'Grade Level'
        },
        {
            header: 'Status'
        },
        {
            header: 'Email'
        },
        {
            accessorKey: 'action',
            header: 'Action'
        }
    ]

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

    return (
        <>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    { columns?.map((column,key) => (
                        <th key={key} scope="col" className="px-6 py-3">
                            { column.header }
                        </th>
                    )) }
                </tr>
            </thead>
            <tbody>
                { students?.filter(student => student.isAdmitted && student.isRegistered).map(student => (
                    <tr key={student._id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            { student.firstName } { student.middleName } { student.lastName }
                        </th>
                        <td className="px-6 py-4">
                            { student?.isAdmitted ? 'Yes' : 'No' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.dateAdmitted?.split('T')[0] ? student?.dateAdmitted?.split('T')[0] : 'Not admitted' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.academicId?.gradeLevelId?.gradeLevel ? student?.academicId?.gradeLevelId?.gradeLevel : 'Not Assigned' }
                        </td>
                        <td className="px-6 py-4">
                            { student.status }
                        </td>
                        <td className="px-6 py-4">
                            { student.email }
                        </td>
                        <td className="px-6 py-4 flex gap-2 items-center">
                            <button onClick={() => deleteAcadRecord(student?.academicId?._id)} className="font-medium text-red-500 hover:underline">Delete</button>
                            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
                        </td>
                    </tr>
                )) }
            </tbody>
            
        </table>
        <ToastContainer /> 
        </> 
    )
}

export default StudentAcadTable;