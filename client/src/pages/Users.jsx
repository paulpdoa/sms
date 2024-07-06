import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState } from 'react';
import MasterTable from "../components/MasterTable";

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
    const navigate = useNavigate();

    const [searchQuery,setSearchQuery] = useState('');

    const userRole = localStorage.getItem('role');

    
    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name'
        },
        {
            accessorKey: 'username',
            header: 'Username',
        },
        {
            accessorKey: 'role.userRole',
            header: 'Role',
        },
        {
            accessorKey: 'isActive',
            header: 'Active',
        },
    ]

    const deleteUser = async (id) => {
        try {
            const removeUser = await axios.put(`${baseUrl()}/user/${id}`,{ data: { role: userRole } });
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
            const newUser = await axios.post(`${baseUrl()}/user`,{ firstName,middleName,lastName,username,role,password,confirmPassword,userRole });
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

    const recordsWithoutInputter = records?.filter(record => record.isActive).map(record => ({
        ...record,
        fullName: record?.firstName + ' ' + record?.lastName,
        inputter: record?.inputter?.username,
        isActive: record?.isActive ? 'Yes' : 'No'
    }));

    const goToEdit = (id) => navigate(`/edit-user/${id}`)

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2  items-center">
                <h1 className="text-xl text-green-500 font-bold">User</h1>
                <Searchbar onSearch={setSearchQuery} />
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

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteUser}
                        goToEdit={goToEdit}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Users;