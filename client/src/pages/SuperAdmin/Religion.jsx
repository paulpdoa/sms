import React, { useState,useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { usePost } from '../../hooks/usePost';
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from '../../components/MasterDataForm';

const Religion = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/religions`);
    const [religion, setReligion] = useState('');
    const { role,currentUserId,searchQuery,showForm,setShowForm,session } = useContext(MainContext);
    const [error,setError] = useState({ religion: '' });

    const columns = [
        { accessorKey: 'religion', header: 'Religion',editable: true }
    ];

    const addReligion = async (e) => {
        e.preventDefault();

       
        if(!religion) {
            setError(prev => ({ ...prev, religion: 'Religion cannot be empty' }));
            setTimeout(() => {
                setError({religion: ''});
            },3000)
            return;
        }

        try {
            const newReligion = await axios.post(`${baseUrl()}/religions`, { religion, currentUserId, role,session,sessionId: session });
            toast.success(newReligion.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setShowForm(false);
        }
    };

    const updateReligion = async (id, updatedData) => {
        try {
            const response = await axios.patch(`${baseUrl()}/religion/${id}`, { newReligion: updatedData.religion, currentUserId, role,session,sessionId: session });
            console.log(response);
            toast.success(response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    const deleteReligion = async (id) => {
        try {
            const removeReligion = await axios.put(`${baseUrl()}/religion/${id}`, { role });
            toast.success(removeReligion.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error('An error occurred while deleting religion record', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Religion</h1>
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="religion">Religion</label>
                <input className={`outline-none p-1 rounded-md border ${error.religion ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setReligion(e.target.value)} />
                { error.religion && <span className="text-red-500 text-xs">{error.religion}</span> }
            </div>
        </>
    ) 

    return (
        <main className="p-2 relative">
            <TabActions title="Religion" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addReligion,setShowForm) }
                <div className="relative overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateReligion}
                        onDelete={deleteReligion}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default Religion;
