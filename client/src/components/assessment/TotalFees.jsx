import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';

const TotalFees = ({ record }) => {

    const { records: studentPayments } = useFetch(`${baseUrl()}/student-payment/${record?._id}`);
    const gradeLevel = record?.academicId?.gradeLevelId?._id;
    const natlCode = record.nationality.toLowerCase();

    const filteredFeeLists = studentPayments?.filter(fee => {
        return (
            // fee.gradeLevelId?._id === gradeLevel &&
            // fee?.studentId?.nationality?.nationality?.toLowerCase() === natlCode &&
            fee?.manageFeeId
        );
    });
    console.log(filteredFeeLists);
    

    const totalAmount = filteredFeeLists?.reduce((sum, fee) => sum + (fee?.manageFeeId?.amount || 0), 0);
    
    return (
        <div className="mt-6 p-4 bg-white rounded-lg overflow-hidden">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Total Amount Fees</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="border-b bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">Fee Code</th>
                            <th className="px-4 py-3">Fee Description</th>
                            <th className="px-4 py-3 text-right">Total Amount Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFeeLists?.map((fee, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-3">{`${fee?.feeCodeId?.code} ${fee?.gradeLevelId?.gradeLevel} ${fee?.studentId?.nationality?.nationality === 'Filipino' ? 'Local' : 'Foreign'}`}</td>
                                <td className="px-4 py-3">{fee?.feeCodeId?.description}</td>
                                <td className="px-4 py-3 text-right">{(fee?.manageFeeId?.amount || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                        { filteredFeeLists.length > 0 &&
                        <tr className="font-bold border-t">
                            <td colSpan="2" className="px-4 py-3 text-right">Total:</td>
                            <td className="px-4 py-3 text-right">{totalAmount?.toFixed(2)}</td>
                        </tr>
                        }
                    </tbody>
                </table>
                { filteredFeeLists.length < 1 && <h2 className="text-sm text-red-500 p-2 animate-pulse">Nothing to display here</h2> }
            </div>
        </div>
    );
};

export default TotalFees;
