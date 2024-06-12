import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import AddReligionBtn from "../../components/AddReligionBtn";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'strand',
        header: 'Strand',
    },
    {
        header:'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Strands = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/strands`);

    const [updateStrand,setUpdateStrand] = useState(false);
    const [strandId,setStrandId] = useState('');
    const [newStrand,setNewStrand] = useState('');

    const [strand,setStrand] = useState('');
    const currentUserId = localStorage.getItem('id');
    
    const enableEditStrand = (record) => {
        setUpdateStrand(!updateStrand);
        setStrandId(record._id);
        setNewStrand(record.strand)
    }

    const updateNewStrand = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/strand/${id}`,{ newStrand,inputter: currentUserId });
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

    const deleteStrand = async (id) => {
        try {
            const removeStrand = await axios.put(`${baseUrl()}/strand/${id}`);
            toast.success(removeStrand.data.mssg, {
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

    const addStrand = async (e) => {
        e.preventDefault();
        try {   
            const newStrand = await axios.post(`${baseUrl()}/strand`,{ strand,inputter: currentUserId });
            toast.success(newStrand.data.mssg, {
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
                <h1 className="text-xl text-green-500 font-bold">Strand</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
               <div>
               <form onSubmit={addStrand} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Strand</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="strand">Strand</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setStrand(e.target.value)} />
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
                                    { updateStrand && (strandId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newStrand} onChange={(e) => setNewStrand(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter.username }
                                        </td>
                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.strand }
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter.username }
                                        </td>
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateStrand && (strandId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewStrand(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditStrand(!updateStrand)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditStrand(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteStrand(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default Strands;