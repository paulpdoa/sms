import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const ReusableTable = ({ columns, records, path, deleteRecord, itemsPerPage = 10, searchQuery, viewRecord,disableAction }) => {
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

    // Helper function to access nested properties and format dates
    const getNestedValue = (obj, path) => {
        const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
        return formatDate(value);
    };

    // Helper function to format dates
    const formatDate = (date) => {
        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            return moment(date).format('MMM D, YYYY');
        }
        return date;
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
        <>
            <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {columns?.map((column, key) => (
                                <th
                                    key={key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort(column.accessorKey)}
                                >
                                    <div className="flex items-center">
                                        {column.header}
                                        {sortConfig.key === column.accessorKey ? (
                                            sortConfig.direction === 'asc' ? (
                                                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                                </svg>
                                            ) : (
                                                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            )
                                        ) : (
                                            <svg className="ml-1 w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                            { !disableAction && <th scope="col" className="px-6 py-3">Action</th>  }
                        </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                        {paginatedRecords?.map((record) => (
                            <tr
                                key={record._id}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                            >
                                {columns?.map((column, key) => (
                                    <td className="px-6 py-4" key={key}>
                                        {typeof column.cell === 'function' ? column.cell(getNestedValue(record, column.accessorKey)) : getNestedValue(record, column.accessorKey) ?? 'Not Assigned'}
                                    </td>
                                ))}
                                { !disableAction && (
                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        {viewRecord ?
                                            <button
                                                onClick={() => viewRecord(record)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                View
                                            </button>
                                            :
                                            <button
                                                onClick={() => goToEdit(record._id)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        }  
                                        {deleteRecord &&
                                            <button
                                                onClick={() => deleteRecord(record._id)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>}
                                    </td>
                                ) }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center p-4 space-x-4 text-sm">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Previous
                </button>
                <span className="font-medium">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || records.length < 1}
                    className={`px-4 py-2 rounded-lg border ${(currentPage === totalPages || records.length < 1) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default ReusableTable;
