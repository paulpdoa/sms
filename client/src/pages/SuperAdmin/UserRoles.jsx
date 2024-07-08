import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';
import MasterTable from "../../components/MasterTable";



const UserRoles = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/user-roles`);
    const [userRole,setUserRole] = useState('');
    const [searchQuery,setSearchQuery] = useState('');

    const currentUserId = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    const columns = [
        {
            accessorKey: 'userRole',
            header: 'User Role',
            editable: true,
        },
        {
            accessorKey: 'inputter',
            header: 'Inputter'
        }
    ]

    const updateNewUserRole = async (id,updatedData) => {
        console.log(updatedData);
        try {
            const newData = await axios.patch(`${baseUrl()}/user-role/${id}`,{ newUserRole:updatedData.userRole,currentUserId,role });
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


    const deleteUserRoles = async (id) => {
        try {
            const removeUserRoles = await axios.put(`${baseUrl()}/user-role/${id}`,{ data: { role } });
            toast.success(removeUserRoles.data.mssg, {
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

    const addUserRoles = async (e) => {
        e.preventDefault();
        try {
            const newUserRoles = await axios.post(`${baseUrl()}/user-roles`,{ userRole,currentUserId,role });
            toast.success(newUserRoles.data.mssg, {
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
            toast.success(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        inputter: record?.inputter?.username
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">User Roles</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addUserRoles} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New User Role</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="user role">User Roles</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setUserRole(e.target.value)} />
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewUserRole}
                        onDelete={deleteUserRoles}
                    />
                </div>
            </div>
            <ToastContainer />
        </main>
    )
}

export default UserRoles;