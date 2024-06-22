import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import { useState } from 'react';
import StudentInfoPopup from "./StudentInfoPopup";

const StudentInfoTable = ({ setViewRecord }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name',
        },
        {
            accessorKey: 'studentNo',
            header: 'Student No.'
        },
        {
            accessorKey: 'registered',
            header: 'Registered'
        },
        {
            accessorKey: 'dateRegistered',
            header: 'Date Registered'
        },
        {
            header: 'Status'
        },
        {
            header: 'Grade Level'
        },
        {
            header: 'Strand'
        },
        {
            header: 'Nationality'
        },
        {
            accessorKey: 'action',
            header: 'Action'
        }
    ]

    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [updatePopup,setUpdatePopup] = useState(false);
    const [studentRec,setStudentRec] = useState([])

    const updateStudentInfo = (student) => {
        setUpdatePopup(!updatePopup);
        setStudentRec(student)
    }

    return (
        <>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    { columns?.map((column,key) => (
                        <th key={key} scope="col" className="px-6 py-3">
                            { column.header }
                        </th>
                    )) }
                </tr>
            </thead>
            <tbody>
                { students?.filter(student => !student.isAdmitted).map(student => (
                    <tr key={student._id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            { student.firstName } { student.middleName } { student.lastName }
                        </th>
                        <td className="px-6 py-4">
                            { student?.studentNo ? student?.studentNo : 'Not assigned' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.isRegistered ? 'Yes' : 'No' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.dateRegistered ? student?.dateRegistered : 'Not Registered' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.status }
                        </td>
                        <td className="px-6 py-4">
                            { student?.gradeLevel?.gradeLevel ? student?.gradeLevel?.gradeLevel : 'Not assigned' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.strand?.strand ? student?.strand?.strand : 'Not assigned' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.nationality?.nationality ? student?.nationality?.nationality : 'Not assigned' }
                        </td>
                        <td className="px-6 py-4 flex gap-2 items-center">
                            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
                            <button onClick={() => updateStudentInfo(student)} className="font-medium text-green-500 hover:underline">Update</button>
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
        { updatePopup && <StudentInfoPopup id={studentRec} closeModal={setUpdatePopup}/> }
        </>
    )
}

export default StudentInfoTable;