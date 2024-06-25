import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReusableTable = ({ columns, records, path, deleteRecord, itemsPerPage = 5, searchQuery }) => {
    const navigate = useNavigate();
    const goToEdit = (id) => navigate(`${path}/${id}`);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Function to handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Helper function to access nested properties
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Filter records based on search query
    const filteredRecords = records.filter(record =>
        columns.some(column => {
            const value = getNestedValue(record, column.accessorKey);
            return value ? value.toString().toLowerCase().includes(searchQuery.toLowerCase()) : false;
        })
    );

    // Apply sorting to records
    let sortedRecords = [...filteredRecords];
    if (sortConfig.key) {
        sortedRecords.sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // Pagination logic
    const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
    const paginatedRecords = sortedRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns?.map((column, key) => (
                            <th
                                key={key}
                                scope="col"
                                className="px-6 py-3 cursor-pointer"
                                onClick={() => handleSort(column.accessorKey)}
                            >
                                {column.header}
                                {sortConfig.key === column.accessorKey && (
                                    <span className="text-white z-50">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                )}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedRecords?.map((record) => (
                        <tr
                            key={record._id}
                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                        >
                            {columns?.map((column, key) => (
                                <td className="px-6 py-4" key={key}>
                                    {getNestedValue(record, column.accessorKey) ?? 'Not Assigned'}
                                </td>
                            ))}
                            <td className="px-6 py-4 flex gap-2 items-center">
                                <button
                                    onClick={() => goToEdit(record._id)}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteRecord(record._id)}
                                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center gap-5 p-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`bg-gray-500 text-white p-2 rounded text-sm ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                    }`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="self-center text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`bg-gray-500 text-white p-2 rounded text-sm ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                    }`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ReusableTable;
