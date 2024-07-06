import React, { useState, useEffect } from 'react';

const MasterTable = ({ columns, data, searchQuery, onUpdate, onDelete }) => {
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        if (editId) {
            const recordToEdit = data.find(record => record._id === editId);
            console.log('Editing record:', recordToEdit); // Debugging line
            setEditValues(recordToEdit || {});
        }
    }, [editId, data]);

    const handleEditClick = (record) => {
        setEditId(record._id);
    };

    const handleSaveClick = (id) => {
        const updatedValues = columns.reduce((acc, column) => {
            const keys = column.accessorKey.split('.');
            if (keys.length > 1) {
                acc[keys[0]] = {
                    ...editValues[keys[0]],
                    [keys[1]]: editValues[column.accessorKey] !== undefined ? editValues[column.accessorKey] : data.find(record => record._id === id)[column.accessorKey.split('.')[0]][column.accessorKey.split('.')[1]]
                };
            } else {
                acc[column.accessorKey] = editValues[column.accessorKey] !== undefined ? editValues[column.accessorKey] : data.find(record => record._id === id)[column.accessorKey];
            }
            return acc;
        }, {});
        onUpdate(id, updatedValues);
        setEditId(null);
    };

    const handleInputChange = (key, value) => {
        console.log(key, value);
        setEditValues(prevValues => ({ ...prevValues, [key]: value }));
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
            const value = column.accessorKey.split('.').reduce((acc, key) => acc[key], record);
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
                                {columns.map((column, index) => {
                                    const value = column.accessorKey.split('.').reduce((acc, key) => acc[key], record);
                                    const isEditing = editId === record._id;
                                    const isEditable = column.editable;

                                    return (
                                        <td key={index} className="py-2 px-4 border-b border-gray-700 text-sm">
                                            {isEditing && isEditable ? (
                                                column.selectOptions ? (
                                                    <select
                                                        value={editValues[column.accessorKey] || ''}
                                                        onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white"
                                                    >
                                                        <option value={editValues[column.accessorKey] || ''} disabled>{`Select ${column.header}`}</option>
                                                        {column.selectOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={editValues[column.accessorKey] || ''}
                                                        onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white"
                                                    />
                                                )
                                            ) : (
                                                value
                                            )}
                                        </td>
                                    );
                                })}

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
