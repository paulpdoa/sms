import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import Warning from '../../components/Warning';

const FinancePaymentSchedule = () => {

    const { currentUserId, searchQuery } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/finance-payment-schedule/${currentUserId}`);
    const [showStudentPayments, setShowStudentPayments] = useState(false);

    const [studentPayments, setStudentPayments] = useState([]);
    const [studentViewed, setStudentViewed] = useState('');

    const [currentSelectedButton, setCurrentSelectedButton] = useState('');

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

    // For Tuition Fee
    const paymentScheduleColumns = [
        { accessorKey: 'paymentDate', header: 'Payment Date' },
        { accessorKey: 'payEveryAmount', header: 'Amount Payable' },
        { accessorKey: 'isPaid', header: 'Paid' }
    ];
    const paymentScheduleData = studentPayments?.filter(studentPayment => studentPayment.paymentScheduleId)?.map(paymentSchedule => ({
        ...paymentSchedule,
        paymentDate: new Date(paymentSchedule?.paymentScheduleId?.dateSchedule).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        isPaid: paymentSchedule?.isPaid ? 'Yes' : 'No'
    }));
    
    // For Textbooks
    const textbookColumns = [
        { accessorKey: 'textBookId.bookTitle', header: 'Book Title' },
        { accessorKey: 'textBookId.bookCode', header: 'Book Code' },
        { accessorKey: 'textBookId.bookAmount', header: 'Book Amount' },
        { accessorKey: 'isPaid', header: 'Paid' }
    ];
    const textbookData = studentPayments?.filter(studentPayment => studentPayment.textBookId)?.map(textbook => ({
        ...textbook,
        isPaid: textbook.isPaid ? 'Yes' : 'No'
    }));

    // For Total Fees
    const feeColumns = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'feeCode', header: 'Fee Code' },
        { accessorKey: 'feeCategory', header: 'Fee Category' },
        { accessorKey: 'manageFeeId.amount', header: 'Amount' },
        { accessorKey: 'isPaid', header: 'Paid' }
        
    ];
    const feeData = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC')?.map(fee => ({
        ...fee,
        description: fee.manageFeeId.feeDescription.description,
        feeCode: fee.manageFeeId.feeDescription.code,
        feeCategory: fee.manageFeeId.feeDescription.feeCateg.category,
        isPaid: fee?.isPaid ? 'Yes' : 'No'
    }));

    const viewStudentPayments = (studentRecord) => {
        const studentId = studentRecord?._id;

        // Current name of student being viewed
        setStudentViewed(`${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`);
        setShowStudentPayments(true); // Show student payment modal
        setStudentPayments(records?.studentPayments?.filter(student => student.studentId === studentId));
    };


    // Setting amounts after the viewStudentPayments has been clicked
    const totalBookAmount = studentPayments?.filter(studentPayment => studentPayment.textBookId).reduce((total,payment) => total + payment.textBookId.bookAmount,0);
    const totalMiscAmount = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC').reduce((total,payment) => total + payment.manageFeeId.amount,0)
    const totalTuitionFeeAmount = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'TF').reduce((total,payment) => total + payment.manageFeeId.amount,0);

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
                        {currentSelectedButton === '' && (
                            <Warning message={'Please select a card to view payment details'} />
                        )}
                        <div className="border-b border-gray-300 py-2 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-700 text-2xl">{studentViewed}</h2>
                                <p className="text-gray-500">Statement Of Account</p>
                            </div>

                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                                onClick={() => {
                                    setShowStudentPayments(false)
                                    setCurrentSelectedButton('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div onClick={() => setCurrentSelectedButton('Book Amount')} className="bg-gray-100 p-4 rounded-md shadow-md transition cursor-pointer hover:-translate-y-1">
                                    <h2 className="text-sm font-semibold text-gray-700">Remaining Book Amount</h2>
                                    <p className="text-2xl font-bold text-blue-600">Php. {totalBookAmount.toFixed(2)}</p>
                                </div>

                                <div onClick={() => setCurrentSelectedButton('Miscellaneous Amount')} className="bg-gray-100 p-4 rounded-md shadow-md transition cursor-pointer hover:-translate-y-1">
                                    <h2 className="text-sm font-semibold text-gray-700">Remaining Miscellaneous Amount</h2>
                                    <p className="text-2xl font-bold text-blue-600">Php. { totalMiscAmount.toFixed(2) }</p>
                                </div>

                                <div onClick={() => setCurrentSelectedButton('Tuition Fee Amount')} className="bg-gray-100 p-4 rounded-md shadow-md transition cursor-pointer hover:-translate-y-1">
                                    <h2 className="text-sm font-semibold text-gray-700">Remaining Tuition Fee Amount</h2>
                                    <p className="text-2xl font-bold text-blue-600">Php. { totalTuitionFeeAmount.toFixed(2) }</p>
                                </div>
                            </div>
                            
                            {/* Modal will open upon hover */}
                            {/* For textbooks */}
                            { currentSelectedButton === 'Book Amount'&& (
                                <div className="bg-white p-4 z-50 rounded-md transition-all ease-in-out duration-300">
                                    <TabActions title="Remaining Book Amount" noView={true} />
                                    <MasterTable
                                        columns={textbookColumns}
                                        data={textbookData || []}
                                        searchQuery={searchQuery}
                                        disableAction={true}
                                    />
                                    <p className="text-2xl font-bold text-blue-600 mt-5">
                                        <span className="text-gray-800">Total Amount: </span><span className="text-xl">Php. {totalBookAmount.toFixed(2)}</span>
                                    </p>
                                </div>
                            ) }

                             {/* For Tuition Fees */}
                             {currentSelectedButton === 'Tuition Fee Amount' && (
                                <div className="bg-white p-4 z-50 rounded-md transition-all ease-in-out duration-300">
                                    <TabActions title="Remaining Tuition Fee Amount" noView={true} />
                                    <MasterTable
                                        columns={paymentScheduleColumns}
                                        data={paymentScheduleData || []}
                                        searchQuery={searchQuery}
                                        disableAction={true}
                                    />
                                    <p className="text-2xl font-bold text-blue-600 mt-5">
                                    <span className="text-gray-800">Total Amount: </span><span className="text-xl">Php. {totalTuitionFeeAmount.toFixed(2)}</span>
                                    </p>
                                </div>
                             )}

                             {currentSelectedButton === 'Miscellaneous Amount' && (
                             <div className="bg-white p-4 z-50 rounded-md transition-all ease-in-out duration-300">
                                <TabActions title="Remaining Miscellaneous Amount" noView={true} />
                                <MasterTable
                                    columns={feeColumns}
                                    data={feeData || []}
                                    searchQuery={searchQuery}
                                    disableAction={true}
                                />
                                <div className="mt-4 text-right font-bold text-xl text-blue-600">
                                    <span className="text-gray-800">Total Amount: </span>Php. {totalMiscAmount.toFixed(2)}
                                </div>
                             </div>
                             )}

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default FinancePaymentSchedule;