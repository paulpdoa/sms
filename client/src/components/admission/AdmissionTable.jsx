import React, { useState, useMemo } from 'react';

const AdmissionTable = ({ columns, data, actions, searchQuery }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter(item =>
            columns.some(column =>
                item[column.accessorKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [data, searchQuery, columns]);

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
        <div className="overflow-x-auto">
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
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                Previous
            </button>
            <span className="font-medium">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                Next
            </button>
        </div>
        </>
    );
};

export default AdmissionTable;
