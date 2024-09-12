import Searchbar from "../components/Searchbar";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../components/MasterTable";
import { MainContext } from "../helpers/MainContext";
import AddUserBtn from '../components/buttons/AddUserBtn';

const Users = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/users`);
    
    const navigate = useNavigate();

    const { role: userRole,currentUserId,searchQuery,setSearchQuery,genericPath } = useContext(MainContext);

    
    const columns = [
        {
            accessorKey: 'username',
            header: 'Username',
        },
        {
            accessorKey: 'role.userRole',
            header: 'Role',
        }
    ]

    const deleteUser = async (id) => {
        try {
            const removeUser = await axios.put(`${baseUrl()}/user/${id}`,{ role: userRole, recordStatus: 'Deleted' });
            toast.success(removeUser.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
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

    

    const recordsWithoutInputter = records?.filter(record => record.recordStatus === 'Live').map(record => ({
        ...record,
    }));

    const goToEdit = (id) => navigate(`/${genericPath}/edit-user/${id}`)

    return (
        <main className="p-2">
            <div className="flex flex-col justify-between mx-4 my-2 gap-2">
                <h1 className="text-2xl text-gray-700 font-bold">User</h1>
                <div className="flex justify-between w-full gap-2">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddUserBtn />
                </div>
            </div>

            <div className="gap-2 mt-5">
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteUser}
                        goToEdit={goToEdit}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Users;