import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        header: 'Description',
    },
    {
        header: 'Code'
    },
    
    {
        header: 'Fee Category'
    },
    {
        header:'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const FeeCode = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-codes`);
    const { records:feeCategories } = useFetch(`${baseUrl()}/fee-categories`);

    const [updateFeeCode,setUpdateFeeCode] = useState(false);
    const [feeCodeId,setfeeCodeId] = useState('');

    const [newCode,setNewCode] = useState('');
    const [newDescription,setNewDescription] = useState('');
    const [newFeeCategory,setNewFeeCategory] = useState('');

    const [description,setDescription] = useState('');
    const [code,setCode] = useState('');
    const [feeCategory,setFeeCategory] = useState('');
    

    const enableEditFeeCode = (record) => {
        setNewDescription(record.description);
        setUpdateFeeCode(!updateFeeCode);
        setfeeCodeId(record._id);
        setNewCode(record.code);
        setNewFeeCategory(record.feeCateg?._id)
    }

    const currentUserId = localStorage.getItem('id');

    const updateNewFeeCode = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/fee-code/${id}`,{ description: newDescription,feeCateg:newFeeCategory,code:newCode, inputter: currentUserId});
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

    const deleteFeeCode = async (id) => {
        try {
            const removeFeeCode = await axios.delete(`${baseUrl()}/fee-code/${id}`);
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
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-code`,{ description,feeCategory,code,inputter: currentUserId });
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

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2  items-center">
                <h1 className="text-xl text-green-500 font-bold">Fee Code</h1>
                <Searchbar />
                {/* <AddReligionBtn /> */}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
               <div>
               <form onSubmit={addFeeCode} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
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

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>
                
               </div>

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                { columns?.map((column,key) => (
                                    <th key={key} scope="col" className="px-6 py-3">
                                        { column.header }
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            { records?.map(record => (
                                <tr key={record._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    { updateFeeCode && (feeCodeId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="outline-none p-1 rounded-md border uppercase border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewFeeCategory(e.target.value)}>
                                                <option hidden>{ record.feeCateg?.category }</option>
                                                { feeCategories?.map(feeCateg => (
                                                    <option key={feeCateg._id} value={feeCateg._id}>{ feeCateg.category }</option>
                                                )) }
                                            </select>
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </th> 
                                        </> 
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.description }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.code }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.feeCateg?.category }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </th>  
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateFeeCode && (feeCodeId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewFeeCode(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditFeeCode(!updateFeeCode)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditFeeCode(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteFeeCode(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </>
                                        }
                                        
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default FeeCode;