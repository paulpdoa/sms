import React, { useState } from 'react';
import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import ReusableTable from "../../components/ReusableTable";
import ManageFeeBtn from '../../components/ManageFeeBtn';

const columns = [
    {
        accessorKey: 'gradeLevelId.gradeLevel',
        header: 'Grade Level',
    },
    {
        accessorKey: 'strandId.strand',
        header: 'Strand',
    },
    {
        accessorKey: 'feeDescription.code',
        header: 'Fee Code',
    },
    {
        accessorKey: 'feeDescription.description',
        header: 'Fee Description',
    },
    {
        accessorKey: 'feeDescription.feeCateg.code',
        header: 'Fee Category',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    }
];

const ManageFees = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/manage-fees`);
    const [searchQuery, setSearchQuery] = useState('');

    const deleteManagedFees = async (id) => {
        try {
            const removeManageFee = await axios.delete(`${baseUrl()}/manage-fee/${id}`);
            toast.success(removeManageFee.data.mssg, {
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
            }, 2000)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between items-center">
                <Searchbar onSearch={setSearchQuery} />
                <ManageFeeBtn />
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <ReusableTable 
                    records={records} 
                    columns={columns} 
                    path='/registrar/edit-manage-fee' 
                    deleteRecord={deleteManagedFees} 
                    searchQuery={searchQuery}
                />
            </div>
            <ToastContainer />
        </main>
    )
}

export default ManageFees;
