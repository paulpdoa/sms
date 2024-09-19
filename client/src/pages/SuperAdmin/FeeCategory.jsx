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

const FeeCategory = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-categories`);
    const { currentUserId,role,searchQuery,setShowForm,showForm,session } = useContext(MainContext);

    const [category,setCategory] = useState('');
    const [feeCode,setFeeCode] = useState('');
    
    
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
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                onClose: () => {
                    window.location.reload();
                }
            });
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

    const deleteFeeCategory = async (id) => {
        try {
            const removeFeeCategory = await axios.put(`${baseUrl()}/fee-category/${id}`, { role, recordStatus: 'Deleted' });
            toast.success(removeFeeCategory.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                onClose: () => {
                    window.location.reload();
                }
            });
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

    const addFeeCategory = async (e) => {
        e.preventDefault();
        try {
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-category`,{ category,code: feeCode,inputter: currentUserId,role,sessionId: session });
            toast.success(newFeeCateg.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                onClose: () => {
                    window.location.reload()
                }
            });
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

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add Fee Category</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="category">Category</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="fee code">Fee Code</label>
            <input className="outline-none p-1 rounded-md border border-gray-300 uppercase" type="text" onChange={(e) => setFeeCode(e.target.value)} />
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            {/* <DateTime /> */}
            <TabActions title="Fee Category" />

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
            <ToastContainer />          
        </main>
    )
}

export default FeeCategory;