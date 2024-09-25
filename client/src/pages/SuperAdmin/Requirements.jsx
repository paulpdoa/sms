import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const Requirements = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/requirements`);
    const [requirement,setRequirement] = useState('');
    const [isRequired,setIsRequired] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const [errors,setErrors] = useState({ requirement: '', isRequired: '' });

    const columns = [
        {
            accessorKey: 'requirement',
            header: 'Requirement',
            editable: true
        },
        {
            accessorKey: 'isRequired',
            header: 'Required',
            editable: true,
            selectOptions: ['Yes','No'].map(isReq => ({ value: `${isReq === 'No' ? false : true }`, label: isReq }))
        }
    ]

    const { role,currentUserId,searchQuery,showForm,setShowForm,session } = useContext(MainContext);

    const updateNewRequirement = async (id,updatedData) => {
        let isRequired = updatedData.isRequired === 'Yes' ? true : false;
        
        try {
            const newData = await axios.patch(`${baseUrl()}/requirement/${id}`,{ newRequirement:updatedData.requirement,newIsRequired:isRequired,currentUserId,role, session });
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating requirement record', { 
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

    const deleteRequirement = async (id) => {
        try {
            const removeRequirement = await axios.put(`${baseUrl()}/requirement/${id}`,{ recordStatus: 'Deleted' });
            enqueueSnackbar(removeRequirement.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting requirement record', { 
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

    const addRequirement = async (e) => {
        e.preventDefault();

        if(!requirement) {
            setErrors(prev => ({...prev, requirement: 'Requirement cannot be empty'}));
            return enqueueSnackbar('Requirement is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ requirement: '' });
                }
            });
        }

        if(!isRequired) {
            setErrors(prev => ({...prev,isRequired:'Required cannot be empty'}))
            return enqueueSnackbar('Is Required is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ isRequired: '' });
                }
            });
        }

        try {
            const newRequirement = await axios.post(`${baseUrl()}/requirements`,{ requirement,isRequired,currentUserId,role,session });
            enqueueSnackbar(newRequirement.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding requirement record', { 
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
        isRequired: record?.isRequired ? 'Yes' : 'No'
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Requirement</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="requirement">Requirement</label>
            <input className={`outline-none p-1 rounded-md border ${errors.requirement ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setRequirement(e.target.value)} />
            { errors.requirement && <span className="text-xs text-red-500">{errors.requirement}</span> }
        </div>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="isRequired">Required</label>
            <select 
                className={`outline-none p-1 rounded-md border ${errors.isRequired ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setIsRequired(e.target.value)}>
                <option hidden>Choose if strongly required</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>
            { errors.isRequired && <span className="text-xs text-red-500">{errors.isRequired}</span> }
        </div>
        </>
    )

    return (
        <main className="p-2 relative">

            <TabActions title="Requirements" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addRequirement,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewRequirement}
                        onDelete={deleteRequirement}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default Requirements;