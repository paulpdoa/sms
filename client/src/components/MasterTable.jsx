import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainContext } from '../helpers/MainContext';
import { baseUrl } from '../baseUrl';
import { useFetch } from '../hooks/useFetch';

const MasterTable = ({ columns, data, searchQuery, onUpdate, onDelete, goToEdit, disableAction,onOpenPopup,isLoading = false,viewRecord, actions, onShow }) => {
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(10); // Set the number of rows per page

    // For disabling currentSchoolyear logged in session
    const { session,isFreshYear } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear?.isYearDone;

    const location = useLocation();
    const navigate = useNavigate();

    // For school year component confirmation popup
    const isConfirmedEdit = localStorage.getItem('isConfirmedEdit') === 'true';
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const savedPage = queryParams.get('page');
        if (savedPage) {
            setCurrentPage(Number(savedPage));
        }
    }, [location.search]);

    useEffect(() => {
        if (editId) {
            const recordToEdit = data.find(record => record._id === editId);
            setEditValues(recordToEdit || {});
        }
    }, [editId, data]);

    const handleEditClick = (record) => {
        navigate(`${location.pathname}?page=${currentPage}`);
        onOpenPopup && onOpenPopup(true)
        setEditId(record._id); 
    };

    useEffect(() => {
        setCurrentPage(1);
        navigate(`${location.pathname}?page=1`);
    }, [searchQuery, navigate, location.pathname]);

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

        if (editValues['strand.strand']) {
            updatedValues.strand = { _id: editValues['strand.strand'] }
        }

        if (editValues['feeCateg.feeCateg']) {
            updatedValues.feeCateg = { _id: editValues['feeCateg.feeCateg'] }
        }

        onUpdate(id, updatedValues);
        setEditId(null);
        setEditValues({});
    };

    const handleCancelClick = () => {
        setEditId(null);
        setEditValues({});
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

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`${location.pathname}?page=${pageNumber}`);
    };
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <>
            <div className="sm:rounded-lg">
                <div className="flex items-center gap-2 pb-2 px-4">
                    <span className="text-gray-500 text-sm">Display</span>
                    <input className="outline-blue-200 w-[4.5em] rounded-md p-1 text-sm border border-gray-300" value={rowsPerPage} type="number" onChange={(e) => setRowsPerPage(e.target.value)} />
                    <span className="text-gray-500 text-sm">result/s</span>
                </div>

                <table className="w-full text-sm text-left text-gray-500 shadow-md">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 border border-gray-200">
                        <tr>
                            {columns.map((column, key) => (
                                <th
                                    key={key}
                                    onClick={() => handleSort(column)}
                                    className="py-3 px-6 cursor-pointer"
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
                            {(!disableAction && isFreshYear === null) && <th className="py-3 px-6">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        { !isLoading ? (
                            currentRows.length > 0 ? (
                                currentRows.map((record) => (
                                    <tr key={record._id} className="bg-white border-b hover:bg-gray-100">
                                        {columns.map(column => (
                                            <td key={column.accessorKey} className="px-6 py-4">
                                                {(isConfirmedEdit ? (editId === record._id && isConfirmedEdit) : (editId === record._id)) ? (
                                                    column.editable ? (
                                                        column.selectOptions ? (
                                                            <select
                                                                name={column.accessorKey}
                                                                value={editValues[column.accessorKey] || ''}
                                                                onChange={(e) => handleInputChange(e, column)}
                                                                className="outline-none p-1 rounded-md border border-gray-300"
                                                            >   
                                                                <option value={record._id || ''} hidden>
                                                                    { 
                                                                        column.header === 'Adviser' ? record.adviser.name : 
                                                                        column.header === 'Grade Level' ? record.gradeLevel.gradeLevel : 
                                                                        column.header === 'Department' ? record.department.department : 
                                                                        column.header === 'Fee Category' ? record.feeCateg.feeCateg : 
                                                                        column.header
                                                                    }
                                                                   
                                                                </option>
                                                                {column.selectOptions.map(option => (
                                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                name={column.accessorKey}
                                                                value={editValues[column.accessorKey] || ''}
                                                                onChange={(e) => handleInputChange(e, column)}
                                                                className="outline-none p-1 rounded-md border border-gray-300"
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
                                        { (isFreshYear === null) && (
                                        !disableAction &&
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                { !actions ? (
                                                    !viewRecord ? (isConfirmedEdit ? (editId === record._id && isConfirmedEdit) : (editId === record._id)) ? (
                                                        <>
                                                            <button onClick={() => handleSaveClick(record._id)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
                                                            <button onClick={handleCancelClick} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>  
                                                            {/* { onUpdate !== undefined &&  */}
                                                                <button onClick={() => goToEdit ? goToEdit(record._id) : (!isYearDone && handleEditClick(record) )} className={`${!isYearDone ? 'cursor-pointer' : 'cursor-not-allowed'} bg-blue-500 text-white px-4 py-2 rounded-md mr-2`}>Edit</button>
                                                            {/* }                                                             */}
                                                            <button onClick={() => !isYearDone && handleDeleteClick(record._id)} className={`${!isYearDone ? 'cursor-pointer' : 'cursor-not-allowed'} bg-red-500 text-white px-4 py-2 rounded-md`}>Delete</button>
                                                        </>
                                                    ) : 
                                                    <button onClick={() => {
                                                        if(onShow) {
                                                            onShow(true)
                                                            viewRecord(record)
                                                        } else {
                                                            viewRecord(record)
                                                        }
                                                    }} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">View</button>
                                                ) : 
                                                    actions(record)
                                                }
                                            </td>
                                        ) }
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-b hover:bg-gray-100 w-full">
                                    <td className="px-6 py-4 text-xl animate-pulse text-nowrap">Nothing to display</td>
                                </tr>
                            )
                        ) : (
                            <tr className="border-b hover:bg-gray-100 w-full">
                                <td className="px-6 py-4 text-xl animate-pulse">Loading please wait...</td>
                            </tr>
                        ) }
                    </tbody>
                </table>
            </div>
            <div className="pagination mt-4 flex justify-center items-center">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md focus:outline-none text-sm hover:underline text-blue-500 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <ul className="flex mx-4">
                    {currentPage > 1 && (
                        <li className="mx-1">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                className="px-3 py-1 focus:outline-none text-blue-500 rounded-md text-sm"                            >
                                {currentPage - 1}
                            </button>
                        </li>
                    )}
                    <li className="mx-1">
                        <button
                            className="px-3 py-1 focus:outline-none hover:bg-gray-200 text-sm text-blue-500 bg-white border border-gray-400 rounded-md"
                        >
                            {currentPage}
                        </button>
                    </li>
                    {currentPage < totalPages && (
                        <li className="mx-1">
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                className="px-3 py-1 focus:outline-none text-blue-500 rounded-md text-sm"                            >
                                {currentPage + 1}
                            </button>
                        </li>
                    )}
                </ul>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages < 1}
                    className="px-3 py-1 rounded-md focus:outline-none text-sm hover:underline text-blue-500 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default MasterTable;
