
import MasterTable from "../../components/MasterTable";
import { useState } from 'react';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentModal = ({
    totalTuitionFeeAmount,
    totalMiscAmount,
    totalBookAmount,
    currentStudentName,
    setIsStudentPaymentModalVisible,
    searchQuery,
    studentPayments,
    currentStudent
  }) => {

    const { records: manageFees } = useFetch(`${baseUrl()}/manage-fees`);

    // After View payments is clicked
    const [viewPayment,setViewPayment] = useState(false);

    // Set the total payment of parent
    const [totalPayment,setTotalPayment] = useState(0);

    // Temporary storage for additional fee
    const [addtlFee,setAddtlFee] = useState({});

    // Push here all records to be paid by parent
    const [paymentRecords,setPaymentRecords] = useState([]);

    // For current selection of checkbox for payments
    const [currentPaymentScreen,setCurrentPaymentScreen] = useState([]);

    // For temporary container of fee after submission
    const [currentFeeId,setCurrentFeeId] = useState('');

    const handlePaymentScreenChange = (screen) => {
        setCurrentPaymentScreen((prev) => {
            if (prev.includes(screen)) {
                // If the screen exists, only remove it from the display, but do not reset payment records
                return prev.filter((s) => s !== screen);
            } else {
                // Add the screen to the list of visible categories
                return [...prev, screen];
            }
        });
    };
    

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
    ?.filter(payment => payment.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC')
    ?.map(payment => ({
        ...payment,
        description: payment.manageFeeId.feeDescription.description,
        code: payment.manageFeeId.feeDescription?.feeCateg?.code,
        amount: payment.manageFeeId.amount,
        isPaid: payment.isPaid ? 'Yes' : 'No',
        pay: (
        <input
            checked={paymentRecords.includes(payment)} // ensure checked state persists
            disabled={payment.isPaid ? true : false}
            type="checkbox"
            onChange={(e) => {
            const amount = payment.payEveryAmount;
            if (e.target.checked) {
                setPaymentRecords((prev) => [...prev, payment]);
                setTotalPayment((prev) => prev + amount);
            } else {
                setTotalPayment((prev) => prev - amount);
                setPaymentRecords((prev) => {
                if(prev.includes(payment)) {
                    return prev.filter((pay) => pay !== payment)
                }
                })
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
            checked={paymentRecords.includes(payment)} // ensure checked state persists
            disabled={payment.isPaid ? true : false}
            type="checkbox"
            onChange={(e) => {
                const amount = payment.payEveryAmount;
                if (e.target.checked) {
                setPaymentRecords((prev) => [...prev, payment]);
                setTotalPayment((prev) => prev + amount);
                } else {
                setTotalPayment((prev) => prev - amount);
                setPaymentRecords((prev) => {
                    if(prev.includes(payment)) {
                    return prev.filter((pay) => pay !== payment)
                    }
                })
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
            checked={paymentRecords.includes(payment)} // ensure checked state persists
            disabled={payment.isPaid ? true : false}
            onChange={(e) => {
            const amount = payment.payEveryAmount;
            if (e.target.checked) {
                setPaymentRecords((prev) => [...prev, payment]);
                setTotalPayment((prev) => prev + amount);
            } else {
                setTotalPayment((prev) => prev - amount);
                setPaymentRecords((prev) => {
                    return prev.filter((pay) => pay !== payment);
                });
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

    // For additional fees function
    const handleAdditionalFee = (feeId) => {
        setAddtlFee(manageFees.find(fee => fee._id === feeId));
        setCurrentFeeId(feeId);
    }

    const [animationTriggered, setAnimationTriggered] = useState(false); // Track animation state

    // Handle adding additional fee to payments
    // const addAdditionalFeeToPayment = () => {
    //     if (!currentFeeId) return;

    //     const selectedFee = manageFees.find(fee => fee._id === currentFeeId);

    //     // Add selected fee to paymentRecords
    //     setPaymentRecords((prev) => [...prev, selectedFee]);

    //     // Trigger animation
    //     setAnimationTriggered(true);

    //     // Clear the selected fee after adding it
    //     setTimeout(() => {
    //         setCurrentFeeId('');
    //         setAnimationTriggered(false); // Reset the animation state after it completes
    //     }, 1000); // 1 second delay for animation
    // };


    // // Setting the payment record with new value from additional fee
    const addAdditionalFeeToPayment = () => {
        setPaymentRecords((prev) => {
            // Ensure prev is an array
            const updatedPrev = Array.isArray(prev) ? prev : [];
    
            // Check if addtlFee is already in paymentRecords
            if (updatedPrev.includes(addtlFee)) {
                toast.error(`${addtlFee?.feeDescription?.description} is already in payment lists`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
                return updatedPrev;  // Return the previous state without changes
            } else {
                // toast.success(`${addtlFee?.feeDescription?.description} added successfully`, {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: true,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "colored"
                // });
                setAnimationTriggered(true);

                // Clear the selected fee after adding it
                setTimeout(() => {
                    setCurrentFeeId('');
                    setAnimationTriggered(false); // Reset the animation state after it completes
                }, 1000); // 1 second delay for animation
                return [...updatedPrev, addtlFee];  // Add the new fee
            }
        });

        setCurrentFeeId('');
    }


    const postPayment = async (e) => {
        e.preventDefault();
    
        try {
    
        } catch(err) {
            console.log(err);
        }
      }
    

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-md w-[80%] relative p-6 overflow-y-auto h-[90%] min-h-fit">
          <div className="border-b border-gray-300 py-2 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-700 text-2xl">{currentStudentName}</h2>
              <p className="text-gray-500">Account Payments</p>
            </div>
            <div className="flex items-center gap-2">
                <button // After clicking this, it will show all selected payments of the customer
                    onClick={() => setViewPayment(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                    View Payments
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => {
                        // setPaymentRecords([]); // Set to empty after pressing cancel
                        setIsStudentPaymentModalVisible(false);
                    }}
                    >
                    Cancel
                </button>
            </div>
          </div>
  
          <section className="mt-6">
            {/* Payment categories with checkboxes */}
            <div className="grid grid-cols-3 gap-5 bg-blue-500 justify-items-start p-4">
              <label className="font-bold text-gray-100" htmlFor="action">Action</label>
              <label className="font-bold text-gray-100" htmlFor="payment category">Payment Category</label>
              <label className="font-bold text-gray-100" htmlFor="amount">Amount</label>
            </div>
  
            <div className="grid grid-cols-3 gap-5 bg-gray-100 justify-items-start p-4">
              <input type="checkbox" onChange={() => handlePaymentScreenChange('Tuition Fee')} />
              <h1>Tuition Fee</h1>
              <p>{totalTuitionFeeAmount.toFixed(2)}</p>
            </div>
  
            {currentPaymentScreen.includes('Tuition Fee') && (
              <MasterTable 
                columns={paymentScheduleColumns}
                data={paymentScheduleData}
                searchQuery={searchQuery}
                disableAction={true}
                disableCountList={true}
              />
            )}
  
            <div className="grid grid-cols-3 gap-5 bg-gray-200 justify-items-start p-4">
              <input type="checkbox" onChange={() => handlePaymentScreenChange('Miscellaneous Fee')} />
              <h1>Miscellaneous Fee</h1>
              <p>{totalMiscAmount.toFixed(2)}</p>
            </div>
  
            {currentPaymentScreen.includes('Miscellaneous Fee') && (
              <MasterTable 
                columns={miscellaneousColumn}
                data={miscellaneousData}
                searchQuery={searchQuery}
                disableAction={true}
                disableCountList={true}
              />
            )}
  
            <div className="grid grid-cols-3 gap-5 bg-gray-100 justify-items-start p-4">
              <input type="checkbox" onChange={() => handlePaymentScreenChange('Textbook Fee')} />
              <h1>Textbook Fee</h1>
              <p>{totalBookAmount.toFixed(2)}</p>
            </div>
  
            {currentPaymentScreen.includes('Textbook Fee') && (
              <MasterTable 
                columns={textbookColumn}
                data={textbookData}
                searchQuery={searchQuery}
                disableAction={true}
                disableCountList={true}
              />
            )}
            <div className="py-4 flex flex-col gap-2">
                <label className="text-md" htmlFor="other fees">Add Other Fees:</label>
                { manageFees?.filter(fee => {
                    const filterByStudent = fee.feeDescription?.feeCateg?.code === 'ADF' && 
                    (fee.nationality.charAt(0) === currentStudent.nationality.nationalityCode) &&
                    fee.gradeLevelId.gradeLevel.toLowerCase() === currentStudent?.academicId?.gradeLevelId?.gradeLevel.toLowerCase() &&
                    fee?.strandId?.strand.toLowerCase() === currentStudent?.academicId?.strandId?.strand?.toLowerCase();
                    
                    return filterByStudent
                }).length < 1 ? (
                    <span 
                        className="p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm border-2 bg-red-300 border-red-500 text-red-700 font-semibold"
                    >
                        No additional fees to be added yet
                    </span>
                ) : (
                    <div className="flex gap-2 items-center">
                        <select
                            value={currentFeeId}
                            onChange={(e) => handleAdditionalFee(e.target.value)}
                            className="p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm border border-gray-300"
                        >   
                            <option hidden>Select fees</option>
                            { manageFees?.filter(fee => {
                                const filterByStudent = fee.feeDescription?.feeCateg?.code === 'ADF' && 
                                (fee.nationality.charAt(0) === currentStudent.nationality.nationalityCode) &&
                                fee.gradeLevelId.gradeLevel.toLowerCase() === currentStudent?.academicId?.gradeLevelId?.gradeLevel.toLowerCase() &&
                                fee?.strandId?.strand.toLowerCase() === currentStudent?.academicId?.strandId?.strand?.toLowerCase();

                                return filterByStudent
                            }).map((fee) => (
                                <option key={fee._id} value={fee._id}>{fee.feeDescription.description}</option>
                            )) }
                            <option value="">N/A</option>
                        </select>
                        { currentFeeId && (
                            <button 
                                onClick={addAdditionalFeeToPayment}
                                className="p-2 rounded-md text-sm bg-blue-500 hover:bg-blue-600 text-gray-100"
                            >
                                Add to payments
                            </button>
                        ) }
                    </div>
                ) }
                {/* Animation when fee is added */}
                { animationTriggered && (
                    <div className="fee-animation">
                        <span>Check here</span>
                    </div>
                )}
            </div>

          </section>
  
          {/* Sticky Footer section for total amount and Pay button */}
          <div className="sticky bottom-0 left-0 w-full bg-white p-4 border-t border-gray-300 flex justify-between items-center">
            <h1 className="font-bold text-lg text-gray-700">
              Total Amount to be Paid: Php. { (totalBookAmount + totalMiscAmount + totalTuitionFeeAmount).toFixed(2) }
            </h1>
            { paymentRecords.length > 0 && (
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md text-sm"
                    onClick={() => console.log('Proceed with Payment')}
                >
                    Pay Now
                </button>
            ) }
          </div>
        </div>

        { viewPayment && (
            <ViewPaymentModal 
                paymentRecords={paymentRecords}
                setViewPayment={setViewPayment}
                searchQuery={searchQuery}
            />
        ) }
        <ToastContainer />
      </div>
    );
  };

export default PaymentModal;    


const ViewPaymentModal = ({ paymentRecords,setViewPayment,searchQuery }) => {


    const paymentRecordColumn = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'amount', header: 'Amount' }
    ]

    const paymentRecordData = paymentRecords?.map((payment) => ({
        ...payment,
        description: payment.manageFeeId?.feeDescription?.description || payment?.description || payment?.feeDescription?.description || (payment?.paymentScheduleId && `Tuition Fee ${payment.paymentScheduleId.dateSchedule}`) || payment?.textBookId?.bookTitle || 'No Description',
        amount: payment.amount || payment.manageFeeId?.amount || payment?.payEveryAmount || payment?.textBookId?.bookAmount || 0
    }));

    const totalPaymentAmount = paymentRecordData.reduce((total,payment) => total + payment.amount ,0);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-md w-[50%] relative p-6 overflow-y-auto h-[50%] min-h-fit">
                <div className="border-b border-gray-300 py-2 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-gray-700 text-2xl">Payments Selected</h2>
                        <p className="text-gray-500">Payment Lists</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                            onClick={() => setViewPayment(false)}
                            >
                            Cancel
                        </button>
                    </div>
                </div>

                <MasterTable 
                    searchQuery={searchQuery}
                    columns={paymentRecordColumn}
                    data={paymentRecordData}
                    disableAction={true}
                    disableCountList={true}
                />

            <h1 className="font-bold text-lg text-gray-700 mt-3">
              Total Amount to be Paid: Php. { totalPaymentAmount.toFixed(2) }
            </h1>
            </div>
            
        </div>
    )
}
  