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
    const { searchQuery,setSearchQuery,role,genericPath } = useContext(MainContext);

    const navigate = useNavigate();

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        sex: {
            gender: record?.sex
        },
        nationality: {
            _id: record?.nationality?._id,
            nationality: record?.nationality?.nationality || 'Not Assigned'
        },
        dateOfBirth: new Date(record.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        })
    }))

    const deleteTeacher = async (id) => {
        try {
            const removeTeacher = await axios.put(`${baseUrl()}/teacher/${id}`, { role,recordStatus: 'Deleted' });
            toast.success(removeTeacher.data.mssg, {
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
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };

    const goToEdit = (id) => navigate(`/${genericPath}/edit-teacher/${id}`)

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="mx-4 my-2">
                <h1 className="text-2xl text-gray-700 font-semibold">Teachers</h1>
                <div className="flex items-center justify-between mt-3">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddTeacherBtn />
                </div>
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={recordsWithoutInputter}
                    onDelete={deleteTeacher}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div> 
            <ToastContainer />          
        </main>
    );
};

export default Teachers;
