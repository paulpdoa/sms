import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';
import MasterTable from "../../components/MasterTable";

const Requirements = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/requirements`);
    const [requirement,setRequirement] = useState('');
    const [isRequired,setIsRequired] = useState(false);
    const [searchQuery,setSearchQuery] = useState('');

    const columns = [
        {
            accessorKey: 'requirement',
            header: 'Requirement',
            editable: true
        },
        {
            accessorKey: 'isRequired',
            header: 'Required',
            editable: true,
            selectOptions: ['Yes','No'].map(isReq => ({ value: `${isReq === 'No' ? false : true }`, label: isReq }))
        },
        {
            accessorKey: 'inputter',
            header: 'Inputter'
        }
    ]

    const currentUserId = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    const updateNewRequirement = async (id,updatedData) => {
        let isRequired = updatedData.isRequired === 'Yes' ? true : false;
        
        try {
            const newData = await axios.patch(`${baseUrl()}/requirement/${id}`,{ newRequirement:updatedData.requirement,newIsRequired:isRequired,currentUserId,role });
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
            const removeRequirement = await axios.delete(`${baseUrl()}/requirement/${id}`,{ data: { role } });
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
            const newRequirement = await axios.post(`${baseUrl()}/requirements`,{ requirement,isRequired,currentUserId,role });
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

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        inputter: record?.inputter?.username,
        isRequired: record?.isRequired ? 'Yes' : 'No'
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}

            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Requirement</h1>
                <Searchbar onSearch={setSearchQuery} />
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

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewRequirement}
                        onDelete={deleteRequirement}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Requirements;