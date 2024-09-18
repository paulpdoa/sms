import React, { useContext,useState } from 'react';
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import ManageFeeBtn from '../../components/buttons/ManageFeeBtn';
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationPopup from '../../components/ConfirmationPopup';

const ManageFees = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/manage-fees`);
    const { searchQuery, setSearchQuery,genericPath, role,session,currentUserId } = useContext(MainContext);
    const navigate = useNavigate();
    const [openPopup,setOpenPopup] = useState(false);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone;

    const columns = [
        {
            accessorKey: 'gradeLevel.gradeLevel',
            header: 'Grade Level',
        },
        {
            accessorKey: 'strand.strand',
            header: 'Strand',
        },
        {
            accessorKey: 'feeCode.feeCode',
            header: 'Fee Code',
        },
        {
            accessorKey: 'feeDescription.feeDescription',
            header: 'Fee Description',
        },
        {
            accessorKey: 'feeCategory.feeCategory',
            header: 'Fee Category',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
        }
    ];

    const recordsWithoutInputter = records?.map(record => ({
        ...record,
        gradeLevel: {
            gradeLevel: record?.gradeLevelId?.gradeLevel
        },
        strand: {
            strand: record?.strandId?.strand
        },
        feeCode: {
            feeCode: record?.feeDescription?.code
        },
        feeDescription: {
            feeDescription: record?.feeDescription?.description
        },
        feeCategory: {
            feeCategory: record?.feeDescription?.feeCateg?.code
        },
        amount: record?.amount
    }));

    const deleteManagedFees = async (id) => {
        try {
            const removeManageFee = await axios.put(`${baseUrl()}/manage-fee/${id}`, { role, recordStatus: 'Deleted' });
            toast.success(removeManageFee.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                onClose: setTimeout(() => {
                    navigate(-1);
                }, 2000)
            });

            
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    }

    const automateFees = async (isReset) => {
        const toastId = toast.loading("Generating fees, please do not leave the page...");

        try {
            const { data } = await axios.post(`${baseUrl()}/automate-fees`,{ session,isReset,inputter: currentUserId });
            toast.update(toastId, {
                render: data.mssg,
                type: "success",
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (err) {
            console.log(err);
            toast.update(toastId, {
                render: "An error occurred while generating fees",
                type: "error",
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            
        }
    }

    const goToEdit = id => navigate(`/${genericPath}/edit-manage-fee/${id}`);

    return (
        <main className="p-2 relative">
            <div className="flex justify-between bg-white p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Fees</h1>
                    <Searchbar onSearch={setSearchQuery} />
                </div>
                <div className="flex items-center gap-2">
                    { recordsWithoutInputter.length < 1 ? 
                    <button disabled={(isYearDone && !isLoading) ? true : false} onClick={() => automateFees(false)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-blue-500 text-gray-100 p-2 rounded-md hover:bg-blue-600`}>
                        Generate Fees
                    </button>
                    :
                    <button disabled={(isYearDone && !isLoading) ? true : false} onClick={() => setOpenPopup(true)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-blue-500 text-gray-100 p-2 rounded-md hover:bg-blue-600`}>
                        Re-generate Fees
                    </button>
                    }
                    <ManageFeeBtn />
                </div>
            </div>

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    data={recordsWithoutInputter}
                    columns={columns}
                    onDelete={deleteManagedFees}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div>
            <ToastContainer />
             {/* Popup goes here */}
             {openPopup &&
                <ConfirmationPopup
                    message={'Are you sure you want to regenerate fees? This will affect fees generated in the system'}
                    onConfirm={() => automateFees(true)}
                    onClose={() => setOpenPopup(false)}
                />}
        </main>
    )
}

export default ManageFees;
