import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from "react";
import { MainContext } from "../../helpers/MainContext";
import MasterTable from "../../components/MasterTable";
import TabActions from "../../components/TabActions";

const FinanceAccountPayment = () => {
  const { currentUserId, searchQuery } = useContext(MainContext);

  const { records } = useFetch(`${baseUrl()}/finance-payment-schedule/${currentUserId}`);
  const [isStudentPaymentModalVisible, setIsStudentPaymentModalVisible] = useState(false);
  const [studentPayments, setStudentPayments] = useState([]);
  const [currentStudentName, setCurrentStudentName] = useState("");
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

  // Payment Schedule Columns
  const paymentScheduleColumns = [
    { accessorKey: "pay", header: "Pay" },
    { accessorKey: "paymentDate", header: "Payment Date" },
    { accessorKey: "payEveryAmount", header: "Amount Payable" },
  ];

  // Mapping payment schedules
  const paymentScheduleData = studentPayments
    ?.filter((payment) => payment.paymentScheduleId)
    ?.map((payment) => ({
      ...payment,
      pay: (
        <input
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
      paymentDate: new Date(payment.paymentScheduleId.dateSchedule).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
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

  // Student table actions
  const actions = (student) => (
    <button
      onClick={() => handleStudentPayments(student)}
      className="bg-blue-500 hover:bg-blue-600 rounded-md p-2 text-white w-full"
    >
      View Payments
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

      {/* Student Payments Modal */}
      {isStudentPaymentModalVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md w-[80%] relative p-6 overflow-y-auto h-[90%] min-h-fit">
            <h2 className="font-bold text-gray-700 text-2xl mb-4">Payments of {currentStudentName}</h2>

            <MasterTable
              columns={paymentScheduleColumns}
              data={paymentScheduleData || []}
              searchQuery={searchQuery}
              disableAction={true}
            />

            <div className="flex justify-between items-center mt-4">
              <label htmlFor="amountToPay" className="text-lg font-semibold">
                Total Amount to Pay: <span className="text-blue-600">Php. {totalPayment.toFixed(2)}</span>
              </label>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                Proceed to Payment
              </button>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="other fees">Other Fees:</label>
                <input 
                    onChange={handleOtherFeesChange}
                    className="p-1 outline-none focus:ring-2 focus:ring-blue-500 rounded-md border-gray-300 border"
                    type="number" 
                />
            </div>

            <button
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => setIsStudentPaymentModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FinanceAccountPayment;
