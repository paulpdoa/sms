import { useState } from 'react';
import AddTeacherBtn from "../components/AddTeacherBtn";
import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import ReusableTable from "../components/ReusableTable";

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
        header: 'Sex'
    },
    {
        accessorKey: 'nationality.nationality',
        header: 'Nationality'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
];

const Teachers = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/teachers`);
    const [searchQuery, setSearchQuery] = useState('');

    const deleteTeacher = async (id) => {
        try {
            const removeTeacher = await axios.delete(`${baseUrl()}/teacher/${id}`);
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

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between items-center">
                <Searchbar onSearch={setSearchQuery} />
                <AddTeacherBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <ReusableTable 
                    columns={columns} 
                    records={records} 
                    path={'/registrar/edit-teacher'} 
                    deleteRecord={deleteTeacher} 
                    searchQuery={searchQuery}
                />
            </div> 
            <ToastContainer />          
        </main>
    );
};

export default Teachers;
