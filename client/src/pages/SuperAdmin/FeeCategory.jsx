import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const FeeCategory = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-categories`);
    const { currentUserId,role,searchQuery,setShowForm,showForm,session } = useContext(MainContext);

    const [category,setCategory] = useState('');
    const [feeCode,setFeeCode] = useState('');
    
    const [errors,setErrors] = useState({ category: '', feeCode: '' });

    const { enqueueSnackbar } = useSnackbar(); 
    
    const columns = [
        {   
            accessorKey: 'category',
            header: 'Category',
            editable: true
        },
        {
            accessorKey: 'code',
            header: 'Code',
            editable: true
        }
    ]

    const updateNewFeeCategory = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/fee-category/${id}`,{ category:updatedData.category,code:updatedData.code,role,sessionId:session, inputter: currentUserId });
            enqueueSnackbar(newData.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating discount record', { 
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

    const deleteFeeCategory = async (id) => {
        try {
            const removeFeeCategory = await axios.put(`${baseUrl()}/fee-category/${id}`, { role, recordStatus: 'Deleted' });
            enqueueSnackbar(removeFeeCategory.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating deleting record', { 
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

    const addFeeCategory = async (e) => {
        e.preventDefault();

        if(!category) {
            setErrors(prev => ({...prev, category: 'Category cannot be empty'}))
            return enqueueSnackbar('Category is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ category: '', feeCode: '' });
                }
            });
        }

        if(!feeCode) {
            setErrors(prev => ({...prev, feeCode: 'Fee code cannot be empty'}))
            return enqueueSnackbar('Fee Code is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ category: '', feeCode: '' });
                }
            });
        }

        try {
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-category`,{ category,code: feeCode,inputter: currentUserId,role,sessionId: session });
            enqueueSnackbar(newFeeCateg.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating deleting record', { 
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
        <h1 className="font-semibold text-xl text-gray-700">Add Fee Category</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="category">Category</label>
            <input className={`outline-none p-1 rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setCategory(e.target.value)} />
            { errors.category && <span className="text-red-500 text-xs">{errors.category}</span> }
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="fee code">Fee Code</label>
            <input className={`outline-none p-1 rounded-md border ${errors.feeCode ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setFeeCode(e.target.value)} />
            { errors.feeCode && <span className="text-red-500 text-xs">{errors.feeCode}</span> }
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            {/* <DateTime /> */}
            <TabActions title="Fee Categories" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addFeeCategory,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewFeeCategory}
                        onDelete={deleteFeeCategory}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default FeeCategory;