import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack'

const FeeCode = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-codes`);
    const { records:feeCategories } = useFetch(`${baseUrl()}/fee-categories`);

    const [description,setDescription] = useState('');
    const [code,setCode] = useState('');
    const [feeCategory,setFeeCategory] = useState('');
    const [errors,setErrors] = useState({ description: '', code: '', feeCategory: '' });

    const { enqueueSnackbar } = useSnackbar();

    const { currentUserId,role,searchQuery,showForm,setShowForm,session } = useContext(MainContext);

    const columns = [
        {
            accessorKey: 'description',
            header: 'Description',
            editable: true
        },
        {   
            accessorKey: 'code',
            header: 'Code',
            editable: true
        },
        {
            accessorKey: 'feeCateg.feeCateg',
            header: 'Fee Category',
            editable: true,
            selectOptions: feeCategories?.map(fc => ({ value: fc._id, label: fc.category }))
        },
    ]
    

    const updateNewFeeCode = async (id,updatedData) => {
        
        try {
            const newData = await axios.patch(`${baseUrl()}/fee-code/${id}`,{ description: updatedData.description,feeCateg:updatedData.feeCateg._id,code: updatedData.code, inputter: currentUserId, role,sessionId: session});
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating fee code', {
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

    const deleteFeeCode = async (id) => {
        try {
            const removeFeeCode = await axios.put(`${baseUrl()}/fee-code/${id}`,{ role, recordStatus: 'Deleted' });
            enqueueSnackbar(removeFeeCode.data.mssg, {
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting fee code', {
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

    const addFeeCode = async (e) => {
        e.preventDefault();

        if(!description) {
            setErrors(prev => ({...prev,description: 'Description cannot be empty'}));
            return enqueueSnackbar('Description is a required field', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ description: '' })
                }
            });
        }

        if(!code) {
            setErrors(prev => ({...prev,code: 'Code cannot be empty'}));
            return enqueueSnackbar('Category Code is a required field', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ code: '' })
                }
            });
        }

        if(!feeCategory) {
            setErrors(prev => ({...prev, feeCategory: 'Fee Category cannot be empty'}));
            return enqueueSnackbar('Fee Category is a required field', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ feeCategory: '' })
                }
            });
        }

        try {
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-code`,{ description,feeCategory,code,inputter: currentUserId,role,sessionId: session });
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding new fee code', {
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
        feeCateg: {
            feeCateg: record?.feeCateg?.category,
            _id: record?.feeCateg?._id
        }
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add Fee Code</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="description">Description</label>
            <input className={`outline-none p-1 rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setDescription(e.target.value)} />
            { errors.description && <span className="text-red-500 text-xs">{errors.description}</span> }

        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="category code">Category Code</label>
            <input className={`outline-none p-1 rounded-md border uppercase ${errors.code ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setCode(e.target.value)} />
            { errors.code && <span className="text-red-500 text-xs">{errors.code}</span> }
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="fee category">Fee Category</label>
            <select className={`outline-none p-1 rounded-md border ${errors.feeCategory ? 'border-red-500' : 'border-gray-300'}`} onChange={(e) => setFeeCategory(e.target.value)}>
                <option hidden>Select fee category</option>
                { feeCategories?.map(feeCateg => (
                    <option key={feeCateg._id} value={feeCateg._id}>{ feeCateg.category }</option>
                )) }
            </select>   
            { errors.feeCategory && <span className="text-red-500 text-xs">{errors.feeCategory}</span> }
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Fee Codes" />
            <div className={`gap-2 mt-5`}>
               { showForm && MasterDataForm(form,addFeeCode,setShowForm) }
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewFeeCode}
                        onDelete={deleteFeeCode}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default FeeCode;