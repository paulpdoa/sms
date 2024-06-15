import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'fullName',
        header: 'Full Name',
    },
    {
        accessorKey: 'username',
        header: 'Username',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'isActive',
        header: 'Active',
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Users = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/users`);
    const { records: roles } = useFetch(`${baseUrl()}/user-roles`)

    const [firstName,setFirstName] = useState('');
    const [middleName,setMiddleName] = useState('');
    const [lastName,setLastName] = useState('');
    const [role,setRole] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const deleteUser = async (id) => {
        try {
            const removeUser = await axios.put(`${baseUrl()}/user/${id}`);
            toast.success(removeUser.data.mssg, {
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

    const addUser = async (e) => {
        e.preventDefault();
        try {
            const newUser = await axios.post(`${baseUrl()}/user`,{ firstName,middleName,lastName,username,role,password,confirmPassword });
            localStorage.setItem('user',newUser.data.token);
            toast.success(newUser.data.mssg, {
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
        }
    }

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2  items-center">
                <h1 className="text-xl text-green-500 font-bold">User</h1>
                <Searchbar />
                {/* <AddReligionBtn /> */}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addUser} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New User</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="first name">First Name</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setFirstName(e.target.value)} />
                    </div>  
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="middle name">Middle Name</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setMiddleName(e.target.value)} />
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="last name">Last Name</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="username">Username</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm" htmlFor="role">Role</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setRole(e.target.value)}
                            >
                            <option hidden>Role</option>
                            { roles?.map(role => (
                                <option key={role._id} value={role._id}>{role.userRole}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="password">Password</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="confirm password">Confirm Password</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
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
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { record.firstName } { record.middleName } { record.lastName } 
                                    </th>
                                    <td className="px-6 py-4 gap-2">
                                        { record.username }
                                    </td>
                                    <td className="px-6 py-4 gap-2">
                                        { record.role?.userRole }
                                    </td>
                                    <td className="px-6 py-4 gap-2">
                                        { record.isActive ? 'Yes' : 'No' }
                                    </td>
                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        <Link to={`/master/edit-user/${record._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                                        <button onClick={() => deleteUser(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default Users;