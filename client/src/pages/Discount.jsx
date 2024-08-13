import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../components/MasterTable";
import { MainContext } from "../helpers/MainContext";
import TabActions from '../components/TabActions';
import MasterDataForm from "../components/MasterDataForm";

const Discount = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/discounts`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);

    const { session, currentUserId, role, searchQuery, showForm, setShowForm } = useContext(MainContext);

    const [discountType, setDiscountType] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [amount, setAmount] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');

    const categories = [
        { _id: 1, discountCode: 'GA' },
        { _id: 2, discountCode: 'PT' },
        { _id: 3, discountCode: 'SA' }
    ];

    const columns = [
        {
            accessorKey: 'discountType',
            header: 'Discount Type',
            editable: true
        },
        {
            accessorKey: 'discountPercent',
            header: 'Discount Percent',
            editable: true
        },
        {
            accessorKey: 'amount',
            header: 'Discount Amount',
            editable: true
        },
        {
            accessorKey: 'discountCode',
            header: 'Discount Category',
            editable: true,
            selectOptions: ['GA','SA','PT'].map(dc => ({ value: dc, label: dc }))
        },
        {
            accessorKey: 'gradeLevel.gradeLevel',
            header: 'Grade Level',
            editable: true,
            selectOptions: gradeLevels?.map(gl => ({ value: gl._id, label: gl.gradeLevel }))
        },
        {
            accessorKey: 'session.session',
            header: 'Session'
        }
    ];

    const updateNewDiscount = async (id, updatedData) => {

        // Also add validation here to not accept incorrect values
        if (updatedData.discountType === '') {
            toast.error("Discount type is not provided", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }

        if (updatedData.amount !== null && updatedData.amount < 0) {
            toast.error("Discount amount cannot be negative", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }

        if (updatedData.discountPercent < 0) {
            toast.error("Discount percentage cannot be negative", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }

        try {
            const newData = await axios.patch(`${baseUrl()}/discount/${id}`, {
                gradeLevelId: updatedData.gradeLevel._id,
                discountType: updatedData.discountType,
                discountPercent: updatedData.discountPercent,
                amount: updatedData.amount,
                discountCode: updatedData.discountCode,
                inputter: currentUserId,
                role
            });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    };

    const deleteDiscount = async (id) => {
        try {
            const removeDiscount = await axios.put(`${baseUrl()}/discount/${id}`, { role,recordStatus: 'Deleted' });
            toast.success(removeDiscount.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    };

    const addDiscount = async (e) => {
        e.preventDefault();
        
        const discountInfo = {
            discountType,
            discountCode,
            discountPercentage,
            amount,
            schoolYear: session,
            gradeLevel,
            inputter: currentUserId,
            role
        } 

        
        if (discountType === '') {
            toast.error("Discount type is not provided", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }

        if (amount !== null && amount < 0) {
            toast.error("Discount amount cannot be negative", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }

        if (discountPercentage < 0) {
            toast.error("Discount percentage cannot be negative", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }
        

        try {
            const newDiscount = await axios.post(`${baseUrl()}/discount`, discountInfo);
            toast.success(newDiscount.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }
    };

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        gradeLevel: {
            gradeLevel: record?.gradeLevelId?.gradeLevel ?? 'Not Assigned',
            _id: record?.gradeLevelId?._id
        },
        session: {
            session: record?.sessionId?.startYear,
            _id: record?.sessionId?._id
        },
        amount: record.amount ?? 0
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Discount</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInput('discount type',discountType,'Discount Type', setDiscountType, 'text')}
                {renderInput('discount percentage',discountPercentage,'Discount Percentage', setDiscountPercentage, 'number', { step: "0.000001" })}
                {/* Not required */}
                {renderInput('discount amount',amount,'Discount Amount', setAmount, 'number', { step: "0.000001" },'Leave this empty if n/a')}
                {renderSelect('discountCode','Discount Category', setDiscountCode, categories, 'Leave this empty if n/a', false)}
                {/* {renderInput('discount code',discountCode,'Discount Category', setDiscountCode, 'text')} */}
                {/* Not Required */}
                {renderSelect('gradeLevel', 'Grade Level', setGradeLevel, gradeLevels, 'Leave this empty if n/a', false)}
                {/* {renderSelect('session', 'School Year', setSchoolYear, schoolYears, 'school year')} */}
            </div>
        </>
    );

    return (
        <main className="p-2 relative">
            <TabActions title="Discount" />
            <div className={`gap-2 mt-5`}>
                {showForm && MasterDataForm(form, addDiscount, setShowForm)}
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithoutInputter}
                        onUpdate={updateNewDiscount}
                        onDelete={deleteDiscount}
                        searchQuery={searchQuery}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default Discount;

const renderInput = (label, value,description, onChange, inputType, extraProps = {}, placeholder) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{description}</label>
        <input
            placeholder={placeholder}
            className={`outline-none p-1 rounded-md border`}
            type={inputType}
            onChange={(e) => onChange(inputType === 'number' ? parseFloat(e.target.value) : e.target.value)}
            {...extraProps}
            value={value}
        />
    </div>
);

const renderSelect = (label, value, onChange, options, placeholder, required = false) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{value}</label>
        <select
            className="outline-none p-1 rounded-md border border-gray-300"
            onChange={(e) => onChange(e.target.value)}
            required={required}
        >
            <option value="" className="text-xs text-gray-200" hidden>{placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>
                    {label === 'session' ? `${option.startYear.split('-')[0]}-${option.endYear.split('-')[0]}` : option[label]}
                </option>
            ))}
            <option value="">N/A</option>
        </select>
    </div>
);
