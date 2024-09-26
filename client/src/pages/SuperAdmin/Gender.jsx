import Searchbar from "../../components/Searchbar";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const Gender = () => {

    const columns = [
        { accessorKey: 'gender', header: 'Gender',editable: true },
    ]

    const { records, isLoading } = useFetch(`${baseUrl()}/genders`);
    const [gender,setGender] = useState('');
    const { role,currentUserId,searchQuery,setSearchQuery } = useContext(MainContext)
    const { enqueueSnackbar } = useSnackbar();

    const updateNewGender = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/gender/${id}`,{ newGender:updatedData.gender,currentUserId,role });
            enqueueSnackbar(newData.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating gender', {
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


    const deleteGender = async (id) => {
        try {
            const removeGender = await axios.delete(`${baseUrl()}/gender/${id}`,{ data: { role } });
            enqueueSnackbar(removeGender.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting gender', {
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

    const addGender = async (e) => {
        e.preventDefault();
        try {
            const newGender = await axios.post(`${baseUrl()}/genders`,{ gender,inputter: currentUserId, role });
            enqueueSnackbar(newGender.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding gender', {
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

    const recordsWithInputter = records.map(record => ({
        ...record,
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Gender</h1>
                <Searchbar onSearch={setSearchQuery}/>
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

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewGender}
                        onDelete={deleteGender}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default Gender;