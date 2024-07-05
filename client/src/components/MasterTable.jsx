import React, { useState } from 'react';

const MasterTable = ({ columns, data, searchQuery, onUpdate, onDelete }) => {
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleEditClick = (record) => {
        setEditId(record._id);
        setEditValues(record);
    };

    const handleSaveClick = (id) => {
        onUpdate(id, editValues);
        setEditId(null);
    };

    const handleInputChange = (key, value) => {
        setEditValues({ ...editValues, [key]: value });
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });

    const filteredData = sortedData.filter(record => {
        return columns.some(column => {
            const value = record[column.accessorKey];
            return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
    });

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <>
            <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
                <table className="min-w-full text-gray-200">
                    <thead className="bg-gray-800 font-light">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="py-2 px-4 border-b border-gray-700 cursor-pointer font-semibold text-sm text-left"
                                    onClick={() => handleSort(column.accessorKey)}
                                >
                                    {column.header}
                                    {sortConfig.key === column.accessorKey ? (
                                        sortConfig.direction === 'asc' ? '▲' : '▼'
                                    ) : ''}
                                </th>
                            ))}
                            <th className="py-2 px-4 border-b border-gray-700 font-semibold text-sm text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map(record => (
                            <tr key={record._id} className="odd:bg-gray-800 even:bg-gray-700">
                                {columns.map((column, index) => (
                                    <td key={index} className="py-2 px-4 border-b border-gray-700 text-sm">
                                        {editId === record._id ? (
                                            column.editable ? (
                                                column.selectOptions ? (
                                                    <select
                                                        value={editValues[column.accessorKey]}
                                                        onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white"
                                                    >
                                                        <option hidden>{`${record[column.accessorKey] ?? `Select ${record[column.accessorKey]}` }`}</option>
                                                        {column.selectOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={editValues[column.accessorKey]}
                                                        onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white"
                                                    />
                                                )
                                            ) : (
                                                record[column.accessorKey]
                                            )
                                        ) : (
                                            record[column.accessorKey]
                                        )}
                                    </td>
                                ))}
                                <td className="py-2 px-4 border-b border-gray-700 flex space-x-2">
                                    {editId === record._id ? (
                                        <>
                                            <button onClick={() => handleSaveClick(record._id)} className="text-sm text-green-400 hover:underline">Save</button>
                                            <button onClick={() => setEditId(null)} className="text-sm text-red-400 hover:underline">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(record)} className="text-sm text-blue-400 hover:underline">Edit</button>
                                            <button onClick={() => onDelete(record._id)} className="text-sm text-red-400 hover:underline">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center text-sm items-center mt-4 gap-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <div>
                    <span>Page {currentPage} of {totalPages}</span>
                </div>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 rounded ml-2 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default MasterTable;
