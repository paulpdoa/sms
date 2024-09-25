import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const RoomNumber = () => {

    const { records: roomNumbers } = useFetch(`${baseUrl()}/room-numbers`);

    const [roomNumber,setRoomNumber] = useState('');
    const [error,setError] = useState({ roomNumber: '' });
    const { enqueueSnackbar } = useSnackbar();

    const { role,session,currentUserId,searchQuery,showForm,setShowForm } = useContext(MainContext);
    const [isLoading,setIsLoading] = useState(false);

    const columns = [
        { accessorKey: 'roomNumber', header: 'Room Number', editable: true }
    ]

    const addRoomNumber = async (e) => {
        e.preventDefault();

        if(!roomNumber) {
            setError({ roomNumber: 'Room number cannot be empty' });
            return enqueueSnackbar('Room number is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setError({ roomNumber: '' });
                }
            });
        }

        try {
            const data = await axios.post(`${baseUrl()}/room-number`,{ roomNumber,inputter: currentUserId, sessionId: session,role })
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding room number record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const updateRoomNumber = async (id,updatedData) => {
        try {
            const data = await axios.patch(`${baseUrl()}/room-number/${id}`, { roomNumber: updatedData.roomNumber,role,sessionId: session });
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating room number record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const deleteRoomNumber = async (id) => {
        try {
            const data = await axios.put(`${baseUrl()}/room-number/${id}`,{ recordStatus: 'Deleted' });
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting room number record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Room Number</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="room number">Room Number</label>
                <input className={`outline-none p-1 rounded-md border ${error.roomNumber ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setRoomNumber(e.target.value)} />
                { error.roomNumber && <span className="text-xs text-red-500">{error.roomNumber}</span> }
            </div>
        </>
    )

    return (
        <main className="p-2 relative">
        {/* <DateTime /> */}
        <TabActions title="Room Numbers" />

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
    </main>
    )
}

export default RoomNumber;