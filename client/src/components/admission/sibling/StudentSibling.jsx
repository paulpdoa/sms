import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";

const StudentSibling = ({ id }) => {
    
    const { records: sibling } = useFetch(`${baseUrl()}/sibling/student/${id._id}`);

    if(sibling) {
        return (
            <div className="mt-3 p-6 bg-white shadow-md rounded-md overflow-hidden">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Student Sibling Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Last Name:</label>
                        <span className="text-sm truncate">{sibling.lastName}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">First Name:</label>
                        <span className="text-sm truncate">{sibling.firstName}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Middle Name:</label>
                        <span className="text-sm truncate">{sibling.middleName}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Email:</label>
                        <span className="text-sm truncate">{sibling.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Sibling:</label>
                        <span className="text-sm truncate">{sibling.studentId?.firstName} {sibling.studentId?.middleName} {sibling.studentId?.lastName}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <h1 className="mt-3 text-sm text-red-500">No sibling records yet</h1>
    )
}

export default StudentSibling;