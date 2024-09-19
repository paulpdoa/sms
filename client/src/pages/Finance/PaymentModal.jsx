
import MasterTable from "../../components/MasterTable";

const PaymentModal = ({
    totalTuitionFeeAmount,
    totalMiscAmount,
    totalBookAmount,
    currentStudentName,
    setIsStudentPaymentModalVisible,
    handlePaymentScreenChange,
    currentPaymentScreen,
    paymentScheduleColumns,
    paymentScheduleData,
    searchQuery,
    textbookColumn,
    textbookData,
    miscellaneousColumn,
    miscellaneousData
  }) => {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-md w-[80%] relative p-6 overflow-y-auto h-[90%] min-h-fit">
          <div className="border-b border-gray-300 py-2 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-700 text-2xl">{currentStudentName}</h2>
              <p className="text-gray-500">Account Payments</p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              onClick={() => {
                setIsStudentPaymentModalVisible(false);
              }}
            >
              Cancel
            </button>
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
              />
            )}
          </section>
  
          {/* Sticky Footer section for total amount and Pay button */}
          <div className="sticky bottom-0 left-0 w-full bg-white p-4 border-t border-gray-300 flex justify-between items-center">
            <h1 className="font-bold text-lg text-gray-700">
              Total Amount to be Paid: PHP. { (totalBookAmount + totalMiscAmount + totalTuitionFeeAmount).toFixed(2) }
            </h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md text-lg"
              onClick={() => console.log('Proceed with Payment')}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  };

export default PaymentModal;
  