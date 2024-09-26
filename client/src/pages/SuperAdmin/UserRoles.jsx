import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const UserRoles = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/user-roles`);
    const [userRole,setUserRole] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const [errors,setErrors] = useState({ userRole: '' });
    
    const { role,currentUserId,searchQuery,showForm,setShowForm,session,showError } = useContext(MainContext);

    const columns = [
        {
            accessorKey: 'userRole',
            header: 'User Role',
            editable: true,
        }
    ]

    const updateNewUserRole = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/user-role/${id}`,{ newUserRole:updatedData.userRole,currentUserId,role,sessionId: session });
            enqueueSnackbar(newData.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload()
                }
            });
        } catch(err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating user role record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }


    const deleteUserRoles = async (id) => {
        try {
            const removeUserRoles = await axios.put(`${baseUrl()}/user-role/${id}`,{ recordStatus: 'Deleted' });
            enqueueSnackbar(removeUserRoles.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting user role record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const addUserRoles = async (e) => {
        e.preventDefault();

        if(!userRole) return showError('userRole','User role cannot be empty','User role is a required field',setErrors);

        try {
            const newUserRoles = await axios.post(`${baseUrl()}/user-roles`,{ userRole,currentUserId,role,sessionId: session });
            enqueueSnackbar(newUserRoles.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload()
                }
            });
        } catch(err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding user role record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New User Role</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="user role">User Roles</label>
            <input className={`outline-none p-1 rounded-md border ${errors.userRole ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setUserRole(e.target.value)} />
            { errors.userRole && <span className="text-red-500 text-xs">{errors.userRole}</span> }
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
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </main>
    )
}

export default UserRoles;