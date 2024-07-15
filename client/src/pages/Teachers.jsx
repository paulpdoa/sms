import { useContext } from 'react';
import AddTeacherBtn from "../components/buttons/AddTeacherBtn";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { MainContext } from '../helpers/MainContext';
import { useNavigate } from 'react-router-dom';
import MasterTable from '../components/MasterTable';

const columns = [
    {
        accessorKey: 'firstName',
        header: 'First Name',
    },
    {
        accessorKey: 'middleName',
        header: 'Middle Name',
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Date Of Birth'
    },
    {
        accessorKey: 'sex.gender',
        header: 'Gender'
    },
    {
        accessorKey: 'nationality.nationality',
        header: 'Nationality'
    }
];

const Teachers = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/teachers`);
    const { searchQuery,setSearchQuery,role } = useContext(MainContext);

    const navigate = useNavigate();

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        sex: {
            gender: record?.sex
        },
        nationality: {
            _id: record?.nationality?._id,
            nationality: record?.nationality?.nationality || 'Not Assigned'
        }
    }))

    const deleteTeacher = async (id) => {
        try {
            const removeTeacher = await axios.delete(`${baseUrl()}/teacher/${id}`, { data: { role } });
            toast.success(removeTeacher.data.mssg, {
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
        } catch (err) {
            console.log(err);
        }
    };

    const goToEdit = (id) => navigate(`/registrar/edit-teacher/${id}`)

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between items-center">
                <Searchbar onSearch={setSearchQuery} />
                <AddTeacherBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={recordsWithoutInputter}
                    onDelete={deleteTeacher}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                />
            </div> 
            <ToastContainer />          
        </main>
    );
};

export default Teachers;
