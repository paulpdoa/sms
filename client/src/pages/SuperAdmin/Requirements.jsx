import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'requirements',
        header: 'Requirement',
    },
    {
        accessorKey: 'required',
        header: 'Required',
    },
    {
        header: 'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Requirements = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/requirements`);
    const [requirement,setRequirement] = useState('');
    const [isRequired,setIsRequired] = useState(false);

    const [updateRequirement,setUpdateRequirement] = useState(false);
    const [requirementId,setRequirementId] = useState('');
    const [newRequirement,setNewRequirement] = useState('');
    const [newIsRequired,setNewIsRequired] = useState(false);

    const currentUserId = localStorage.getItem('id');

    const enableEditRequirement = (record) => {
        setUpdateRequirement(!updateRequirement);
        setRequirementId(record._id);
        setNewRequirement(record.requirement)
        setNewIsRequired(record?.isRequired);
    }

    const updateNewRequirement = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/requirement/${id}`,{ newRequirement,newIsRequired,currentUserId });
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

    const deleteRequirement = async (id) => {
        try {
            const removeRequirement = await axios.delete(`${baseUrl()}/requirement/${id}`);
            toast.success(removeRequirement.data.mssg, {
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

    const addRequirement = async (e) => {
        e.preventDefault();
        try {
            const newRequirement = await axios.post(`${baseUrl()}/requirements`,{ requirement,isRequired,currentUserId });
            toast.success(newRequirement.data.mssg, {
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

            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Requirement</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addRequirement} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Requirement</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="requirement">Requirement</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setRequirement(e.target.value)} />
                    </div>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="isRequired">Required</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setIsRequired(e.target.value)}>
                            <option hidden>Choose if required</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

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
                                    { updateRequirement && (requirementId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newRequirement} onChange={(e) => setNewRequirement(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewIsRequired(e.target.value)}>
                                                <option hidden>{record.isRequired ? 'Yes' : 'No'}</option>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </td>
                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.requirement }
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.isRequired ? 'Yes' : 'No' }
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </td>
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateRequirement && (requirementId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewRequirement(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditRequirement(!updateRequirement)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditRequirement(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteRequirement(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default Requirements;