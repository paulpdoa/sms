import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';

const TotalFees = ({id}) => {

    const { records: manageFees } = useFetch(`${baseUrl()}/manage-fees`);

    console.log(manageFees);

    return (
        <div className="mt-3 p-6 bg-white shadow-md rounded-md overflow-hidden">
            <h2 className="text-xl font-bold text-green-600 mb-4">Total Amount Fees</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Last Name:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">First Name:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Middle Name:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Gender:</label>
                    <span className="text-sm truncate"></span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Date of Birth:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Place of Birth:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Address:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Nationality:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Religion:</label>
                    <span className="text-sm truncate">{}</span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Contact:</label>
                    <span className="text-sm truncate"></span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Email:</label>
                    <span className="text-sm truncate"></span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">Status:</label>
                    <span className="text-sm truncate"></span>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-green-600">LRN:</label>
                    <span className="text-sm truncate"></span>
                </div>
            </div>
        </div>
    )
}

export default TotalFees;