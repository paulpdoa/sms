import React, { useState } from 'react';
import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import MasterTable from '../../components/MasterTable';

const columns = [
    { accessorKey: 'religion', header: 'Religion',editable: true },
    { accessorKey: 'inputter', header: 'Inputter' },
];

const Religion = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/religions`);
    const [searchQuery, setSearchQuery] = useState('');
    const [religion, setReligion] = useState('');

    const currentUserId = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    const addReligion = async (e) => {
        e.preventDefault();
        try {
            const newReligion = await axios.post(`${baseUrl()}/religions`, { religion, currentUserId, role });
            toast.success(newReligion.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    };

    const updateReligion = async (id, updatedData) => {
        console.log(id,updatedData);
        try {
            const response = await axios.patch(`${baseUrl()}/religion/${id}`, { newReligion: updatedData.religion, currentUserId, role });
            console.log(response);
            toast.success(response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

    const deleteReligion = async (id) => {
        try {
            const removeReligion = await axios.delete(`${baseUrl()}/religion/${id}`, { data: { role } });
            toast.success(removeReligion.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    };

    const recordsWithInputter = records.map(record => ({
        ...record,
        inputter: record.inputter?.username,
    }));

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Religion</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <div>
                    <form onSubmit={addReligion} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                        <h1 className="font-semibold text-xl text-green-500">Add New Religion</h1>
                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="religion">Religion</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setReligion(e.target.value)} />
                        </div>
                        <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                    </form>
                </div>

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateReligion}
                        onDelete={deleteReligion}
                    />
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default Religion;
