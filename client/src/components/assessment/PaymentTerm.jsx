import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';

const PaymentTerm = ({ record }) => {
    const [loading, setLoading] = useState(true);
    const { records: studentPayments, loading: fetchLoading } = useFetch(`${baseUrl()}/student-payment/${record?._id}`);

    useEffect(() => {
        setLoading(fetchLoading);
    }, [fetchLoading]);

    const gradeLevel = record?.academicId?.gradeLevelId?._id;
    const natlCode = record?.nationality.toLowerCase();
    const strandId = record?.academicId?.strandId?._id;

    const filteredFeeLists = studentPayments?.filter(fee => {
        return (
            fee.gradeLevelId?._id === gradeLevel &&
            fee?.studentId?.nationality?.nationality.toLowerCase() === natlCode &&
            fee?.studentId?.academicId?.strandId === strandId &&
            fee?.paymentScheduleId !== undefined
        );
    });

    console.log(filteredFeeLists);

    const totalAmount = filteredFeeLists?.reduce((sum, fee) => sum + (fee?.payEveryAmount || 0), 0);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-lg overflow-hidden">
            {loading ? (
                <div className="text-center text-green-700">Loading...</div>
            ) : (
                <>
                <h2 className="text-2xl font-semibold text-green-700 mb-6">Payment Schedule</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="border-b bg-gray-100">
                            <tr>
                                <th className="px-4 py-3">Payment Schedule</th>
                                <th className="px-4 py-3">Amount Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeeLists?.map((fee, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-3">{formatDate(fee?.paymentScheduleId?.dateSchedule)}</td>
                                    <td className="px-4 py-3">{(fee?.payEveryAmount || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                            {filteredFeeLists.length > 0 &&
                                <tr className="font-bold border-t">
                                    <td className="px-4 py-3 text-right">Total:</td>
                                    <td className="px-4 py-3 text-right">{totalAmount?.toFixed(2)}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {filteredFeeLists.length < 1 && <h2 className="text-sm text-red-500 p-2 animate-pulse">Nothing to display here</h2>}
                </div>
                </>
            )}
        </div>
    );
};

export default PaymentTerm;
