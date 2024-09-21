import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import Warning from '../../components/Warning';
import { jsPDF } from "jspdf";
import { useSnackbar } from "notistack";

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

    const paymentHistoryData = paymentTransactions?.map(paymentHistory => ({
        ...paymentHistory,
        paymentDate: new Date(paymentHistory.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        }),

    }));
    const paymentColumns = [
        { accessorKey: 'referenceCode', header: 'Reference Code' },
        { accessorKey: 'amountPaid', header: 'Amount Paid' },
        { accessorKey: 'paymentDate', header: 'Payment Date' }
    ];

    console.log(paymentHistoryData);

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
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                <TabActions title="Payment History" noView={true} />
                <MasterTable
                    columns={columns}
                    data={studentData || []}
                    searchQuery={searchQuery}
                    viewRecord={viewPaymentHistory}
                />
            </section>

            { showHistoryPayment && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md w-[80%] relative p-6 overflow-y-auto h-[90%] min-h-fit">
                        <div className="border-b border-gray-300 py-2 flex items-center justify-between">
                            <div>
                                <div className="flex gap-2 items-center">
                                    <h2 className="font-bold text-gray-700 text-2xl">{currentStudent.firstName} {currentStudent.middleName} {currentStudent.lastName}</h2>
                                    <div className="flex items-center gap-2">
                                        <p className="p-2 rounded-full bg-blue-500 text-gray-100 text-xs">StudNo. { currentStudent.studentNo }</p>
                                        <p className="p-2 rounded-full bg-blue-500 text-gray-100 text-xs">{ currentStudent.academicId.gradeLevelId.gradeLevel }</p>
                                        <p className="p-2 rounded-full bg-blue-500 text-gray-100 text-xs">Section: { currentStudent.academicId.sectionId.section }</p>
                                    </div>
                                </div>
                                <p className="text-gray-500">Payment History</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                                    onClick={() => setShowHistoryPayment(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>


                        {/* Show Table Here */}
                        <MasterTable 
                            columns={paymentColumns}
                            data={paymentHistoryData}
                            searchQuery={searchQuery}
                            disableAction={true}
                            disableCountList={true}
                        />

                    </div>
                
                </div>
            ) }
        
        </main>
    )
}

export default PaymentHistoryTransaction;