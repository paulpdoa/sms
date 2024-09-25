import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const Department = () => {

    const { records,isLoading } = useFetch(`${baseUrl()}/departments`);
    const [department,setDepartment] = useState('');
    const [error,setError] = useState({ department: '' });

    const { enqueueSnackbar } = useSnackbar();

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
            const newData = await axios.patch(`${baseUrl()}/department/${id}`,{ newDepartment: updatedData.department,currentUserId,role,sessionId: session, session });
            enqueueSnackbar(newData.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating department record', { 
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

    const deleteDepartment = async (id) => {
        try {
            const removeDepartment = await axios.put(`${baseUrl()}/department/${id}`,{ recordStatus: 'Deleted' });
            enqueueSnackbar(removeDepartment.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting department record', { 
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

    const addDepartment = async (e) => {
        e.preventDefault();

        if(!department) {
            setError(prev => ({...prev, department: 'Department cannot be empty'}));
            return enqueueSnackbar('Department is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setError({ department: '' });
                }
            });
        }

        try {
            const newDepartment = await axios.post(`${baseUrl()}/departments`,{ department,currentUserId,session,role, sessionId: session });
           
            enqueueSnackbar(newDepartment.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding department record', { 
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

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Department</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="department">Department</label>
                <input className={`outline-none p-1 rounded-md border ${error.department ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setDepartment(e.target.value)} />
                { error.department && <span className="text-xs text-red-500">{error.department}</span> }
            </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Departments" />
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
        </main>
    )
}

export default Department;