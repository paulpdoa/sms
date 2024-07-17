import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import ReusableTable from "../../components/ReusableTable";
import { MainContext } from '../../helpers/MainContext';
import ConfirmationPopup from "../../components/ConfirmationPopup";
import MasterTable from "../../components/MasterTable";

const columns = [
    { accessorKey: 'paymentTermId.term', header: 'Payment Term' },
    { accessorKey: 'dateSchedule', header: 'Payment Schedule' }
];

const PaymentSchedule = () => {

    const { records,isLoading: loading } = useFetch(`${baseUrl()}/payment-schedules`);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    const { session: schoolYearId, role } = useContext(MainContext);

    const generatePaymentSchedule = async (isReset) => {
        setIsLoading(true);
        const toastId = toast.loading('Creating payment schedule, please wait...');

        try {
            const { data } = await axios.post(`${baseUrl()}/payment-schedule`, { schoolYearId, role, isReset });
            setIsLoading(false);
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
            }, 2000);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            toast.update(toastId, {
                render: "An error occurred while generating payment schedules",
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
    };

    return (
        <main className="p-2">
            <div className="flex flex-col mx-4 my-2 gap-2">
                <h1 className="text-2xl text-green-600 font-bold">Payment Schedule</h1>
                <div className="flex items- w-full justify-between gap-2">
                    <Searchbar onSearch={setSearchQuery} />

                    {records.length < 1 ?
                        <button onClick={() => generatePaymentSchedule(false)} className="items-end text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-md">
                            {isLoading ? 'Loading...' : 'Generate Payment Schedule'}
                        </button>
                        :
                        // If the user tried to re-generate payment schedule, create a function where it will delete the contents of PaymentSchedule table and generate new schedule
                        <button onClick={() => setOpenPopup(true)} className="items-end text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-md">
                            {isLoading ? 'Loading...' : 'Re-generate Payment Schedule'}
                        </button>
                    }
                </div>
            </div>

            <div className="mt-5">
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={records}
                        searchQuery={searchQuery}
                        disableAction={true}
                        isLoading={loading}
                    />
                </div>
            </div>
            <ToastContainer />


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
