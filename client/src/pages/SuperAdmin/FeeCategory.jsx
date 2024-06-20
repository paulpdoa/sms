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
        header: 'Category',
    },
    {
        header: 'Code'
    },
    {
        header:'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const FeeCategory = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/fee-categories`);

    const [updateFeeCategory,setUpdateFeeCategory] = useState(false);
    const [feeCategoryId,setFeeCategoryId] = useState('');

    const [newCategory,setNewCategory] = useState('');
    const [newFeeCode,setNewFeeCode] = useState('');

    const [category,setCategory] = useState('');
    const [feeCode,setFeeCode] = useState('');
    

    const enableEditFeeCategory = (record) => {
        setUpdateFeeCategory(!updateFeeCategory);
        setFeeCategoryId(record._id);
        setNewCategory(record.category);
        setNewFeeCode(record.code);
    }

    const currentUserId = localStorage.getItem('id');

    const updateNewFeeCategory = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/fee-category/${id}`,{ category:newCategory,code:newFeeCode });
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
            const removeFeeCategory = await axios.delete(`${baseUrl()}/fee-category/${id}`);
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
            const newFeeCateg = await axios.post(`${baseUrl()}/fee-category`,{ category,code: feeCode,inputter: currentUserId });
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
                <h1 className="text-xl text-green-500 font-bold">Fee Category</h1>
                <Searchbar />
                {/* <AddReligionBtn /> */}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
               <div>
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
                                    { updateFeeCategory && (feeCategoryId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newFeeCode} onChange={(e) => setNewFeeCode(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </th> 
                                        </> 
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.category }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.code }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </th>  
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateFeeCategory && (feeCategoryId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewFeeCategory(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditFeeCategory(!updateFeeCategory)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditFeeCategory(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteFeeCategory(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default FeeCategory;