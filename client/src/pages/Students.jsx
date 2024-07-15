import AddStudentBtn from "../components/buttons/AddStudentBtn";
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
import MasterTable from "../components/MasterTable";
import { useNavigate } from 'react-router-dom';

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
        accessorKey: 'sex',
        header: 'Gender',
    },
    {
        accessorKey: 'nationality.nationality',
        header: 'Nationality',
    }
];

const Students = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/students`);
    const { searchQuery,setSearchQuery,role } = useContext(MainContext);
    
    const navigate = useNavigate();
    
    const deleteStudent = async (id) => {
        try {
            const removeStudent = await axios.delete(`${baseUrl()}/student/${id}`, { data: { role } });
            toast.success(removeStudent.data.mssg, {
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
            }, 2000)
        } catch (err) {
            console.log(err);
        }
    }

    const goToEdit = (id) => navigate(`/registrar/edit-student/${id}`);

    return (
        <main className="p-2">
            <div className="flex justify-between items-center">
                <Searchbar onSearch={setSearchQuery} />
                <AddStudentBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={records}
                    onDelete={deleteStudent}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                />
            </div>
            <ToastContainer />
        </main>
    )
}

export default Students;
