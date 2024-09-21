import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from "react";
import { MainContext } from "../../helpers/MainContext";
import MasterTable from "../../components/MasterTable";
import TabActions from "../../components/TabActions";
import PaymentModal from "./PaymentModal";

const FinanceAccountPayment = () => {
  const { currentUserId, searchQuery, numberFormatter } = useContext(MainContext);

  const { records } = useFetch(`${baseUrl()}/finance-account-payment/${currentUserId}`);

  const [isStudentPaymentModalVisible, setIsStudentPaymentModalVisible] = useState(false);
  const [studentPayments, setStudentPayments] = useState([]);
  const [currentStudentName, setCurrentStudentName] = useState("");
  const [currentStudent,setCurrentStudent] = useState({});
  const [totalPayment, setTotalPayment] = useState(0);

  const [otherFees, setOtherFees] = useState(0); // Track the current value of Other Fees
  
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

  

  // Handle student payment modal visibility and data loading
  const handleStudentPayments = (student) => {
    const studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;
    const payments = records?.studentPayments?.filter((sp) => sp.studentId === student._id);

    setCurrentStudentName(studentName);
    setStudentPayments(payments || []);
    setTotalPayment(0); // Reset total payment for new student
    setIsStudentPaymentModalVisible(true);
    setCurrentStudent(student);
  };

  // Setting amounts after the viewStudentPayments has been clicked
  const totalBookAmount = studentPayments?.filter(studentPayment => studentPayment.textBookId && !studentPayment.isPaid).reduce((total,payment) => total + payment.textBookId.bookAmount,0);
  const totalMiscAmount = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC' && !studentPayment.isPaid).reduce((total,payment) => total + payment.manageFeeId.amount,0)
  const totalTuitionFeeAmount = studentPayments?.filter(studentPayment => studentPayment?.paymentScheduleId && !studentPayment.isPaid).reduce((total,payment) => total + payment?.payEveryAmount,0);

  // Student table actions
  const actions = (student) => (
    <button
      onClick={() => handleStudentPayments(student)}
      className="bg-blue-500 hover:bg-blue-600 rounded-md p-2 text-white w-full"
    >
      Pay Now
    </button>
  );

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
        <>
        <button>Clear Selection</button>
        <PaymentModal 
          totalBookAmount={totalBookAmount}
          totalMiscAmount={totalMiscAmount}
          totalTuitionFeeAmount={totalTuitionFeeAmount}
          currentStudentName={currentStudentName}
          setIsStudentPaymentModalVisible={setIsStudentPaymentModalVisible}
          searchQuery={searchQuery}
          studentPayments={studentPayments}
          currentStudent={currentStudent}
        />
        </>
      )}
    </main>
  );
};

export default FinanceAccountPayment;



