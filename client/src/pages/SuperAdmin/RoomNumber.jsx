import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const RoomNumber = () => {

    const { records: roomNumbers } = useFetch(`${baseUrl()}/room-numbers`);

    const [roomNumber,setRoomNumber] = useState('');

    const { role,session,currentUserId,searchQuery,showForm,setShowForm } = useContext(MainContext);
    const [isLoading,setIsLoading] = useState(false);

    const columns = [
        { accessorKey: 'roomNumber', header: 'Room Number', editable: true }
    ]

    const addRoomNumber = async (e) => {
        e.preventDefault();

        try {
            const data = await axios.post(`${baseUrl()}/room-number`,{ roomNumber,inputter: currentUserId, sessionId: session,role })
            toast.success(data.data.mssg, {
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

    const updateRoomNumber = async (id,updatedData) => {
        try {
            const data = await axios.patch(`${baseUrl()}/room-number/${id}`, { roomNumber: updatedData.roomNumber,role,sessionId: session });
            toast.success(data.data.mssg, {
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

    const deleteRoomNumber = async (id) => {
        try {
            const data = await axios.put(`${baseUrl()}/room-number/${id}`,{ recordStatus: 'Deleted' });
            toast.success(data.data.mssg, {
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

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Room Number</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="room number">Room Number</label>
                <input className="outline-none p-1 rounded-md border border-gray-300" type="number" onChange={(e) => setRoomNumber(e.target.value)} />
            </div>
        </>
    )

    return (
        <main className="p-2 relative">
        {/* <DateTime /> */}
        <TabActions title="Room Number" />

        <div className={`gap-2 mt-5`}>
            { showForm && MasterDataForm(form,addRoomNumber,setShowForm)}

            <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                <MasterTable
                    columns={columns}
                    data={roomNumbers}
                    searchQuery={searchQuery}
                    onUpdate={updateRoomNumber}
                    onDelete={deleteRoomNumber}
                    isLoading={isLoading}
                />
            </div>    
        </div> 
        <ToastContainer />          
    </main>
    )
}

export default RoomNumber;