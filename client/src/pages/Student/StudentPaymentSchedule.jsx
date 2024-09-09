import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState, useEffect } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const StudentPaymentSchedule = () => {
    const { currentUserId,searchQuery } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/student-payment-schedule/${currentUserId}`);

    const [showPayments,setShowPayments] = useState(false);
    
    const paymentColumns = [
        { accessorKey: 'paymentDate', header: 'Payment Date' },
        { accessorKey: 'payEveryAmount', header: 'Amount Payable' },
        // { accessorKey: 'section', header: 'Section' },   
    ]

    const paymentData = records?.studentPayments?.map(studentPayment => ({
        ...studentPayment,
        paymentDate: new Date(studentPayment.paymentScheduleId.dateSchedule).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }));

    const viewMyPaymentSchedule = (record) => {
        console.log(record);
        console.log('records', records);
        setShowPayments(true);
    }

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center relative">
            <header className="w-full bg-white shadow-md py-6 px-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.studentName}!</h1>
            </header>
            <section className="w-full px-4 mt-5">
                {/* <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Grades List</h2> */}
                <TabActions title="Your Payment Schedules" noView={true} />
                <MasterTable 
                    columns={paymentColumns}
                    data={paymentData ?? []}
                    searchQuery={searchQuery}
                    disableAction={true}
                    // viewRecord={viewMyPaymentSchedule}
                />
            </section>


            {/* Modal for payments of student */}
            {/* <div>

            </div> */}
        </main>
    )
}

export default StudentPaymentSchedule;