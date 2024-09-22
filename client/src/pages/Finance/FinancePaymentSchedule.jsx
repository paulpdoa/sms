import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import Warning from '../../components/Warning';
import { jsPDF } from "jspdf";
import { useSnackbar } from "notistack";
import html2canvas from "html2canvas";
import StatementOfAccountForm from "./StatementOfAccountForm";

const FinancePaymentSchedule = () => {

    const { currentUserId, searchQuery, numberFormatter } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const { records } = useFetch(`${baseUrl()}/finance-payment-schedule/${currentUserId}`);
    const [showStudentPayments, setShowStudentPayments] = useState(false);

    const [studentPayments, setStudentPayments] = useState([]);
    const [studentViewed, setStudentViewed] = useState('');
    const [currentStudent,setCurrentStudent] = useState({});

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
        payEveryAmount: numberFormatter(paymentSchedule.payEveryAmount),
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
        { accessorKey: 'bookAmount', header: 'Book Amount' },
        { accessorKey: 'isPaid', header: 'Paid' }
    ];
    const textbookData = studentPayments?.filter(studentPayment => studentPayment.textBookId)?.map(textbook => ({
        ...textbook,
        bookAmount: numberFormatter(textbook.textBookId.bookAmount),
        isPaid: textbook.isPaid ? 'Yes' : 'No'
    }));

    // For Total Fees
    const feeColumns = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'feeCode', header: 'Fee Code' },
        { accessorKey: 'feeCategory', header: 'Fee Category' },
        { accessorKey: 'amount', header: 'Amount' },
        { accessorKey: 'isPaid', header: 'Paid' }
        
    ];
    const feeData = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC')?.map(fee => ({
        ...fee,
        description: fee.manageFeeId.feeDescription.description,
        feeCode: fee.manageFeeId.feeDescription.code,
        feeCategory: fee.manageFeeId.feeDescription.feeCateg.category,
        isPaid: fee?.isPaid ? 'Yes' : 'No',
        amount: numberFormatter(fee.manageFeeId.amount)
    }));

    const viewStudentPayments = (studentRecord) => {
        const studentId = studentRecord?._id;

        // Current name of student being viewed
        setStudentViewed(`${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`);
        setShowStudentPayments(true); // Show student payment modal
        setStudentPayments(records?.studentPayments?.filter(student => student.studentId === studentId));
        setCurrentStudent(studentRecord)
    };

    // PDF Generation Function
    const generatePDF = async (e) => {
        e.preventDefault();

        const input = document.getElementById('student-payments-content');  // ID of the content you want to capture

        // Use html2canvas to capture the content
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');

        const doc = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;  // A4 width in mm
        const pageHeight = 295;  // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add the image data to the PDF
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if content overflows
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        doc.save(`${studentViewed}_Statement_Of_Account.pdf`);

        enqueueSnackbar('File has been successfully generated', { 
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            autoHideDuration: 2000,
            preventDuplicate: true
        });
    };

    // Setting amounts after the viewStudentPayments has been clicked
    const totalBookAmount = studentPayments?.filter(studentPayment => studentPayment.textBookId && !studentPayment.isPaid).reduce((total,payment) => total + payment.textBookId.bookAmount,0);
    const totalMiscAmount = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC' && !studentPayment.isPaid).reduce((total,payment) => total + payment.manageFeeId.amount,0)
    const totalTuitionFeeAmount = studentPayments?.filter(studentPayment => studentPayment?.paymentScheduleId && !studentPayment.isPaid).reduce((total,payment) => total + payment.payEveryAmount,0);

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                <TabActions title="Statement Of Accounts" noView={true} noSearch={true} />
                <MasterTable
                    columns={columns}
                    data={studentData || []}
                    searchQuery={searchQuery}
                    viewRecord={viewStudentPayments}
                />
            </section>

            {showStudentPayments && (
                <>
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md w-[80%] relative p-6 overflow-y-auto h-[90%] min-h-fit">
                        {/* {currentSelectedButton === '' && (
                            <Warning message={'Please select a card to view payment details'} />
                        )} */}
                        <div className="border-b border-gray-300 py-2 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-700 text-2xl">{studentViewed}</h2>
                                <p className="text-gray-500">Statement Of Account</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                                    onClick={generatePDF}
                                >
                                    Download as PDF
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                                    onClick={() => {
                                        setShowStudentPayments(false)
                                        setCurrentSelectedButton('');
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div onClick={() => setCurrentSelectedButton('Book Amount')} className="bg-gray-100 p-4 rounded-md shadow-md transition cursor-pointer hover:-translate-y-1">
                                    <h2 className="text-sm font-semibold text-gray-700">Textbooks</h2>
                                    <p className="text-2xl font-bold text-blue-600">Php {numberFormatter(totalBookAmount)}</p>
                                </div>

                                <div onClick={() => setCurrentSelectedButton('Miscellaneous Amount')} className="bg-gray-100 p-4 rounded-md shadow-md transition cursor-pointer hover:-translate-y-1">
                                    <h2 className="text-sm font-semibold text-gray-700">Miscellaneous</h2>
                                    <p className="text-2xl font-bold text-blue-600">Php { numberFormatter(totalMiscAmount) }</p>
                                </div>

                                <div onClick={() => setCurrentSelectedButton('Tuition Fee Amount')} className="bg-gray-100 p-4 rounded-md shadow-md transition cursor-pointer hover:-translate-y-1">
                                    <h2 className="text-sm font-semibold text-gray-700">Tuition</h2>
                                    <p className="text-2xl font-bold text-blue-600">Php { numberFormatter(totalTuitionFeeAmount) }</p>
                                </div>
                            </div>
                            
                            {/* Modal will open upon hover */}
                            {/* For textbooks */}
                            {/* { currentSelectedButton === 'Book Amount'&& (
                                <div className="bg-white p-4 z-50 rounded-md transition-all ease-in-out duration-300 relative">
                                    <TabActions title="Textbooks" noView={true} />
                                    <MasterTable
                                        columns={textbookColumns}
                                        data={textbookData || []}
                                        searchQuery={searchQuery}
                                        disableAction={true}
                                    />
                                    <div className="mt-4 text-left font-bold text-xl text-blue-600">
                                        <span className="text-gray-800">Total Amount: </span><span className="text-xl">Php {numberFormatter(totalBookAmount)}</span>
                                    </div>
                                    <button className="absolute top-10 right-5 bg-red-500 p-2 rounded-md text-gray-100 text-sm" onClick={() => setCurrentSelectedButton('')}>Close</button>
                                </div>
                            ) } */}

                             {/* For Tuition Fees */}
                             {/* {currentSelectedButton === 'Tuition Fee Amount' && (
                                <div className="bg-white p-4 z-50 rounded-md transition-all ease-in-out duration-300 relative">
                                    <TabActions title="Tuition" noView={true} />
                                    <MasterTable
                                        columns={paymentScheduleColumns}
                                        data={paymentScheduleData || []}
                                        searchQuery={searchQuery}
                                        disableAction={true}
                                    />
                                    <div className="mt-4 text-left font-bold text-xl text-blue-600">
                                        <span className="text-gray-800">Total Amount: </span><span className="text-xl">Php {numberFormatter(totalTuitionFeeAmount)}</span>
                                    </div>
                                    <button className="absolute top-10 right-5 bg-red-500 p-2 rounded-md text-gray-100 text-sm" onClick={() => setCurrentSelectedButton('')}>Close</button>
                                </div>
                             )} */}

                             {/* {currentSelectedButton === 'Miscellaneous Amount' && (
                             <div className="bg-white p-4 z-50 rounded-md transition-all ease-in-out duration-300 relative">
                                <TabActions title="Miscellaneous" noView={true} />
                                <MasterTable
                                    columns={feeColumns}
                                    data={feeData || []}
                                    searchQuery={searchQuery}
                                    disableAction={true}
                                />
                                <div className="mt-4 text-left font-bold text-xl text-blue-600">
                                    <span className="text-gray-800">Total Amount: </span>Php {numberFormatter(totalMiscAmount)}
                                </div>

                                <button className="absolute top-10 right-5 bg-red-500 p-2 rounded-md text-gray-100 text-sm" onClick={() => setCurrentSelectedButton('')}>Close</button>
                             </div>
                             )} */}
                            {/* Show statement of account form */}
                            <StatementOfAccountForm 
                                studentPayments={studentPayments}
                                currentStudent={currentStudent}
                            />
                        </div>
                    </div>
                </div>
                
                </>
            )}


            
        </main>
    );
};

export default FinancePaymentSchedule;