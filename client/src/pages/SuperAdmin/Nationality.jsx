import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { nationalityCodes } from '../../data/nationalityCodes.json';
import { useSnackbar } from 'notistack';

const Nationality = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/nationalities`);
    // const { records: nationalityCodes } = useFetch(`${baseUrl()}/nationality-codes`);
    const { role,currentUserId,searchQuery,showForm,setShowForm,session } = useContext(MainContext);
    const [error,setError] = useState({ nationality: '', nationalityCode: '' });
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        {
            accessorKey: 'nationality',
            header: 'Nationality',
            editable: true,
        },
        {
            accessorKey: 'nationalityCode',
            header: 'Nationality Code',
            editable: true,
            selectOptions: nationalityCodes.map(nc => ({ value: nc._name, label: nc.name })),
        }
    ];

    const [nationality,setNationality] = useState('');
    const [nationalityCode,setNationalityCode] = useState('');

    const updateNewNationality = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/nationality/${id}`,{ newNationality:updatedData.nationality,newNationalityCode:updatedData.nationalityCode,currentUserId,role,session,sessionId: session });
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating nationality record', { 
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

    const deleteNationality = async (id) => {
        try {
            const removeNationality = await axios.put(`${baseUrl()}/nationality/${id}`,{ role,session, recordStatus: 'Deleted' });
            enqueueSnackbar(removeNationality.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting nationality record', { 
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

    const addNationality = async (e) => {
        e.preventDefault();

        if(!nationality) {
            setError(prev => ({ ...prev,nationality: 'Nationality cannot be empty' }))
            return enqueueSnackbar('Nationality is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
        if(!nationalityCode) {
            setError(prev => ({ ...prev,nationalityCode: 'Nationality code cannot be empty' }));
            return enqueueSnackbar('Nationality code is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }

        try {
            const newNationality = await axios.post(`${baseUrl()}/nationalities`,{ nationality,nationalityCode,currentUserId,role,session,sessionId: session });
            enqueueSnackbar(newNationality.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding nationality record', { 
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
        nationalityCodeId: record.nationalityCodeId?.nationalityCode,
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Nationality</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="nationality">Nationality</label>
                <input className={`outline-none p-1 rounded-md border ${error.nationality ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setNationality(e.target.value)} />
                { error.nationality && <span className="text-xs text-red-500">{error.nationality}</span> }
            </div>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="nationality">Nationality Code</label>
                <select className={`outline-none p-1 rounded-md border ${error.nationalityCode ? 'border-red-500' : 'border-gray-300'}`} onChange={(e) => setNationalityCode(e.target.value)}>
                    <option hidden>Select nationality code</option>
                    { nationalityCodes?.map(nc => (
                        <option key={nc._id} value={nc.name}>{nc.name}</option>
                    )) }
                </select>
                { error.nationalityCode && <span className="text-xs text-red-500">{error.nationalityCode}</span> }
            </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Nationalities" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addNationality,setShowForm)}
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewNationality}
                        onDelete={deleteNationality}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default Nationality;