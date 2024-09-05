import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import React, { useState, useMemo } from 'react';

const AssessmentTable = ({ setViewRecord,searchQuery }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'admitted', header: 'Admitted' },
        { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
        { accessorKey: 'action', header: 'Action' }
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const actions = (student) => (
        <div className="flex gap-2 items-center">
            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
        </div>
    );

    const formattedStudents = students?.filter(student => student.academicId.isAdmitted && student.academicId.isRegistered).map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.academicId.isRegistered ? 'Yes' : 'No',
        admitted: student.academicId.isAdmitted ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        action: actions(student)
    }));
    

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const filteredData = useMemo(() => {
        if (!searchQuery) return formattedStudents;
        return formattedStudents.filter(item =>
            columns.some(column =>
                item[column.accessorKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [formattedStudents, searchQuery, columns]);

    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            const sorted = [...filteredData].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }
        return filteredData;
    }, [filteredData, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, sortedData, itemsPerPage]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    return (
        <>
        <div className="overflow-x-auto rounded-md w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((column, key) => (
                            <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(column.accessorKey)}>
                                {column.header}
                                {sortConfig.key === column.accessorKey && (
                                    <span>{sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={row._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    {column.accessorKey ? row[column.accessorKey] : actions ? actions(row) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex justify-center items-center p-4 space-x-4 text-sm">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                Previous
            </button>
            <span className="font-medium">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                Next
            </button>
        </div>
        </>
    )
}

export default AssessmentTable;