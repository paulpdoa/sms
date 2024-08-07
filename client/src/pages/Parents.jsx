import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import AddParentBtn from "../components/buttons/AddParentBtn";
import { useContext } from "react";
import { MainContext } from '../helpers/MainContext';
import MasterTable from '../components/MasterTable';
import { useNavigate } from 'react-router-dom';

const columns = [
    {
        accessorKey: 'motherName',
        header: 'Mother Name',
    },
    {
        accessorKey: 'fatherName',
        header: 'Father Name',
    },
    {
        accessorKey: 'guardianName',
        header: 'Guardian Name',
    },
    {
        accessorKey: 'studentId.fullname',
        header: 'Student Name',
    }
]

const Parents = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/parents`);
    const { searchQuery,setSearchQuery,role,currentUserId } = useContext(MainContext);
    const navigate = useNavigate();

    const deleteParent = async (id) => {
        try {
            const removeParent = await axios.delete(`${baseUrl()}/parent/${id}`,{ data: { role } });
            toast.success(removeParent.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
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
    }

    const goToEdit = (id) => navigate(`/registrar/edit-parent/${id}`)

    const recordsWithoutInputter = records.filter(record => record.studentId !== null).map(record => ({
        ...record,
        studentId: {
            fullname: record?.studentId?.firstName + ' ' + record?.studentId?.middleName + ' ' + record?.studentId?.lastName
        }
    }))

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="mx-4 my-2">
                <h1 className="text-2xl text-gray-700 font-semibold">Parents</h1>
                <div className="flex items-center justify-between mt-3">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddParentBtn />
                </div>
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={recordsWithoutInputter}
                    onDelete={deleteParent}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Parents;