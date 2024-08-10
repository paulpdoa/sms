import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const Requirements = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/requirements`);
    const [requirement,setRequirement] = useState('');
    const [isRequired,setIsRequired] = useState(false);

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
        }
    ]

    const { role,currentUserId,searchQuery,showForm,setShowForm,session } = useContext(MainContext);

    const updateNewRequirement = async (id,updatedData) => {
        let isRequired = updatedData.isRequired === 'Yes' ? true : false;
        
        try {
            const newData = await axios.patch(`${baseUrl()}/requirement/${id}`,{ newRequirement:updatedData.requirement,newIsRequired:isRequired,currentUserId,role, session });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }      

    const deleteRequirement = async (id) => {
        try {
            const removeRequirement = await axios.delete(`${baseUrl()}/requirement/${id}`,{ data: { role } });
            toast.success(removeRequirement.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(newRequirement.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

        }
    }

    const addRequirement = async (e) => {
        e.preventDefault();
        try {
            const newRequirement = await axios.post(`${baseUrl()}/requirements`,{ requirement,isRequired,currentUserId,role });
            toast.success(newRequirement.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        isRequired: record?.isRequired ? 'Yes' : 'No'
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Requirement</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="requirement">Requirement</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setRequirement(e.target.value)} />
        </div>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="isRequired">Required</label>
            <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setIsRequired(e.target.value)}>
                <option hidden>Choose if strongly required</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
        </div>
        </>
    )

    return (
        <main className="p-2 relative">

            <TabActions title="Requirements" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addRequirement,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewRequirement}
                        onDelete={deleteRequirement}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Requirements;