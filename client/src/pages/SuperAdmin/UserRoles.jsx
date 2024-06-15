import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'userRoles',
        header: 'User Roles',
    },
    {
        header: 'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const UserRoles = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/user-roles`);
    const [userRole,setUserRole] = useState('');

    const [updateUserRole,setUpdateUserRole] = useState(false);
    const [userRoleId,setUserRoleId] = useState('');
    const [newUserRole,setNewUserRole] = useState('');

    const currentUserId = localStorage.getItem('id');

    const enableEditUserRole = (record) => {
        setUpdateUserRole(!updateUserRole);
        setUserRoleId(record._id);
        setNewUserRole(record.userRole);
    }

    const updateNewUserRole = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/user-role/${id}`,{ newUserRole,currentUserId });
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
            const removeUserRoles = await axios.put(`${baseUrl()}/user-role/${id}`);
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
            const newUserRoles = await axios.post(`${baseUrl()}/user-roles`,{ userRole,currentUserId });
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

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">User Roles</h1>
                <Searchbar />
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

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                { columns?.map((column,key) => (
                                    <th key={key} scope="col" className="px-6 py-3">
                                        { column.header }
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            { records?.map(record => (
                               <tr key={record._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                { updateUserRole && (userRoleId === record._id) ?
                                    <>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <input type="text" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                    </th>
                                    <td scope="row" className="px-6 py-4 font-medium">
                                        { record.inputter.username }
                                    </td>
                                    </>
                                    :
                                    <>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { record.userRole }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium">
                                        { record.inputter.username }
                                    </th>
                                    </>
                                }

                                <td className="px-6 py-4 flex gap-2 items-center">
                                    { updateUserRole && (userRoleId === record._id) ? 
                                    <>
                                    <button onClick={() => updateNewUserRole(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                    <button onClick={() => enableEditUserRole(!updateUserRole)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                    </>
                                    :
                                    <>
                                    <button onClick={() => enableEditUserRole(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                    <button onClick={() => deleteUserRoles(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </>
                                    }
                                    
                                </td>
                            </tr>
                            )) }
                        </tbody>
                    </table>
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default UserRoles;