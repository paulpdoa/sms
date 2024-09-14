import { useState, useEffect,useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import { RiCloseLargeFill } from "react-icons/ri";
import axios from "axios";
import MasterTable from '../../MasterTable';
import { MainContext } from '../../../helpers/MainContext';
import { FaLaptopHouse } from 'react-icons/fa';

const StudentAssistance = ({ id, closeModal }) => {
    const { records: student } = useFetch(`${baseUrl()}/student/${id}`);
    const { records: discounts } = useFetch(`${baseUrl()}/discounts`);
    const { records: initialStudentDiscounts } = useFetch(`${baseUrl()}/student-discount/student/${id}`);
    
    const columns = [
        { accessorKey: 'schoolYear', header: 'School Year' },
        { accessorKey: 'studentNo', header: 'Student No' },
        { accessorKey: 'discountType', header: 'Discount Type' },
        { accessorKey: 'discountPercent', header: 'Discount Percent' },
        { accessorKey: 'amount', header: 'Amount' },
        { accessorKey: 'discount', header: 'Discount' }
    ];

    const [discountId, setDiscountId] = useState('');
    const [sortedField, setSortedField] = useState(null);
    const [sortedOrder, setSortedOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [studentDiscounts, setStudentDiscounts] = useState([]);
    const [paginatedDiscounts, setPaginatedDiscounts] = useState([]);

    const { currentUserId,session: currentSession,searchQuery } = useContext(MainContext);

    useEffect(() => {
        setStudentDiscounts(initialStudentDiscounts);
    }, [initialStudentDiscounts]);

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        let currentItems = [...studentDiscounts];

        if (sortedField !== null) {
            currentItems.sort((a, b) => {
                if (a[sortedField] < b[sortedField]) {
                    return sortedOrder === 'asc' ? -1 : 1;
                }
                if (a[sortedField] > b[sortedField]) {
                    return sortedOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setPaginatedDiscounts(currentItems.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, studentDiscounts, sortedField, sortedOrder, itemsPerPage]);

    const handleSorting = (field) => {
        const order = field === sortedField && sortedOrder === 'asc' ? 'desc' : 'asc';
        setSortedField(field);
        setSortedOrder(order);
    };

    const submitInfo = async (e) => {
        e.preventDefault();

        const studentDiscount = {
            sessionId: currentSession,
            studentId: id,
            discountId,
            inputter: currentUserId
        };
        
        try {
            const response = await axios.post(`${baseUrl()}/student-discount`, studentDiscount);
            const newDiscount = response.data;
            setStudentDiscounts(prevDiscounts => [...prevDiscounts, newDiscount]);
            toast.success(newDiscount.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            
            setTimeout(() => {
                closeModal(false)
            },2000)
        } catch (err) {
            toast.error('Failed to submit discount information.',{
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            console.log(err);
        }
        
    };

    const renderTableHeader = () => {
        return columns.map((column) => (
            <th
                key={column.accessorKey}
                onClick={() => handleSorting(column.accessorKey)}
                className="px-6 py-3 cursor-pointer text-gray-300"
            >
                {column.header}
                {sortedField === column.accessorKey ? (sortedOrder === 'asc' ? ' 🔼' : ' 🔽') : ''}
            </th>
        ));
    };

    const deleteStudentDiscount = async (id) => {
        try {
            const data = await axios.delete(`${baseUrl()}/student-discount/${id}`);
            const newDiscount = data.data;
            setStudentDiscounts(prevDiscounts => prevDiscounts.filter(discount => discount._id !== id));
            toast.success(newDiscount.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        } catch(err) {
            console.log(err);
        }
    }

    const renderTableRows = () => {
        return paginatedDiscounts.map((discount) => (
            <tr key={discount._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4">{discount.sessionId?.startYear.split('-')[0]}-{discount.sessionId?.endYear.split('-')[0]}</td>
                <td className="px-6 py-4">{discount.studentId?.studentNo ?? 'Not Assigned'}</td>
                <td className="px-6 py-4">{discount?.discountId?.discountType ?? 'Not Assigned'}</td>
                <td className="px-6 py-4">{discount?.discountId?.discountPercent ?? 'Not Assigned'}</td>
                <td className="px-6 py-4">{discount?.discountId?.amount ?? 'Not Assigned'}</td>
                <td className="px-6 py-4">{discount?.discount}</td>
                <td className="px-6 py-4 flex gap-2 items-center">
                    <button
                        onClick={() => deleteStudentDiscount(discount._id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => updateStudentDiscount(discount._id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        ));
    };

    const totalPages = Math.ceil(studentDiscounts.length / itemsPerPage);

    const discountLists = paginatedDiscounts?.map(disc => ({
        ...disc,
        schoolYear: disc.sessionId?.startYear.split('-')[0] + '-' + disc.sessionId?.endYear.split('-')[0],
        studentNo: disc?.studentId?.studentNo ?? 'Not Assigned',
        discountType: disc?.discountId?.discountType ?? 'Not Assigned',
        discountPercent: disc?.discountId?.discountPercent ?? 'Not Assigned',
        amount: disc?.discountId?.amount ?? 'Not Assigned',
        discount: disc?.discount ?? 'Not Assigned'
    })) 

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="relative bg-white w-full max-w-6xl p-6 rounded-lg shadow-lg h-auto overflow-y-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-700">{student?.firstName} {student?.lastName} Discount Information</h1>
                    <RiCloseLargeFill className="text-3xl text-red-400 cursor-pointer" onClick={() => closeModal(false)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    {renderSelect('discountType', 'Assistance Type', setDiscountId, discounts)}
                </div>

                {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="bg-gray-600 text-white">
                            {renderTableHeader()}
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows()}
                    </tbody>
                </table> */}
                {/* 
                <div className="flex justify-between items-center mt-4 text-sm">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 bg-gray-300 rounded-md"
                    >
                        First
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 bg-gray-300 rounded-md"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 bg-gray-300 rounded-md"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 bg-gray-300 rounded-md"
                    >
                        Last
                    </button>
                </div> */}

                <MasterTable 
                    data={discountLists}
                    columns={columns}
                    searchQuery={searchQuery}
                    onDelete={deleteStudentDiscount}
                />

                <div className="flex gap-2 items-center justify-end mt-5 absolute bottom-5 right-5">
                    <button onClick={submitInfo} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-opacity-50">
                        Submit
                    </button>
                    <button className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={() => closeModal(false)}>
                        Close
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default StudentAssistance;

const renderSelect = (label, placeholder, onChange, options) => (
    <div className="flex flex-col">
        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor={label}>{placeholder}</label>
        <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => onChange(e.target.value)}
        >
            <option hidden>{`Select ${placeholder}`}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>{option[label]}</option>
            ))}
        </select>
    </div>
);
