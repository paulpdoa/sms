import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const Strands = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/strands`);
    const { role,session,currentUserId,showForm, searchQuery,setShowForm } = useContext(MainContext);

    const [strand,setStrand] = useState('');
    const [errors,setErrors] = useState({ strand: '' });

    const { enqueueSnackbar } = useSnackbar();
    
    const columns = [
        {
            accessorKey: 'strand',
            header: 'Strand',
            editable: true
        }
    ]

    const updateNewStrand = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/strand/${id}`,{ newStrand:updatedData.strand,inputter: currentUserId,role,sessionId: session });
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating strand record', { 
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

    const deleteStrand = async (id) => {
        try {
            const removeStrand = await axios.put(`${baseUrl()}/strand/${id}`,{ role, recordStatus: 'Deleted'});
            enqueueSnackbar(removeStrand .data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting strand record', { 
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

    const addStrand = async (e) => {
        e.preventDefault();

        if(!strand) {
            setErrors({ strand: 'Strand cannot be empty' });
            return enqueueSnackbar('Strand is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ strand: '' })
                }
            });
        }

        try {   
            const newStrand = await axios.post(`${baseUrl()}/strand`,{ strand,inputter: currentUserId,role,sessionId: session });
            enqueueSnackbar(newStrand.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding section record', { 
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
        <h1 className="font-semibold text-xl text-gray-700">Add New Strand</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="strand">Strand</label>
            <input className={`outline-none p-1 rounded-md border ${errors.strand ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setStrand(e.target.value)} />
            { errors.strand && <span className="text-xs text-red-500">{errors.strand}</span> }
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Strands" />
            <div className={`gap-2 mt-5`}>
               { showForm && MasterDataForm(form,addStrand,setShowForm) }
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteStrand}
                        onUpdate={updateNewStrand}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default Strands;