import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useState, useContext } from 'react';
import { MainContext } from '../helpers/MainContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import ConfirmationPopup from './ConfirmationPopup';

const ReusableTable = ({ data, columns }) => {
    const { searchQuery, setSearchQuery } = useContext(MainContext);

    const [sorting, setSorting] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex,setPageIndex] = useState(0);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: searchQuery,
            pagination: {
                pageSize: pageSize,
                pageIndex: pageIndex
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setSearchQuery,
    });

    const currentPage = table.getState().pagination.pageIndex + 1;

    return (
        <>
            {/* Page Size Selector */}
            <div className="flex items-center gap-2 p-2">
                <span className="text-gray-500 text-sm">Display</span>
                <input
                    className="outline-blue-200 w-[4.5em] rounded-md p-1 text-sm border border-gray-300"
                    value={pageSize}
                    onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setPageSize(newSize);
                        setPageIndex(0); // Reset to first page when page size changes
                        table.setPageSize(newSize); // Ensure the table state also updates
                    }}
                    type="number"
                    min={1} // Prevent negative or zero page size
                />
                <span className="text-gray-500 text-sm">result/s</span>
            </div>
            
            <table className="w-full text-sm text-left text-gray-500 shadow-md">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border border-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <>
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()} // Fix: Direct call to sorting handler
                                        className="py-3 px-6 cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <span className="ml-2">
                                                {/* Sorting indicator */}
                                                {header.column.getIsSorted() === 'asc' ? (
                                                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                ) : header.column.getIsSorted() === 'desc' ? (
                                                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="ml-1 w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                )}
                                            </span>
                                        </div>
                                    </th>

                                    <th className="px-6 py-3">Actions</th>
                                </>
                            ))}
                        </tr>
                    ))}
                </thead>
                <AnimatePresence mode="wait">
                    <motion.tbody
                        key={currentPage} // use currentPage as key to trigger re-render on page change
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="bg-white border-b hover:bg-gray-200 transition-colors duration-150"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <>
                                    <td key={cell.id} className="px-6 py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>

                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <>
                                            <button className="bg-customSubmit text-white px-4 py-2 rounded-md mr-2">Save</button>
                                            <button className="bg-customCancel text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                                        </>
                                    </td>
                                    </>
                                ))}
                            </tr>
                        ))}
                    </motion.tbody>
                </AnimatePresence>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-3">
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                        onClick={() => {
                            setPageIndex(0);
                            table.setPageIndex(0)
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        First
                    </button>
                    <button
                        className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                        onClick={() => {
                            const previousPage = table.getState().pagination.pageIndex - 1;
                            setPageIndex(previousPage);
                            table.previousPage();
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                        onClick={() => {
                            const nextPage = table.getState().pagination.pageIndex + 1;
                            setPageIndex(nextPage);
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <button
                        className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        Last
                    </button>
                </div>

                {/* Display current page and total pages */}
                <div className="text-xs font-medium text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
            </div>
        </>
    );
};

export default ReusableTable;
