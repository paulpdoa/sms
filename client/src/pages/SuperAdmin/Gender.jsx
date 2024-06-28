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

const Gender = () => {

    const columns = [
        { accessorKey: 'gender', header: 'Gender' },
        { accessorKey: 'inputter.username' ,header: 'Inputter' },
        { accessorKey: 'action', header: 'Action' }
    ]

    const { records, isLoading } = useFetch(`${baseUrl()}/genders`);
    const [gender,setGender] = useState('');
    
    const [updateGender,setUpdateGender] = useState(false);
    const [genderId,setGenderId] = useState('');
    const [newGender,setNewGender] = useState('');

    const enableEditGender = (record) => {
        setUpdateGender(!updateGender);
        setGenderId(record._id);
        setNewGender(record.gender)
    }

    const currentUserId = localStorage.getItem('id');

    const updateNewGender = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/gender/${id}`,{ newGender,currentUserId });
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


    const deleteGender = async (id) => {
        try {
            const removeGender = await axios.delete(`${baseUrl()}/gender/${id}`);
            toast.success(removeGender.data.mssg, {
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

    const addGender = async (e) => {
        e.preventDefault();
        try {
            const newGender = await axios.post(`${baseUrl()}/genders`,{ gender,inputter: currentUserId });
            toast.success(newGender.data.mssg, {
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
                <h1 className="text-xl text-green-500 font-bold">Gender</h1>
                <Searchbar onSearch/>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addGender} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Gender</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="gender">Gender</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setGender(e.target.value)} />
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns} 
                        records={records}
                        updateTrigger={updateGender}
                        recordId={genderId}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Gender;