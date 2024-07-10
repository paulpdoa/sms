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

const Strands = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/strands`);
    const { role,currentUserId,setSearchQuery, searchQuery } = useContext(MainContext);

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
            const newData = await axios.patch(`${baseUrl()}/strand/${id}`,{ newStrand:updatedData.strand,inputter: currentUserId,role });
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
            console.log(err);
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

    const deleteStrand = async (id) => {
        try {
            const removeStrand = await axios.put(`${baseUrl()}/strand/${id}`,{ data: { role }});
            toast.success(removeStrand.data.mssg, {
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

    const addStrand = async (e) => {
        e.preventDefault();
        try {   
            const newStrand = await axios.post(`${baseUrl()}/strand`,{ strand,inputter: currentUserId,role });
            toast.success(newStrand.data.mssg, {
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
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2  items-center">
                <h1 className="text-xl text-green-500 font-bold">Strand</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
               <div>
               <form onSubmit={addStrand} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Strand</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="strand">Strand</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setStrand(e.target.value)} />
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>
                
               </div>

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteStrand}
                        onUpdate={updateNewStrand}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Strands;