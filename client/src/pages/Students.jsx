import AddStudentBtn from "../components/AddStudentBtn";
import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";

const columns = [
    {
        accessorKey: 'fullName',
        header: 'Full Name',
    },
    {
        accessorKey: 'suffix',
        header: 'Suffix'
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Date Of Birth'
    },
    {
        accessorKey: 'sex',
        header: 'Sex'
    },
    {
        accessorKey: 'nationality',
        header: 'Nationality'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Students = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/students`);

    const deleteStudent = async (id) => {
        try {
            const removeStudent = await axios.delete(`${baseUrl()}/student/${id}`);
            toast.success(removeStudent.data.mssg, {
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
            },2000)
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between items-center">
                <Searchbar />
                <AddStudentBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 shadow-md sm:rounded-lg">
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
                        { records?.map(record => (
                            <tr key={record._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    { record.firstName } { record.middleName } { record.lastName }
                                </th>
                                <td className="px-6 py-4">
                                    { record.suffix }
                                </td>
                                <td className="px-6 py-4">
                                    { record.dateOfBirth }
                                </td>
                                <td className="px-6 py-4">
                                    { record.sex?.gender ? record.sex?.gender : 'Not Assigned' }
                                </td>
                                <td className="px-6 py-4">
                                    { record.nationality?.nationality ? record.nationality.nationality : 'Not Assigned' }
                                </td>
                                <td className="px-6 py-4 flex gap-2 items-center">
                                    <Link to={`/registrar/edit-student/${record._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                                    <button onClick={() => deleteStudent(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Students;