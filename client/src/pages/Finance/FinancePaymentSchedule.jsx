import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";

const FinancePaymentSchedule = () => {

    const { currentUserId, searchQuery } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/finance-payment-schedule/${currentUserId}`);
    const [showStudentPayments, setShowStudentPayments] = useState(false);

    const [studentPayments, setStudentPayments] = useState([]);
    const [studentViewed, setStudentViewed] = useState('');

    const studentViewButtons = ['Payment Schedules', 'Textbooks', 'Total Fees'];
    const [currentSelectedButton, setCurrentSelectedButton] = useState('Payment Schedules');

    // Columns for Student List
    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'email', header: 'Email' }
    ];
    const studentData = records?.students?.map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        gradeLevel: `${student?.academicId?.gradeLevelId?.gradeLevel}`
    })).sort((a, b) => a.lastName.localeCompare(b.lastName));

    // For Payment Schedules
    const paymentScheduleColumns = [
        { accessorKey: 'paymentDate', header: 'Payment Date' },
        { accessorKey: 'payEveryAmount', header: 'Amount Payable' },
    ];
    const paymentScheduleData = studentPayments?.filter(studentPayment => studentPayment.paymentScheduleId)?.map(paymentSchedule => ({
        ...paymentSchedule,
        paymentDate: new Date(paymentSchedule?.paymentScheduleId?.dateSchedule).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) 
    }));

    const totalPaymentScheduleAmount = paymentScheduleData?.reduce((total, payment) => total + payment.payEveryAmount, 0);

    // For Textbooks
    const textbookColumns = [
        { accessorKey: 'textBookId.bookTitle', header: 'Book Title' },
        { accessorKey: 'textBookId.bookCode', header: 'Book Code' },
        { accessorKey: 'textBookId.bookAmount', header: 'Book Amount' }
    ];
    const textbookData = studentPayments?.filter(studentPayment => studentPayment.textBookId)?.map(textbook => ({
        ...textbook,
    }));

    const totalTextbookAmount = textbookData?.reduce((total, textbook) => total + textbook.textBookId.bookAmount, 0);

    // For Total Fees
    const feeColumns = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'feeCode', header: 'Fee Code' },
        { accessorKey: 'feeCategory', header: 'Fee Category' },
        { accessorKey: 'manageFeeId.amount', header: 'Amount' }
    ];
    const feeData = studentPayments?.filter(studentPayment => studentPayment.manageFeeId)?.map(fee => ({
        ...fee,
        description: fee.manageFeeId.feeDescription.description,
        feeCode: fee.manageFeeId.feeDescription.code,
        feeCategory: fee.manageFeeId.feeDescription.feeCateg.category
    }));

    const totalFeeAmount = feeData?.reduce((total, fee) => total + fee.manageFeeId.amount, 0);

    const viewStudentPayments = (studentRecord) => {
        const studentId = studentRecord?._id;

        // Current name of student being viewed
        setStudentViewed(`${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`);

        setShowStudentPayments(true); // Show student payment modal
        setStudentPayments(records?.studentPayments?.filter(student => student.studentId === studentId));
    };

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                <TabActions title="Statement Of Accounts" noView={true} />
                <MasterTable
                    columns={columns}
                    data={studentData || []}
                    searchQuery={searchQuery}
                    viewRecord={viewStudentPayments}
                />
            </section>

            {showStudentPayments && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md w-[80%] relative p-6 overflow-y-auto h-[90%] min-h-fit">
                        <h2 className="font-bold text-gray-700 text-2xl">Payments of {studentViewed}</h2>

                        {/* Buttons for View Selection */}
                        <div className="my-3 flex gap-2 items-center">
                            {studentViewButtons.map((button, key) => (
                                <button
                                    onClick={() => setCurrentSelectedButton(button)}
                                    className={`${button === currentSelectedButton ? 'bg-blue-500 text-gray-100 hover:bg-blue-600' : 'border-blue-500 text-blue-500'} border p-2 rounded-md hover:bg-blue-600 hover:text-gray-100 transition text-sm`}
                                    key={key}
                                >
                                    {button}
                                </button>
                            ))}
                        </div>

                        {/* For Payment Schedules */}
                        {currentSelectedButton === 'Payment Schedules' && (
                            <>
                                <MasterTable
                                    columns={paymentScheduleColumns}
                                    data={paymentScheduleData || []}
                                    searchQuery={searchQuery}
                                    disableAction={true}
                                />
                                <div className="mt-4 text-right font-bold text-xl text-blue-600">
                                    <span className="text-gray-800">Total Amount: </span>Php. {totalPaymentScheduleAmount.toFixed(2)}
                                </div>
                            </>
                        )}

                        {/* For Textbooks */}
                        {currentSelectedButton === 'Textbooks' && (
                            <>
                                <MasterTable
                                    columns={textbookColumns}
                                    data={textbookData || []}
                                    searchQuery={searchQuery}
                                    disableAction={true}
                                />
                                <div className="mt-4 text-right font-bold text-xl text-blue-600">
                                    <span className="text-gray-800">Total Amount: </span>Php. {totalTextbookAmount.toFixed(2)}
                                </div>
                            </>
                        )}

                        {/* For Total Fees */}
                        {currentSelectedButton === 'Total Fees' && (
                            <>
                                <MasterTable
                                    columns={feeColumns}
                                    data={feeData || []}
                                    searchQuery={searchQuery}
                                    disableAction={true}
                                />
                                <div className="mt-4 text-right font-bold text-xl text-blue-600">
                                    <span className="text-gray-800">Total Amount: </span>Php. {totalFeeAmount.toFixed(2)}
                                </div>
                            </>
                        )}

                        <button
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowStudentPayments(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default FinancePaymentSchedule;
