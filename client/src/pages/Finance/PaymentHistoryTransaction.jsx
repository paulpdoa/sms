import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import PaymentHistoryModal from "./PaymentHistoryModal";

const PaymentHistoryTransaction = () => {

    const { currentUserId,searchQuery } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/finance-payment-history/${currentUserId}`);

    // For modal of payment history
    const [showHistoryPayment,setShowHistoryPayment] = useState(false);
    // For storing payment history per student
    const [paymentTransactions,setPaymentTransactions] = useState([]);
    // for current student being viewed
    const [currentStudent,setCurrentStudent] = useState({});

    const studentData = records?.students?.map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        gradeLevel: `${student?.academicId?.gradeLevelId?.gradeLevel}`
    })).sort((a, b) => a.lastName.localeCompare(b.lastName));
    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'email', header: 'Email' }
    ];

    const viewPaymentHistory = (student) => {
        const filteredPaymentHistory = records?.paymentTransactions?.filter(paymentTransaction => paymentTransaction?.studentId?._id === student._id);

        // Set the paymentTransactions per student
        setPaymentTransactions(filteredPaymentHistory);

        // Open the modal after clicking view
        setShowHistoryPayment(true)

        // Set current student being viewed
        setCurrentStudent(student);
    }

    return (
        <main className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center rounded-lg mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                <TabActions title="Payment History" noView={true} noSearch={true} />
                <MasterTable
                    columns={columns}
                    data={studentData || []}
                    searchQuery={searchQuery}
                    viewRecord={viewPaymentHistory}
                />
            </section>

            {/* Show This modal after clicking view */}
            { showHistoryPayment && (
                <PaymentHistoryModal 
                    currentStudent={currentStudent}
                    setShowHistoryPayment={setShowHistoryPayment}
                    paymentTransactions={paymentTransactions}
                />
            ) }
        
        </main>
    )
}

export default PaymentHistoryTransaction;