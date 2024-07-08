import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';
import MasterTable from "../../components/MasterTable";

const Department = () => {

    const { records } = useFetch(`${baseUrl()}/departments`);
    const [department,setDepartment] = useState('');

    const [searchQuery,setSearchQuery] = useState('');

    const currentUserId = localStorage.getItem('id');
    const session = localStorage.getItem('session');
    const role = localStorage.getItem('role');

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

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Department</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addDepartment} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Department</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="department">Department</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setDepartment(e.target.value)} />
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewDepartment}
                        onDelete={deleteDepartment}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Department;