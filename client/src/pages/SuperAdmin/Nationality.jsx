import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { nationalityCodes } from '../../data/nationalityCodes.json';

const Nationality = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/nationalities`);
    // const { records: nationalityCodes } = useFetch(`${baseUrl()}/nationality-codes`);
    const { role,currentUserId,searchQuery,showForm,setShowForm,session } = useContext(MainContext)

    const columns = [
        {
            accessorKey: 'nationality',
            header: 'Nationality',
            editable: true,
        },
        {
            accessorKey: 'nationalityCode',
            header: 'Nationality Code',
            editable: true,
            selectOptions: nationalityCodes.map(nc => ({ value: nc._name, label: nc.name })),
        }
    ];

    const [nationality,setNationality] = useState('');
    const [nationalityCode,setNationalityCode] = useState('');

    const updateNewNationality = async (id,updatedData) => {
        
        try {
            const newData = await axios.patch(`${baseUrl()}/nationality/${id}`,{ newNationality:updatedData.nationality,newNationalityCode:updatedData.nationalityCode,currentUserId,role,session,sessionId: session });
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
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }        

    const deleteNationality = async (id) => {
        try {
            const removeNationality = await axios.put(`${baseUrl()}/nationality/${id}`,{ role,session, recordStatus: 'Deleted' });
            toast.success(removeNationality.data.mssg, {
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
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const addNationality = async (e) => {
        e.preventDefault();
        try {
            const newNationality = await axios.post(`${baseUrl()}/nationalities`,{ nationality,nationalityCode,currentUserId,role,session,sessionId: session });
            toast.success(newNationality.data.mssg, {
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

    const recordsWithInputter = records.map(record => ({
        ...record,
        nationalityCodeId: record.nationalityCodeId?.nationalityCode,
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Nationality</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="nationality">Nationality</label>
                <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setNationality(e.target.value)} />
            </div>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="nationality">Nationality Code</label>
                <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setNationalityCode(e.target.value)}>
                    <option hidden>Select nationality code</option>
                    { nationalityCodes?.map(nc => (
                        <option key={nc._id} value={nc.name}>{nc.name}</option>
                    )) }
                </select>
            </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Nationality" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addNationality,setShowForm)}
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewNationality}
                        onDelete={deleteNationality}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Nationality;