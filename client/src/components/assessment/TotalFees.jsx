import { baseUrl } from '../../baseUrl';
import { MainContext } from '../../helpers/MainContext';
import { useFetch } from '../../hooks/useFetch';
import MasterTable from '../MasterTable';
import { useContext } from 'react';

const TotalFees = ({ record }) => {

    const { records: studentPayments } = useFetch(`${baseUrl()}/student-payment/${record?._id}`);
    const gradeLevel = record?.academicId?.gradeLevelId?._id;
    const natlCode = record.nationality.toLowerCase();


    const { searchQuery } = useContext(MainContext);

    const filteredFeeLists = studentPayments?.filter(fee => {
        return (
            fee.gradeLevelId?._id === gradeLevel &&
            fee?.studentId?.nationality?.nationality?.toLowerCase() === natlCode &&
            fee?.manageFeeId
        );
    }).map(payment => ({
        ...payment,
        paid: payment.isPaid ? 'Yes' : 'No'
    }))

    const columns = [
        { accessorKey: 'feeCodeId.description', header: 'Description' },
        { accessorKey: 'manageFeeId.feeDescription.feeCateg.code', header: 'Fee Catgory' },
        { accessorKey: 'manageFeeId.amount', header: 'Amount' },
        { accessorKey: 'paid', header: 'Paid' },
    ]
    

    const totalAmount = filteredFeeLists?.filter(payment => {
        return !payment.isPaid && payment.manageFeeId
    })?.reduce((sum, fee) => sum + (fee.manageFeeId.amount || 0) , 0);
    
    return (
        <div className="mt-6 p-4 bg-white rounded-lg overflow-hidden">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Total Amount Fees</h2>
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
        </div>
    );
};

export default TotalFees;
