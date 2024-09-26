import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainContext } from '../helpers/MainContext';
import { baseUrl } from '../baseUrl';
import { useFetch } from '../hooks/useFetch';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationPopup from './ConfirmationPopup';

const MasterTable = ({ columns, data, searchQuery, onUpdate, onDelete, goToEdit, disableAction,onOpenPopup,isLoading = false,viewRecord, actions, onShow,disableCountList }) => {
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(10); // Set the number of rows per page

    const [isForDelete,setIsForDelete] = useState(false);
    const [deleteRecId,setDeleteRecId] = useState('');
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

        if (editValues['nationalityCodeId']) {
            updatedValues.nationalityCodeId = { _id: editValues['nationalityCodeId'] }
        }  

        if(editValues['teacher']) {
            updatedValues.teacher = editValues.teacherId._id
        }

        if(editValues['subject']) {
            updatedValues.subject = editValues.subjectId._id
        }

        if(editValues['roomNumberId']) {
            updatedValues.roomNumberId = editValues.roomNumberId._id
        }

        console.log(editValues);


        onUpdate(id, updatedValues);
        setEditId(null);
        setEditValues({});
    };

    const handleCancelClick = () => {
        setEditId(null);
        setEditValues({});
    };

    const handleDeleteClick = (id) => {
        // ask user first before deletion
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
                <div className="flex flex-col justify-between">
                    { !disableCountList && (
                        <div className="flex items-center gap-2 pb-2 px-4">
                            <span className="text-gray-500 text-sm">Display</span>
                            <input className="outline-blue-200 w-[4.5em] rounded-md p-1 text-sm border border-gray-300" value={rowsPerPage} type="number" onChange={(e) => setRowsPerPage(e.target.value)} />
                            <span className="text-gray-500 text-sm">result/s</span>
                        </div>
                    ) } 
                    
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
                    <AnimatePresence mode="wait">
                        <motion.tbody
                            key={currentPage} // use currentPage as key to trigger re-render on page change
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            { !isLoading ? (
                                currentRows.length > 0 ? (
                                    currentRows.map((record) => (
                                        <tr key={record._id} className="bg-white border-b hover:bg-customHighlight hover:text-white">
                                            {columns.map(column => (
                                                <td key={column.accessorKey} className="px-6 py-3">
                                                    {(isConfirmedEdit ? (editId === record._id && isConfirmedEdit) : (editId === record._id)) ? (
                                                        column.editable ? (
                                                            column.selectOptions ? (
                                                                <select
                                                                    key={record._id}
                                                                    name={column.accessorKey}
                                                                    value={editValues[column.accessorKey] || ''}
                                                                    onChange={(e) => handleInputChange(e, column)}
                                                                    className="outline-none p-1 rounded-md border border-gray-300 w-fit text-black"
                                                                >
                                                                    <option value={record._id || ''} disabled hidden>
                                                                        { 
                                                                            column.header === 'Adviser' ? record.adviser.name : 
                                                                            column.header === 'Grade Level' ? record.gradeLevel.gradeLevel : 
                                                                            column.header === 'Department' ? record.department.department : 
                                                                            column.header === 'Fee Category' ? record.feeCateg.feeCateg : 
                                                                            column.header === 'Nationality Code' ? record.nationalityCodeId :
                                                                            column.header
                                                                        }
                                                                    </option>
                                                                    {column.selectOptions.map((option,key) => (
                                                                        <>  
                                                                            <option key={key} value={option.value}>{option.label}</option>
                                                                        </>
                                                                    ))}
                                                                </select>


                                                            ) : (
                                                                <input
                                                                    name={column.accessorKey}
                                                                    value={editValues[column.accessorKey] || ''}
                                                                    onChange={(e) => handleInputChange(e, column)}
                                                                    className="outline-none p-1 rounded-md border border-gray-300 w-fit text-black"
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
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    { !actions ? (
                                                        !viewRecord ? (isConfirmedEdit ? (editId === record._id && isConfirmedEdit) : (editId === record._id)) ? (
                                                            <>
                                                                <button onClick={() => handleSaveClick(record._id)} className="bg-customSubmit text-white px-4 py-2 rounded-md mr-2">Save</button>
                                                                <button onClick={handleCancelClick} className="bg-customCancel text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                                                            </>
                                                        ) : (
                                                            <>  
                                                                {/* { onUpdate !== undefined &&  */}
                                                                    <button onClick={() => goToEdit ? goToEdit(record._id) : (!isYearDone && handleEditClick(record) )} className={`${!isYearDone ? 'cursor-pointer' : 'cursor-not-allowed'} bg-customView hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2`}>Edit</button>
                                                                {/* }                                                             */}
                                                                <button onClick={() => {
                                                                    // !isYearDone && handleDeleteClick(record._id)
                                                                    !isYearDone && setIsForDelete(true)
                                                                    if(!isYearDone) {
                                                                        setDeleteRecId(record._id);
                                                                        setIsForDelete(true)
                                                                    }
                                                                }} className={`${!isYearDone ? 'cursor-pointer' : 'cursor-not-allowed'} bg-customCancel hover:bg-red-600 text-white px-4 py-2 rounded-md`}>Delete</button>
                                                            </>
                                                        ) : 
                                                        <button onClick={() => {
                                                            if(onShow) {
                                                                onShow(true)
                                                                viewRecord(record)
                                                            } else {
                                                                viewRecord(record)
                                                            }
                                                        }} className="bg-customSubmit shadow-sm text-white px-4 py-2 rounded-md mr-2">View</button>
                                                    ) : 
                                                        actions(record)
                                                    }
                                                </td>
                                            ) }
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="py-4 px-6 text-center text-gray-500">
                                            No data found
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="py-4 px-6 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) }
                        </motion.tbody>
                    </AnimatePresence>
                </table>
            </div>

            {filteredData?.length > rowsPerPage && (
                <div className="flex justify-between items-center w-full py-3 px-6 bg-white border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        Showing {indexOfFirstRow + 1} to {indexOfLastRow} of {filteredData.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-customView hover:text-customHighlight'}`}
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                className={`text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-customView hover:text-customHighlight'}`}
                            >
                                { currentPage > 1 && currentPage - 1 }
                            </button>
                            <button
                                className={`text-sm text-white bg-blue-500 px-3 py-1 rounded-sm hover:bg-blue-600`}
                            >
                                { currentPage }
                            </button>
                            { currentPage !== totalPages && (
                                <button
                                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                    className={`text-sm ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-customView hover:text-customHighlight'}`}
                                >
                                    { currentPage > 1 && currentPage + 1 }
                                </button>
                            ) }
                        </div>
                        {/* <AnimatePresence mode="wait">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <motion.button
                                    key={page}
                                    onClick={() => paginate(page)}
                                    initial={{ opacity: 0, x: page > currentPage ? 50 : -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: page > currentPage ? -50 : 50 }}
                                    transition={{ duration: 0.3 }}
                                    className={`text-sm ${page === currentPage ? 'text-white bg-blue-500 px-3 py-1 rounded-md' : 'text-blue-500 hover:text-blue-700'}`}
                                >
                                    {page}
                                </motion.button>
                            ))}
                        </AnimatePresence> */}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`text-sm ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-customView hover:text-customHighlight'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            
            {/* <div className="pagination mt-4 flex justify-center items-center">
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
            </div> */}
            { isForDelete && <ConfirmationPopup
                message={'Are you sure you want to delete this record? Deleting this record will remove it from the list'}
                onClose={() => setIsForDelete(false)}
                onConfirm={() => handleDeleteClick(deleteRecId)}
            /> }
        </>
    );
};

export default MasterTable;
