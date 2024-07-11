import React, { useState,useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';


const Religion = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/religions`);
    const [religion, setReligion] = useState('');
    const { role,currentUserId,searchQuery,showForm } = useContext(MainContext);

    const columns = [
        { accessorKey: 'religion', header: 'Religion',editable: true }
    ];

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
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <TabActions title="Religion" />

            <div className={`${showForm ? 'grid grid-cols-3' : ''} gap-2 mt-5`}>
                { showForm && (
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
                ) }

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
