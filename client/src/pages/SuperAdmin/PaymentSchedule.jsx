import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import ConfirmationPopup from "../../components/ConfirmationPopup";
import MasterTable from "../../components/MasterTable";
import { useSnackbar } from 'notistack';
import TabActions from "../../components/TabActions";

const PaymentSchedule = () => {

    const { records,isLoading: loading } = useFetch(`${baseUrl()}/payment-schedules`);
    const [isLoading, setIsLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    const { session, role,currentUserId,snackbarKey, dateFormatter,searchQuery} = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone;
    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

    const columns = [
        { accessorKey: 'paymentTermId.term', header: 'Payment Term' },
        { accessorKey: 'dateSchedule', header: 'Payment Schedule' }
    ];

    const scheduleData = records?.map(schedule => ({
        ...schedule,
        dateSchedule: dateFormatter(schedule.dateSchedule)
    }))

    const generatePaymentSchedule = async (isReset) => {
        setIsLoading(true);

        const loading = snackbarKey('Creating payment schedule, please wait...')

        try {
            const { data } = await axios.post(`${baseUrl()}/payment-schedule`, { session, role, isReset, currentUserId });
            setIsLoading(false);
            closeSnackbar(loading);
            enqueueSnackbar(data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload()
                }
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            closeSnackbar(snackbarKey());
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while generating payment schedules', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    return (
        <main className="p-2">
            <div className="flex justify-between items-center">
                <TabActions title="Payment Schedules" noView={true} />
                {records.length < 1 ?
                    <button onClick={() => !isYearDone && generatePaymentSchedule(false)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} items-end text-sm bg-customView hover:bg-customHighlight text-white p-2 rounded-md w-1/4`}>
                        {isLoading ? 'Loading...' : 'Generate Payment Schedule'}
                    </button>
                    :
                    // If the user tried to re-generate payment schedule, create a function where it will delete the contents of PaymentSchedule table and generate new schedule
                    <button onClick={() => !isYearDone && setOpenPopup(true)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} items-end text-sm bg-customView hover:bg-customHighlight text-white p-2 rounded-md w-1/4`}>
                        {isLoading ? 'Loading...' : 'Re-generate Payment Schedule'}
                    </button>
                }
            </div>

            <div className="mt-5">
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={scheduleData}
                        searchQuery={searchQuery}
                        disableAction={true}
                        isLoading={loading}
                    />
                </div>
            </div>
            {/* Popup goes here */}
            {openPopup &&
                <ConfirmationPopup
                    message={'Are you sure you want to regenerate payment schedule? This will affect students payments schedule'}
                    onConfirm={() => generatePaymentSchedule(true)}
                    onClose={() => setOpenPopup(false)}
                />}
        </main>
    );
}

export default PaymentSchedule;
