import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import AddParentBtn from "../components/AddParentBtn";
import { useContext } from "react";
import { MainContext } from '../helpers/MainContext';
import ReusableTable from '../components/ReusableTable';

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
        accessorKey: 'studentId',
        header: 'Student Name',
        cell: (student) => `${student.firstName} ${student.middleName} ${student.lastName}` ?? 'Not Assigned' 
    }
]

const Parents = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/parents`);
    const { searchQuery,setSearchQuery } = useContext(MainContext);

    const deleteParent = async (id) => {
        try {
            const removeParent = await axios.delete(`${baseUrl()}/parent/${id}`);
            toast.success(removeParent.data.mssg, {
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
            {/* <DateTime /> */}
            <div className="flex justify-between items-center">
                <Searchbar onSearch={setSearchQuery} />
                <AddParentBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <ReusableTable 
                    records={records} 
                    columns={columns} 
                    path='/registrar/edit-parent' 
                    deleteRecord={deleteParent} 
                    searchQuery={searchQuery}
                />
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Parents;