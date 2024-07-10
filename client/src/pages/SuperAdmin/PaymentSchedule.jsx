import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import ReusableTable from "../../components/ReusableTable";
import { MainContext } from '../../helpers/MainContext';

const columns = [
    { accessorKey: 'paymentTermId.term', header: 'Payment Term' },
    { accessorKey: 'dateSchedule', header: 'Payment Schedule'}
]

const PaymentSchedule = () => {

    const { records } = useFetch(`${baseUrl()}/payment-schedules`);
    const [searchQuery,setSearchQuery] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const { session: schoolYearId } = useContext(MainContext);

    const generatePaymentSchedule = async () => {
        const schoolYearId = localStorage.getItem('session');
        setIsLoading(true);

        try {
            const { data } = await axios.post(`${baseUrl()}/payment-schedule`,{ schoolYearId });
            setIsLoading(false);
            toast.success(data.mssg, {
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
           
            console.log(err);
        }
    }

    const regenPaymentSchedule = async () => {
        try {

        } catch(err) {
            console.log(err);
        }
    }

    

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Payment Schedule</h1>
                <div className="flex items-center gap-2">
                    <Searchbar onSearch={setSearchQuery} />

                    { records.length < 1 ? 
                        <button onClick={generatePaymentSchedule} className="items-end text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-md">
                            { isLoading ? 'Loading' : 'Generate Payment Schedule'}
                        </button>
                        :
                        // If the user tried to re-generate payment schedule, create a function where it will delete the contents of PaymentSchedule table and generate new schedule
                        <button onClick={regenPaymentSchedule} className="items-end text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-md">
                            { isLoading ? 'Loading' : 'Re-generate Payment Schedule'}
                        </button>
                    }
                </div>
            </div>

            <div className="mt-5">
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <ReusableTable 
                        records={records} 
                        columns={columns} 
                        searchQuery={searchQuery}
                        disableAction={true}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default PaymentSchedule