import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from "react";
import { MainContext } from "../../helpers/MainContext";
import MasterTable from "../../components/MasterTable";
import TabActions from "../../components/TabActions";
import PaymentModal from "./PaymentModal";

const FinanceAccountPayment = () => {
  const { currentUserId, searchQuery } = useContext(MainContext);

  const { records } = useFetch(`${baseUrl()}/finance-account-payment/${currentUserId}`);

  const [isStudentPaymentModalVisible, setIsStudentPaymentModalVisible] = useState(false);
  const [studentPayments, setStudentPayments] = useState([]);
  const [currentStudentName, setCurrentStudentName] = useState("");
  const [totalPayment, setTotalPayment] = useState(0);

  const [otherFees, setOtherFees] = useState(0); // Track the current value of Other Fees

  // For current selection of checkbox for payments
  const [currentPaymentScreen,setCurrentPaymentScreen] = useState([]);
  const handlePaymentScreenChange = (screen) => {
    setCurrentPaymentScreen((prev) => {
      if (prev.includes(screen)) {
        // If the screen already exists, remove it
        return prev.filter((s) => s !== screen);
      } else {
        // If the screen doesn't exist, add it
        return [...prev, screen];
      }
    });
  }

// Handle changes to Other Fees input
const handleOtherFeesChange = (e) => {
    const newValue = parseFloat(e.target.value) || 0; // Parse the new input value or set it to 0
    setTotalPayment((prev) => prev - otherFees + newValue); // Subtract the old value and add the new one
    setOtherFees(newValue); // Update the state with the new value
};

  // Student Table Columns
  const studentColumns = [
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "gradeLevel", header: "Grade Level" },
    { accessorKey: "email", header: "Email" },
  ];

  // Mapping student data for display
  const studentData = records?.students
    ?.map((student) => ({
      ...student,
      fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
      gradeLevel: `${student?.academicId?.gradeLevelId?.gradeLevel}`,
    }))
    .sort((a, b) => a.lastName.localeCompare(b.lastName));

  // Payment Schedule Columns
  const paymentScheduleColumns = [
    { accessorKey: "pay", header: "Pay" },
    { accessorKey: "paymentDate", header: "Payment Date" },
    { accessorKey: "payEveryAmount", header: "Amount Payable" },
    { accessorKey: 'isPaid', header: 'Paid' }
  ];
  // Textbook columns
  const textbookColumn = [
    { accessorKey: "pay", header: "Pay" },
    { accessorKey: 'textBookId.bookTitle', header: 'Book Title' },
    { accessorKey: 'textBookId.bookCode', header: 'Book Code' },
    { accessorKey: 'textBookId.bookAmount', header: 'Book Amount' },
    { accessorKey: 'isPaid', header: 'Paid' }
  ];
  // Miscellaneous column
  const miscellaneousColumn = [
    { accessorKey: 'pay', header: 'Pay' },
    { accessorKey: 'description', header: 'Description'},
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'isPaid', header: 'Paid' }
  ]

  const miscellaneousData = studentPayments
    ?.filter(payment => payment.manageFeeId?.feeDescription?.code === 'MSC')
    ?.map(payment => ({
      ...payment,
      description: payment.manageFeeId.feeDescription.description,
      code: payment.manageFeeId.feeDescription.code,
      amount: payment.manageFeeId.amount,
      isPaid: payment.isPaid ? 'Yes' : 'No',
      pay: (
        <input
          disabled={payment.isPaid ? true : false}
          type="checkbox"
          onChange={(e) => {
            const amount = payment.payEveryAmount;
            console.log(payment);
            if (e.target.checked) {
              setTotalPayment((prev) => prev + amount);
            } else {
              setTotalPayment((prev) => prev - amount);
            }
          }}
        />
      ),
    }))
  
  const textbookData = studentPayments
    ?.filter(payment => payment.textBookId)
    ?.map(payment => ({
      ...payment,
      pay: (
        <input
          disabled={payment.isPaid ? true : false}
          type="checkbox"
          onChange={(e) => {
            const amount = payment.payEveryAmount;
            console.log(payment);
            if (e.target.checked) {
              setTotalPayment((prev) => prev + amount);
            } else {
              setTotalPayment((prev) => prev - amount);
            }
          }}
        />
      ),
      isPaid: payment.isPaid ? 'Yes' : 'No'
    }))

  // Mapping payment schedules
  const paymentScheduleData = studentPayments
    ?.filter((payment) => payment.paymentScheduleId)
    ?.map((payment) => ({
      ...payment,
      pay: (
        <input
          type="checkbox"
          disabled={payment.isPaid ? true : false}
          onChange={(e) => {
            const amount = payment.payEveryAmount;
            console.log(payment);
            if (e.target.checked) {
              setTotalPayment((prev) => prev + amount);
            } else {
              setTotalPayment((prev) => prev - amount);
            }
          }}
        />
      ),
      paymentDate: new Date(payment.paymentScheduleId.dateSchedule).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isPaid: payment.isPaid ? 'Yes' : 'No'
    }));


  // Handle student payment modal visibility and data loading
  const handleStudentPayments = (student) => {
    const studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;
    const payments = records?.studentPayments?.filter((sp) => sp.studentId === student._id);

    setCurrentStudentName(studentName);
    setStudentPayments(payments || []);
    setTotalPayment(0); // Reset total payment for new student
    setIsStudentPaymentModalVisible(true);
  };

  // Setting amounts after the viewStudentPayments has been clicked
  const totalBookAmount = studentPayments?.filter(studentPayment => studentPayment.textBookId).reduce((total,payment) => total + payment.textBookId.bookAmount,0);
  const totalMiscAmount = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.code === 'MSC').reduce((total,payment) => total + payment.manageFeeId.amount,0)
  const totalTuitionFeeAmount = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.code === 'TUF').reduce((total,payment) => total + payment.manageFeeId.amount,0);

  // Student table actions
  const actions = (student) => (
    <button
      onClick={() => handleStudentPayments(student)}
      className="bg-blue-500 hover:bg-blue-600 rounded-md p-2 text-white w-full"
    >
      Pay Now
    </button>
  );


  const postPayment = async (e) => {
    e.preventDefault();

    try {

    } catch(err) {
        console.log(err);
    }
  }



  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center">
      <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
      </header>

      <section className="w-full px-4 mt-5">
        <TabActions title="Account Payments" noView={true} />
        <MasterTable columns={studentColumns} data={studentData || []} searchQuery={searchQuery} actions={actions} />
      </section>
      {/* Students Payment Modal */}
      { isStudentPaymentModalVisible && (
        <PaymentModal 
          totalBookAmount={totalBookAmount}
          totalMiscAmount={totalMiscAmount}
          totalTuitionFeeAmount={totalTuitionFeeAmount}
          currentStudentName={currentStudentName}
          setIsStudentPaymentModalVisible={setIsStudentPaymentModalVisible}
          handlePaymentScreenChange={handlePaymentScreenChange}
          currentPaymentScreen={currentPaymentScreen}
          paymentScheduleColumns={paymentScheduleColumns}
          paymentScheduleData={paymentScheduleData}
          textbookColumn={textbookColumn}
          textbookData={textbookData}
          miscellaneousColumn={miscellaneousColumn}
          miscellaneousData={miscellaneousData}
          searchQuery={searchQuery}
        />
      )}
    </main>
  );
};

export default FinanceAccountPayment;



