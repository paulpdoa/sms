import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const Strands = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/strands`);
    const { role,session,currentUserId,showForm, searchQuery,setShowForm } = useContext(MainContext);

    const [strand,setStrand] = useState('');

    const columns = [
        {
            accessorKey: 'strand',
            header: 'Strand',
            editable: true
        }
    ]

    const updateNewStrand = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/strand/${id}`,{ newStrand:updatedData.strand,inputter: currentUserId,role,sessionId: session });
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

    const deleteStrand = async (id) => {
        try {
            const removeStrand = await axios.put(`${baseUrl()}/strand/${id}`,{ role, recordStatus: 'Deleted'});
            toast.success(removeStrand.data.mssg, {
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

    const addStrand = async (e) => {
        e.preventDefault();
        try {   
            const newStrand = await axios.post(`${baseUrl()}/strand`,{ strand,inputter: currentUserId,role,sessionId: session });
            toast.success(newStrand.data.mssg, {
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
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Strand</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="strand">Strand</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setStrand(e.target.value)} />
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Strand" />

            <div className={`gap-2 mt-5`}>
               { showForm && MasterDataForm(form,addStrand,setShowForm) }
                
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteStrand}
                        onUpdate={updateNewStrand}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Strands;