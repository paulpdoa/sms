import React, { useState, useEffect,useContext } from 'react';
import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';
import MasterTable from '../MasterTable';
import { MainContext } from '../../helpers/MainContext'; 

const PaymentTerm = ({ record }) => {

    const [loading, setLoading] = useState(true);
    const { records: studentPayments, loading: fetchLoading } = useFetch(`${baseUrl()}/student-payment/${record?._id}`);

    const { searchQuery } = useContext(MainContext);
    console.log(studentPayments)

    useEffect(() => {
        setLoading(fetchLoading);
    }, [fetchLoading]);

    const gradeLevel = record?.academicId?.gradeLevelId?._id;
    const natlCode = record?.nationality.toLowerCase();
    const strandId = record?.academicId?.strandId?._id;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const filteredFeeLists = studentPayments?.filter(fee => {
        return (
            fee.gradeLevelId?._id === gradeLevel &&
            fee?.studentId?.nationality?.nationality?.toLowerCase() === natlCode &&
            fee?.studentId?.academicId?.strandId === strandId &&
            fee?.paymentScheduleId !== undefined    
        );
    }).map(payment => ({
        ...payment,
        schedule: formatDate(payment.paymentScheduleId?.dateSchedule),
        amount: (payment.payEveryAmount || 0).toFixed(2),
        isPaid: payment.isPaid ? 'Yes' : 'No'
    }));

    const columns = [
        { accessorKey: 'schedule', header: 'Payment Date' },
        { accessorKey: 'amount', header: 'Amount' },
        { accessorKey: 'isPaid', header: 'Paid' }
    ]

    const totalAmount = studentPayments?.filter(payment => {
        return !payment.isPaid && payment.paymentScheduleId
    })?.reduce((sum, fee) => sum + (fee?.payEveryAmount || 0), 0);
    

    return (
        <div className="mt-6 p-4 bg-white rounded-lg overflow-hidden">
            {loading ? (
                <div className="text-center text-gray-700">Loading...</div>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Tuition Fee Payments</h2>
                    <MasterTable       
                        data={filteredFeeLists}
                        columns={columns}
                        searchQuery={searchQuery}
                        disableAction={true}
                        disableCountList={true}
                    />
                    <div className="mt-3">
                        <p className="font-semibold text-gray-800 text-lg">Remaining Amount: 
                            <span className="text-blue-500"> Php. {totalAmount.toFixed(2)}</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentTerm;
