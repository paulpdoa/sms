import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";


const UserRoles = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/user-roles`);
    const [userRole,setUserRole] = useState('');
    
    const { role,currentUserId,searchQuery,showForm,setShowForm } = useContext(MainContext);

    const columns = [
        {
            accessorKey: 'userRole',
            header: 'User Role',
            editable: true,
        }
    ]

    const updateNewUserRole = async (id,updatedData) => {
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
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-green-500">Add New User Role</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="user role">User Roles</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setUserRole(e.target.value)} />
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="User Roles" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addUserRoles,setShowForm) }

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