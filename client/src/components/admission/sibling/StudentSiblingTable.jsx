import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";

const StudentSiblingTable = ({ setViewRecord }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name',
        },
        {
            header: 'Sibling Name'
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
    const { records: siblings } = useFetch(`${baseUrl()}/siblings`);

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
                { siblings?.map(sibling => (
                    <tr key={sibling._id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            { sibling.firstName } { sibling.middleName } { sibling.lastName }
                        </th>
                        <td className="px-6 py-4">
                            { sibling.studentId?.firstName } { sibling.studentId?.middleName }  { sibling.studentId?.lastName }
                        </td>
                        <td className="px-6 py-4">
                            { sibling.email }
                        </td>
                        <td className="px-6 py-4 flex gap-2 items-center">
                            <button onClick={() => setViewRecord(sibling)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    )
}

export default StudentSiblingTable;