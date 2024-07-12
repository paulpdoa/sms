import React, { useState, useEffect } from 'react';

const MasterTable = ({ columns, data, searchQuery, onUpdate, onDelete, goToEdit,disableAction }) => {
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10); // Set the number of rows per page

    useEffect(() => {
        if (editId) {
            const recordToEdit = data.find(record => record._id === editId);
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
                    [keys[1]]: editValues[column.accessorKey] !== undefined ? editValues[column.accessorKey] : data.find(record => record._id === id)[keys[0]][keys[1]]
                };
            } else {
                acc[column.accessorKey] = editValues[column.accessorKey] !== undefined ? editValues[column.accessorKey] : data.find(record => record._id === id)[column.accessorKey];
            }
            return acc;
        }, {});
    
        // Fixing the nested id update issue
        if (editValues['gradeLevel.gradeLevel']) {
            updatedValues.gradeLevel = { _id: editValues['gradeLevel.gradeLevel'] };
        }
        if (editValues['adviser.name']) {
            updatedValues.adviser = { _id: editValues['adviser.name'] };
        }

        if(editValues['strand.strand']) {
            updatedValues.strand = { _id: editValues['strand.strand'] }
        }

        if(editValues['feeCateg.feeCateg']) {
            updatedValues.feeCateg = { _id: editValues['feeCateg.feeCateg'] }
        }

    
        onUpdate(id, updatedValues);
        setEditId(null);
    };

    const handleCancelClick = () => {
        setEditId(null);
    };

    const handleDeleteClick = (id) => {
        onDelete(id);
    };

    const handleInputChange = (e, column) => {
        const { name, value } = e.target;
        setEditValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSort = (column) => {
        let direction = 'asc';
        if (sortConfig.key === column.accessorKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: column.accessorKey, direction });
    };

    const sortedData = () => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = sortConfig.key.split('.').reduce((obj, key) => obj[key], a);
            const bValue = sortConfig.key.split('.').reduce((obj, key) => obj[key], b);
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const filteredData = sortedData().filter(record =>
        columns.some(column =>
            (column.accessorKey.split('.').reduce((obj, key) => obj[key], record) || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <>
        <div className="text-gray-900 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((column, key) => (
                            <th
                                key={key}
                                onClick={() => handleSort(column)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer"
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
                        { !disableAction && <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th> }
                    </tr>
                </thead>
                <tbody className="bg-gray-1 00 divide-y divide-gray-300">
                    {currentRows.map((record) => (
                        <tr key={record._id}>
                            {columns.map(column => (
                                <td key={column.accessorKey} className="px-6 py-4 whitespace-nowrap">
                                    {editId === record._id ? (
                                        column.editable ? (
                                            column.selectOptions ? (
                                                <select
                                                    name={column.accessorKey}
                                                    value={editValues[column.accessorKey] || ''}
                                                    onChange={(e) => handleInputChange(e, column)}
                                                    className="outline-none p-1 rounded-md border border-gray-500 bg-gray-800 text-gray-200"
                                                >
                                                    <option hidden>{column.header}</option>
                                                    {column.selectOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    name={column.accessorKey}
                                                    value={editValues[column.accessorKey] || ''}
                                                    onChange={(e) => handleInputChange(e, column)}
                                                    className="outline-none p-1 rounded-md border border-gray-500 bg-gray-800 text-gray-200"
                                                    type={column.type || ''}
                                                />
                                            )
                                        ) : (
                                            column.accessorKey.split('.').reduce((obj, key) => obj[key], record)
                                        )
                                    ) : (
                                        column.accessorKey.split('.').reduce((obj, key) => obj[key], record)
                                    )}
                                </td>
                            ))}
                            { !disableAction && 
                            <td className="px-6 py-4 whitespace-nowrap">
                                {editId === record._id ? (
                                    <>
                                        <button onClick={() => handleSaveClick(record._id)} className="text-green-400 hover:text-green-500">Save</button>
                                        <button onClick={handleCancelClick} className="text-red-400 hover:text-red-500 ml-2">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => onUpdate ? handleEditClick(record) : goToEdit(record._id)} className="text-blue-400 hover:text-blue-500">Edit</button>
                                        <button onClick={() => handleDeleteClick(record._id)} className="text-red-400 hover:text-red-500 ml-2">Delete</button>
                                    </>
                                )}
                            </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
        <div className="pagination mt-4 flex justify-center items-center">
    <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md focus:outline-none text-sm bg-gray-600 text-gray-300 hover:bg-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
        Previous
    </button>
    <ul className="flex mx-4">
        {currentPage > 1 && (
            <li className="mx-1">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-3 py-1 focus:outline-none hover:bg-gray-200 text-gray-900 bg-white border border-gray-400 rounded-md"
                >
                    {currentPage - 1}
                </button>
            </li>
        )}
        <li className="mx-1">
            <button
                className="px-3 py-1 focus:outline-none text-gray-200 rounded-md bg-gray-500"
            >
                {currentPage}
            </button>
        </li>
        {currentPage < totalPages && (
            <li className="mx-1">
                <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-3 py-1 focus:outline-none hover:bg-gray-200 text-gray-900 bg-white border border-gray-400 rounded-md"
                >
                    {currentPage + 1}
                </button>
            </li>
        )}
    </ul>
    <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages < 1}
        className="px-3 py-1 rounded-md focus:outline-none text-sm bg-gray-600 text-gray-300 hover:bg-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
        Next
    </button>
</div>
        </>
    );
};

export default MasterTable;
