import Searchbar from "../../components/Searchbar";
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const NationalityCode = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/nationality-codes`);
    const [nationality,setNationality] = useState('');
    const [nationalityCode,setNationalityCode] = useState('');
    const { role,currentUserId,searchQuery,setSearchQuery } = useContext(MainContext)
    const { enqueueSnackbar } = useSnackbar();

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
        },
    ];

    

    const updateNewNationality = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/nationality-code/${id}`,{ newNationality:updatedData.nationality,newNationalityCode:updatedData.nationalityCode,currentUserId,role });
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating nationality code', {
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

    const deleteNationality = async (id) => {
        try {
            const removeNationality = await axios.delete(`${baseUrl()}/nationality-code/${id}`, { data: { role } });
            enqueueSnackbar(removeNationality.data.mssg, {
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
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting nationality code', {
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

    const addNationalityCode = async (e) => {
        e.preventDefault();
        try {
            const newNationality = await axios.post(`${baseUrl()}/nationality-code`,{ nationality,nationalityCode,currentUserId,role });
            enqueueSnackbar(newNationality.data.mssg, {
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
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding nationality code', {
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
                <h1 className="text-xl text-green-500 font-bold">Nationality Code</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addNationalityCode} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Nationality Code</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="nationality">Nationality</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setNationality(e.target.value)} />
                    </div>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="nationality">Nationality Code</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setNationalityCode(e.target.value)} />
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewNationality}
                        onDelete={deleteNationality}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default NationalityCode;