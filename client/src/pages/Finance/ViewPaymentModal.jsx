import MasterTable from "../../components/MasterTable";
import { useContext } from 'react';
import { MainContext } from "../../helpers/MainContext";
import { useSnackbar } from "notistack";

const ViewPaymentModal = ({ paymentRecords,setViewPayment,searchQuery,totalPayment,setPaymentRecords,setTotalPayment }) => {

    const paymentRecordColumn = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'amount', header: 'Amount' },
    ]

    const { enqueueSnackbar } = useSnackbar();

    const { numberFormatter } = useContext(MainContext);

    const paymentRecordData = paymentRecords?.map((payment) => ({
        ...payment,
        description: payment.manageFeeId?.feeDescription?.description || payment?.description || payment?.feeDescription?.description || (payment?.paymentScheduleId && `Tuition Fee ${payment.paymentScheduleId.dateSchedule}`) || payment?.textBookId?.bookTitle || 'No Description',
        amount: numberFormatter(payment.amount || payment.manageFeeId?.amount || payment?.payEveryAmount || payment?.textBookId?.bookAmount || 0)
    }));
    console.log(paymentRecordData);

    const removePaymentRecord = (id) => {
        const miscCode = id?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC';


        // If the code is for MSC, it cannot be removed here
        if(miscCode) {
            return enqueueSnackbar('Sorry, you cannot remove MSC code fees.', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }

        setTotalPayment(prev => prev - id.amount)
        setPaymentRecords(paymentRecordData.filter(payment => payment !== id))
    }

    const actions = (id) => (
        <button 
            onClick={() => removePaymentRecord(id)}
            className="bg-red-500 hover:bg-red-600 text-gray-100 rounded-md p-1 text-xs"
        >
            Remove
        </button>
    )


    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-md w-[50%] relative p-6 overflow-y-auto h-[80%] min-h-fit">
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
                    disableCountList={true}
                    actions={actions}
                />

                <h1 className="font-bold text-lg text-gray-700 mt-3">
                    Total Amount to be Paid: Php { numberFormatter(totalPayment) }
                </h1>
            </div>
            
        </div>
    )
}

export default ViewPaymentModal;