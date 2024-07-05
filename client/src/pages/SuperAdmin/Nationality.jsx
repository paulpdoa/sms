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

const Nationality = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/nationalities`);
    const { records: nationalityCodes } = useFetch(`${baseUrl()}/nationality-codes`);

    const columns = [
        {
            accessorKey: 'nationality',
            header: 'Nationality',
            editable: true,
        },
        {
            accessorKey: 'nationalityCodeId',
            header: 'Nationality Code',
            editable: true,
            selectOptions: nationalityCodes.map(nc => ({ value: nc._id, label: nc.nationalityCode })),
        },
        { 
            accessorKey: 'inputter', 
            header: 'Inputter' 
        }
    ];


    const [searchQuery, setSearchQuery] = useState('');

    const [nationality,setNationality] = useState('');
    const [nationalityCodeId,setNationalityCodeId] = useState('');

    const currentUserId = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    const updateNewNationality = async (id,updatedData) => {
        
        try {
            const newData = await axios.patch(`${baseUrl()}/nationality/${id}`,{ newNationality:updatedData.nationality,newNationalityCodeId:updatedData.nationalityCodeId,currentUserId,role });
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
        }
    }        

    const deleteNationality = async (id) => {
        try {
            const removeNationality = await axios.delete(`${baseUrl()}/nationality/${id}`,{ data: { role } });
            toast.success(removeNationality.data.mssg, {
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

    const addNationality = async (e) => {
        e.preventDefault();
        try {
            const newNationality = await axios.post(`${baseUrl()}/nationalities`,{ nationality,nationalityCodeId,currentUserId,role });
            toast.success(newNationality.data.mssg, {
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
            console.log(err);
        }
    }

    const recordsWithInputter = records.map(record => ({
        ...record,
        nationalityCodeId: record.nationalityCodeId?.nationalityCode,
        inputter: record.inputter?.username,
    }));

    return (
        <main className="p-2">
            <DateTime />

            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Nationality</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addNationality} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Nati   onality</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="nationality">Nationality</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setNationality(e.target.value)} />
                    </div>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="nationality">Nationality Code</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setNationalityCodeId(e.target.value)}>
                            <option hidden>Select nationality code</option>
                            { nationalityCodes?.map(nc => (
                                <option key={nc._id} value={nc._id}>{nc.nationalityCode}</option>
                            )) }
                        </select>
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewNationality}
                        onDelete={deleteNationality}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Nationality;