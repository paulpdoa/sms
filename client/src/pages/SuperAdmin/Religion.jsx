import React, { useState,useContext } from 'react';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from '../../components/MasterDataForm';
import { useSnackbar } from 'notistack';

const Religion = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/religions`);
    const [religion, setReligion] = useState('');
    const { role,currentUserId,searchQuery,showForm,setShowForm,session } = useContext(MainContext);
    const [error,setError] = useState({ religion: '' });

    const columns = [
        { accessorKey: 'religion', header: 'Religion',editable: true }
    ];

    const { enqueueSnackbar } = useSnackbar();

    const addReligion = async (e) => {
        e.preventDefault();

        if(!religion) {
            setError(prev => ({ ...prev, religion: 'Religion cannot be empty' }));
            return enqueueSnackbar('Religion is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setError({ religion: '' });
                }
            });
        }

        try {
            const newReligion = await axios.post(`${baseUrl()}/religions`, { religion, currentUserId, role,session,sessionId: session });
            enqueueSnackbar(newReligion.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg, { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
            setShowForm(false);
        }
    };

    const updateReligion = async (id, updatedData) => {
        try {
            const response = await axios.patch(`${baseUrl()}/religion/${id}`, { newReligion: updatedData.religion, currentUserId, role,session,sessionId: session });
            console.log(response);
            enqueueSnackbar(response.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg, { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
        }
    };

    const deleteReligion = async (id) => {
        try {
            const removeReligion = await axios.put(`${baseUrl()}/religion/${id}`, { role });
            enqueueSnackbar(removeReligion.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting religion record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
        }
    };

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Religion</h1>
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="religion">Religion</label>
                <input className={`outline-none p-1 rounded-md border ${error.religion ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setReligion(e.target.value)} />
                { error.religion && <span className="text-red-500 text-xs">{error.religion}</span> }
            </div>
        </>
    ) 

    return (
        <main className="p-2 relative">
            <TabActions title="Religion" noSearch={true} />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addReligion,setShowForm) }
                <div className="relative overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateReligion}
                        onDelete={deleteReligion}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </main>
    );
};

export default Religion;
