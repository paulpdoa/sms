import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";

const StudentReqTable = ({ setViewRecord }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name',
        },
        {
            accessorKey: 'admitted',
            header: 'Admitted'
        },
        {
            accessorKey: 'dateAdmitted',
            header: 'Date Admitted'
        },
        {
            accessorKey: 'gradelevel',
            header: 'Grade Level'
        },
        {
            header: 'Status'
        },
        {
            header: 'Email'
        },
        {
            accessorKey: 'action',
            header: 'Action'
        }
    ]

    const { records: students } = useFetch(`${baseUrl()}/students`);

    return (
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
                { students?.map(student => (
                    <tr key={student._id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            { student.firstName } { student.middleName } { student.lastName }
                        </th>
                        <td className="px-6 py-4">
                            { student?.isAdmitted ? 'Yes' : 'No' }
                        </td>
                        <td className="px-6 py-4">
                            { student?.dateAdmitted ? student.dateAdmitted.split('T')[0] : 'Not admitted' }
                        </td>
                        <td className="px-6 py-4">
                            { student.gradeLevel?.gradeLevel ? student.gradeLevel?.gradeLevel : 'Not Assigned' }
                        </td>
                        <td className="px-6 py-4">
                            { student.status }
                        </td>
                        <td className="px-6 py-4">
                            { student.email }
                        </td>
                        <td className="px-6 py-4 flex gap-2 items-center">
                            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    )
}

export default StudentReqTable;