import { useState, useEffect, useContext } from 'react';
import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';
import MasterTable from '../MasterTable';
import { MainContext } from '../../helpers/MainContext';

const Assistance = ({ record }) => {
    const [loading, setLoading] = useState(true);
    const { records: studentPayments, loading: fetchLoading } = useFetch(`${baseUrl()}/student-payment/${record?._id}`);

    const { searchQuery } = useContext(MainContext);

    useEffect(() => {
        setLoading(fetchLoading);
    }, [fetchLoading]);

    const gradeLevel = record?.academicId?.gradeLevelId?._id;
    const natlCode = record?.nationality?.toLowerCase();
    const strandId = record?.academicId?.strandId?._id;

    const filteredFeeLists = studentPayments?.filter(fee => {
        return (
            fee.gradeLevelId?._id === gradeLevel &&
            fee?.studentId?.nationality?.nationality?.toLowerCase() === natlCode &&
            fee?.studentId?.academicId?.strandId === strandId &&
            fee?.studentDiscountId !== undefined
        );
    }).map(discount => ({
        ...discount,
        discountType: discount.studentDiscountId.discountId.discountType,
        discountCode: discount.studentDiscountId.discountId.discountCode,
        discountAmount: (discount.studentDiscountId.discountId.amount || 0).toFixed(2)
    }));

    const columns = [
        { accessorKey: 'discountType', header: 'Discount Type' },
        { accessorKey: 'discountCode', header: 'Discount Code' },
        { accessorKey: 'discountAmount', header: 'Discount Amount' }
    ];

    const totalAmount = filteredFeeLists.reduce((total,discount) => total + discount.studentDiscountId.discountId.amount,0)

    return (
        <div className="mt-6 p-4 bg-white rounded-lg overflow-hidden">
            {loading ? (
                <div className="text-center text-gray-700">Loading...</div>
            ) : (
                <>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Student Discounts</h2>
                <MasterTable 
                    data={filteredFeeLists}
                    columns={columns}
                    searchQuery={searchQuery}
                    disableAction={true}
                    disableCountList={true}
                />
                <div className="mt-3">
                    <p className="font-semibold text-gray-800 text-lg">Remaining Amount: 
                        <span className="text-blue-500"> Php. {totalAmount?.toFixed(2)}</span>
                    </p>
                </div>
                </>
            )}
        </div>
    );
};

export default Assistance;
