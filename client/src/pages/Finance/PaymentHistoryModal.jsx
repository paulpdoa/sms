import MasterTable from "../../components/MasterTable";
import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';

const PaymentHistoryModal= ({ currentStudent,setShowHistoryPayment,paymentTransactions }) => {

    const { searchQuery } = useContext(MainContext);

    const paymentHistoryData = paymentTransactions?.map(paymentHistory => ({
        ...paymentHistory,
        paymentDate: new Date(paymentHistory.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        }),
        description: 
        paymentHistory.studentPaymentId?.manageFeeId?.feeDescription?.feeCateg?.category || 
        paymentHistory.studentPaymentId?.textBookId?.bookTitle ||
        new Date(paymentHistory?.studentPaymentId?.paymentScheduleId?.dateSchedule).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        }) + ' - Tuition Fee' || ''

    }));
    const paymentColumns = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'referenceCode', header: 'Reference Code' },
        { accessorKey: 'amountPaid', header: 'Amount Paid' },
        { accessorKey: 'paymentDate', header: 'Payment Date' }
    ];

    console.log(paymentHistoryData)

    return (
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
    )
}

export default PaymentHistoryModal;