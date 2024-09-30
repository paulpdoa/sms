import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../components/MasterTable";
import { MainContext } from "../helpers/MainContext";
import TabActions from '../components/TabActions';
import MasterDataForm from "../components/MasterDataForm";
import { useSnackbar } from 'notistack';
import Dropdown from 'react-dropdown-select';

const Discount = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/discounts`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);

    const { session, currentUserId, role, searchQuery, showForm, setShowForm } = useContext(MainContext);

    const { enqueueSnackbar } = useSnackbar();

    const [errors,setErrors] = useState({ discountType: '', discountCode: '' });

    const [discountType, setDiscountType] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [amount, setAmount] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [gradeLevel, setGradeLevel] = useState([]);

    console.log(gradeLevel);

    const categories = [
        { _id: 'GA', discountCode: 'GA' },
        { _id: 'PT', discountCode: 'PT' },
        { _id: 'SA', discountCode: 'SA' }
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
        }
    ];

    const updateNewDiscount = async (id, updatedData) => {

        // Also add validation here to not accept incorrect values
        if (updatedData.discountType === '') {
            enqueueSnackbar("Discount type is not provided", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
           
            return;
        }

        if (updatedData.amount !== null && updatedData.amount < 0) {
            enqueueSnackbar("Discount amount cannot be negative", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
            return;
        }

        if (updatedData.discountPercent < 0) {
            enqueueSnackbar("Discount percentage cannot be negative", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
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
                role,
                sessionId: session
            });
            enqueueSnackbar(newData.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating discount record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    const deleteDiscount = async (id) => {
        try {
            const removeDiscount = await axios.put(`${baseUrl()}/discount/${id}`, { role,recordStatus: 'Deleted' });
            enqueueSnackbar(removeDiscount.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating deleting record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
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

        
        if (!discountType) {
            setErrors(prev => ({ ...prev, discountType: 'Discount type cannot be empty' }));
            enqueueSnackbar("Discount type is not provided", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ discountType: '' });
                }
            });
            return;
        }

        if (!discountCode) {
            setErrors(prev => ({ ...prev, discountCode: 'Discount code cannot be empty' }));

            enqueueSnackbar("Discount code is not provided", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ discountCode: '' });
                }
            });
            return;
        }

        if (amount !== null && amount < 0) {
            enqueueSnackbar("Discount amount cannot be negative", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
            return;
        }

        if (discountPercentage < 0) {
            enqueueSnackbar("Discount percentage cannot be negative", { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
            return;
        }

        try {
            const newDiscount = await axios.post(`${baseUrl()}/discount`, discountInfo);
            enqueueSnackbar(newDiscount.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding new discount record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        gradeLevel: {
            gradeLevel: record?.gradeLevelId?.gradeLevel ?? 'Not Assigned',
            _id: record?.gradeLevelId?._id
        },
        // session: {
        //     session: record?.sessionId?.startYear,
        //     _id: record?.sessionId?._id
        // },
        amount: record.amount ?? 0
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Discount</h1>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pass the correct label value */}
                {renderInput('discountType', discountType, 'Discount Type', setDiscountType, 'text', {}, '', errors)}
                {renderInput('discountPercentage', discountPercentage, 'Discount Percentage', setDiscountPercentage, 'number', { step: "0.000001" }, '', errors)}
                {renderInput('amount', amount, 'Discount Amount', setAmount, 'number', { step: "0.000001" }, '', errors)}
                {renderSelect('discountCode', 'Discount Category', setDiscountCode, categories, 'Select discount code   ', false, errors)}
                {/* {renderSelect('gradeLevel', 'Grade Level', setGradeLevel, gradeLevels, 'Select grade level', false, errors)} */}
                
                <div className="flex flex-col mt-2">
                    <label className="text-sm" htmlFor='gradelevel'>Grade Level</label>
                    <Dropdown
                        onChange={(selectedItems) => {
                            const ids = selectedItems.map(item => item._id);
                            setGradeLevel(ids);
                        }}
                        options={gradeLevels}
                        valueField="_id"
                        labelField="gradeLevel"
                        multi={true}
                        placeholder="Select grade level"
                    />
                    {/* {errors[label] && <span className="text-xs text-red-500">{errors[label]}</span>} */}
                </div>
            </div>
        </>
    );
    

    return (
        <main className="p-2 relative">
            <TabActions title="Discounts" />
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
        </main>
    );
};

export default Discount;

const renderInput = (label, value, description, onChange, inputType, extraProps = {}, placeholder, errors) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{description}</label>
        <input
            id={label}  // ensure the input has the correct id
            placeholder={placeholder}
            className={`outline-none p-1 rounded-md border ${errors[label] ? 'border-red-500' : 'border-gray-300'}`}
            type={inputType}
            onChange={(e) => onChange(inputType === 'number' ? parseFloat(e.target.value) : e.target.value)}
            {...extraProps}
            value={value}
        />
        {errors[label] && <span className="text-xs text-red-500">{errors[label]}</span>}
    </div>
);

const renderSelect = (label, description, onChange, options, placeholder, required = false, errors) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{description}</label>
        <select
            id={label}  // ensure the select has the correct id
            className={`outline-none p-1 rounded-md border ${errors[label] ? 'border-red-500' : 'border-gray-300'}`}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>
                    {option.discountCode || option.gradeLevel}
                </option>
            ))}
            {/* { (label !== 'discountType' || label !== 'discountCode') && <option value="">N/A</option> } */}
        </select>
        {errors[label] && <span className="text-xs text-red-500">{errors[label]}</span>}
    </div>
);


