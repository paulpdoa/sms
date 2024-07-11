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

const FeeCategory = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-categories`);
    const { currentUserId,role,searchQuery,setSearchQuery,showForm } = useContext(MainContext);

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
            const newData = await axios.patch(`${baseUrl()}/fee-category/${id}`,{ category:updateData.category,code:updatedData.code,role });
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

            setTimeout(() => {
                window.location.reload();
            },2000)
        }
    }      

    const deleteFeeCategory = async (id) => {
        try {
            const removeFeeCategory = await axios.delete(`${baseUrl()}/fee-category/${id}`, { data: { role } });
            toast.success(removeFeeCategory.data.mssg, {
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

    const addFeeCategory = async (e) => {
        e.preventDefault();
        try {
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-category`,{ category,code: feeCode,inputter: currentUserId,role });
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

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <TabActions title="Fee Category" />

            <div className={`${showForm ? 'grid grid-cols-3' : ''} gap-2 mt-5`}>
                { showForm && (
                    <form onSubmit={addFeeCategory} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                        <h1 className="font-semibold text-xl text-green-500">Add Fee Category</h1>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="category">Category</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="fee code">Fee Code</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300 uppercase" type="text" onChange={(e) => setFeeCode(e.target.value)} />
                        </div>

                        <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                    </form>
                ) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewFeeCategory}
                        onDelete={deleteFeeCategory}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default FeeCategory;