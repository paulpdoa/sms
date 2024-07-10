import AddStudentBtn from "../components/AddStudentBtn";
import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useContext } from "react";
import { MainContext } from '../helpers/MainContext';
import ReusableTable from '../components/ReusableTable';

const columns = [
    {
        accessorKey: 'firstName',
        header: 'First Name',
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'middleName',
        header: 'Middle Name',
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Date Of Birth',
    },
    {
        accessorKey: 'sex.gender',
        header: 'Gender',
    },
    {
        accessorKey: 'nationality.nationality',
        header: 'Nationality',
    }
];

const Students = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/students`);
    const { searchQuery,setSearchQuery } = useContext(MainContext);
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
            }, 2000)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between items-center">
                <Searchbar onSearch={setSearchQuery} />
                <AddStudentBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <ReusableTable 
                    records={records} 
                    columns={columns} 
                    path='/registrar/edit-student' 
                    deleteRecord={deleteStudent} 
                    searchQuery={searchQuery}
                />
            </div>
            <ToastContainer />
        </main>
    )
}

export default Students;
