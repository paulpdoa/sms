import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";
import { useContext } from 'react';
import { MainContext } from '../../../helpers/MainContext';

const StudentSibling = ({ setEnableView }) => {

    const { currStudRec,setCurrStudRec } = useContext(MainContext);

    const id = currStudRec; 
    
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

                <button onClick={() => {
                    setCurrStudRec(null);
                    setEnableView(false);
                }} className="bg-red-500 text-white text-sm py-2 px-4 hover:bg-red-600 rounded-md mt-2">
                    Cancel
                </button>
            </div>
        )
    }

    return (
        <>
        <h1 className="text-xl font-semibold text-red-500 animate-pulse">No sibling records yet</h1>
        <button onClick={() => {
            setCurrStudRec(null);
            setEnableView(false);
        }} className="bg-red-500 text-white text-sm py-2 px-4 hover:bg-red-600 rounded-md mt-2">
            Cancel
        </button>
        </>
    )
}

export default StudentSibling;