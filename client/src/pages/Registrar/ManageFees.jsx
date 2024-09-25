import { useContext,useState } from 'react';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationPopup from '../../components/ConfirmationPopup';
import { useSnackbar } from 'notistack';
import TabActions from '../../components/TabActions';

const ManageFees = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/manage-fees`);
    const { searchQuery, setSearchQuery,genericPath, role,session,currentUserId, snackbarKey } = useContext(MainContext);
    const navigate = useNavigate();
    const [openPopup,setOpenPopup] = useState(false);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone;
    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

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
            enqueueSnackbar(removeManageFee.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload();
                }
            });
            
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg, { 
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

    const automateFees = async (isReset) => {
        const loading = snackbarKey('Generating fees, please wait');

        try {

            const { data } = await axios.post(`${baseUrl()}/automate-fees`,{ session,isReset,inputter: currentUserId });
            closeSnackbar(loading);
            enqueueSnackbar(data.mssg, { 
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
            
        } catch (err) {
            console.log(err);
            closeSnackbar(snackbarKey())
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while generating fees', { 
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

    const goToEdit = id => navigate(`/${genericPath}/edit-manage-fee/${id}`);

    return (
        <main className="p-2 relative">
            <div className="flex items-center">
                <TabActions title="Manage Fees" redirect='create-fees' />
                { recordsWithoutInputter.length < 1 ? 
                    <button 
                        disabled={(isYearDone && !isLoading) ? true : false} 
                        onClick={() => automateFees(false)} 
                        className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-customView text-white p-2 rounded-md hover:bg-customHighlight text-sm w-44 justify-center`}
                    >
                        Generate Fees
                    </button>
                    :
                    <button 
                        disabled={(isYearDone && !isLoading) ? true : false} 
                        onClick={() => setOpenPopup(true)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-customView text-white p-2 rounded-md hover:bg-customHighlight text-sm w-44 justify-center`}
                    >
                        Re-generate Fees
                    </button> 
                }
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
            {/* Popup goes here */}
            { openPopup &&
                <ConfirmationPopup
                    message={'Are you sure you want to regenerate fees? This will affect fees generated in the system'}
                    onConfirm={() => automateFees(true)}
                    onClose={() => setOpenPopup(false)}
                />
            }
        </main>
    )
}

export default ManageFees;
