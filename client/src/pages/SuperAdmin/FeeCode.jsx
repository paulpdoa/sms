import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
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

const FeeCode = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-codes`);
    const { records:feeCategories } = useFetch(`${baseUrl()}/fee-categories`);

    const [description,setDescription] = useState('');
    const [code,setCode] = useState('');
    const [feeCategory,setFeeCategory] = useState('');

    const { currentUserId,role,searchQuery,showForm,setShowForm } = useContext(MainContext);

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
            const newData = await axios.patch(`${baseUrl()}/fee-code/${id}`,{ description: updatedData.description,feeCateg:updatedData.feeCateg._id,code: updatedData.code, inputter: currentUserId, role});
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
            console.log(err);
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

           
        }
    }      

    const deleteFeeCode = async (id) => {
        try {
            const removeFeeCode = await axios.delete(`${baseUrl()}/fee-code/${id}`,{ data: { role } });
            toast.success(removeFeeCode.data.mssg, {
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

    const addFeeCode = async (e) => {
        e.preventDefault();
        try {
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-code`,{ description,feeCategory,code,inputter: currentUserId,role });
            toast.success(newFeeCateg.data.mssg, {
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

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        feeCateg: {
            feeCateg: record?.feeCateg?.category,
            _id: record?.feeCateg?._id
        }
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-green-500">Add Fee Code</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="description">Description</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="category code">Category Code</label>
            <input className="outline-none p-1 rounded-md border border-gray-300 uppercase" type="text" onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="fee category">Fee Category</label>
            <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setFeeCategory(e.target.value)}>
                <option hidden>Select fee category</option>
                { feeCategories?.map(feeCateg => (
                    <option key={feeCateg._id} value={feeCateg._id}>{ feeCateg.category }</option>
                )) }
            </select>                    
        </div>

       
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Fee Code" />

            <div className={`gap-2 mt-5`}>
               
               { showForm && MasterDataForm(form,addFeeCode,setShowForm) }
                
               

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewFeeCode}
                        onDelete={deleteFeeCode}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default FeeCode;