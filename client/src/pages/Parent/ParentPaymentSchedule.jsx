import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState, useEffect } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';

const ParentPaymentSchedule = () => {
    const { currentUserId,searchQuery,dateFormatter } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/parent-child-payment-schedule/${currentUserId}`);

    const [showPayments,setShowPayments] = useState(false);
    const [currentChild,setCurrentChild] = useState('');

    const paymentColumns = [
        { accessorKey: 'paymentDate', header: 'Payment Date' },
        { accessorKey: 'payEveryAmount', header: 'Amount Payable' },
        { accessorKey: 'paid', header: 'Paid' },   
    ];

    const paymentData = records?.studentPayments?.filter(student => student.studentId === currentChild)?.map(studentPayment => ({
        ...studentPayment,
        paymentDate: dateFormatter(studentPayment.paymentScheduleId.dateSchedule),
        paid: studentPayment.isPaid ? 'Paid' : 'Not yet paid'
    }));

    const viewMyPaymentSchedule = (record) => {
        console.log(record);
        console.log('records', records);
        setShowPayments(true);
    }

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center relative">
            <header className="w-full bg-white shadow-md py-6 px-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.parentName}!</h1>
                {/* <p className="text-sm text-gray-500">Parent of {records?.studentName}</p> */}
            </header>
            <section className="w-full px-4 mt-5">
                <h2 className="text-2xl font-bold text-gray-700 px-1 mb-2">Select Child to View Payments</h2>
                <div className="flex gap-2 items-center justify-start">
                    { records?.students?.map(student => (
                        <button
                            key={student._id}
                            onClick={() => setCurrentChild(student._id)}
                            className={`p-2 text-sm rounded-md border transition-all duration-200 focus:ring focus:ring-blue-300
                                ${currentChild === student._id 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                    : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white'}`}
                        >
                            { student.firstName } { student.lastName } 
                        </button>
                    )) }
                </div>
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

export default ParentPaymentSchedule;