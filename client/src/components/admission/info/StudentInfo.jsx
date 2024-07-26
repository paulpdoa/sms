import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";
import { useState,useContext } from 'react';
import StudentAssistance from "./StudentAssistance";
import { MainContext } from '../../../helpers/MainContext';

const StudentInfo = () => {

    const { currStudRec } = useContext(MainContext);

    const id = currStudRec._id;
    const { records: student } = useFetch(`${baseUrl()}/student/${id}`);

    const [studentAssistance,setStudentAssistance] = useState(false);

    if (student.isAdmitted) {
        return (
            <>
            <div className="mt-3 p-6 bg-white shadow-md rounded-md overflow-hidden">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Student Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">Last Name:</label>
                        <span className="text-sm truncate">{student.lastName}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">First Name:</label>
                        <span className="text-sm truncate">{student.firstName}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">Middle Name:</label>
                        <span className="text-sm truncate">{student.middleName}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">Gender:</label>
                        <span className="text-sm truncate">{student.sex?.gender ? student.sex?.gender : 'Not Assigned'}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">Date of Birth:</label>
                        <span className="text-sm truncate">{student.dateOfBirth?.replace(/-/g, '/')}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">Place of Birth:</label>
                        <span className="text-sm truncate">{student.placeOfBirth}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">Address:</label>
                        <span className="text-sm truncate">{student.address}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Nationality:</label>
                        <span className="text-sm truncate">{student.nationality?.nationality ? student.nationality?.nationality : 'Not Assigned'}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Religion:</label>
                        <span className="text-sm truncate">{student.religion?.religion ? student.religion?.religion : 'Not Assigned'}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Contact:</label>
                        <span className="text-sm truncate">+63{student.contactNumber}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Email:</label>
                        <span className="text-sm truncate">{student.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">Status:</label>
                        <span className="text-sm truncate">{student.status ? student.status : 'Not Assigned'}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-700">LRN:</label>
                        <span className="text-sm truncate">{student.lrn ? student.lrn : 'Not Assigned'}</span>
                    </div>
                </div>

                <button onClick={() => setStudentAssistance(true)} className="mt-4 text-sm text-blue-600 hover:underline font-semibold">Set Student Assistance</button>
                
            </div>
            { studentAssistance && <StudentAssistance id={id} closeModal={setStudentAssistance} /> }
            </>
        );
    }

    return (
        <div className="mt-3 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-red-500 text-lg font-semibold">
                Selected student is still not admitted yet, please complete requirements first.
            </h1>
        </div>
    );
};

export default StudentInfo;
