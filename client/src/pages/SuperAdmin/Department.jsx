import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const Department = () => {

    const { records,isLoading } = useFetch(`${baseUrl()}/departments`);
    const [department,setDepartment] = useState('');

    const { role,session,currentUserId,searchQuery,showForm,setShowForm } = useContext(MainContext)

    const columns = [
        {
            accessorKey: 'department',
            header: 'Department',
            editable: true
        }
    ]

    const updateNewDepartment = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/department/${id}`,{ newDepartment: updatedData.department,currentUserId,role });
            toast.success(newData.data.mssg, {
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

            setTimeout(() => {
                window.location.reload();
            },2000)
        }
    }      

    const deleteDepartment = async (id) => {
        try {
            const removeDepartment = await axios.delete(`${baseUrl()}/department/${id}`,{ data: { role  } });
            toast.success(removeDepartment.data.mssg, {
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

    const addDepartment = async (e) => {
        e.preventDefault();
        try {
            const newDepartment = await axios.post(`${baseUrl()}/departments`,{ department,currentUserId,session,role });
            toast.success(newDepartment.data.mssg, {
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

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-green-500">Add New Department</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="department">Department</label>
                <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setDepartment(e.target.value)} />
            </div>
        </>
    )

    return (
        <main className="p-2 relative">
            {/* <DateTime /> */}
            <TabActions title="Department" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addDepartment,setShowForm)}

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewDepartment}
                        onDelete={deleteDepartment}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Department;