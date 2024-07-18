import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../components/MasterTable";
import { MainContext } from "../helpers/MainContext";
import TabActions from '../components/TabActions';
import MasterDataForm from "../components/MasterDataForm";

const Discount = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/discounts`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);

    const { session,currentUserId,role,searchQuery,showForm,setShowForm } = useContext(MainContext);

    const [discountType,setDiscountType] = useState('');
    const [discountPercentage,setDiscountPercentage] = useState(0);
    const [amount,setAmount] = useState(0);
    const [discountCode,setDiscountCode] = useState('');
    const [gradeLevel,setGradeLevel] = useState('');

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
            editable: true
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
    ]

    const updateNewDiscount = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/discount/${id}`,{ gradeLevelId: updatedData.gradeLevel._id,discountType: updatedData.discountType,discountPercent: updatedData.discountPercent,amount: updatedData.amount,discountCode: updatedData.discountCode,inputter: currentUserId,role });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    }      

    const deleteDiscount = async (id) => {
        try {
            const removeDiscount = await axios.delete(`${baseUrl()}/discount/${id}`,{ data: { role } });
            toast.success(removeDiscount.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
        }
    }

    const addDiscount = async (e) => {
        e.preventDefault();
        try {
            const newDiscount = await axios.post(`${baseUrl()}/discount`,{ discountType,discountCode,discountPercentage,amount,schoolYear: session,gradeLevel,inputter: currentUserId,role });
            toast.success(newDiscount.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        gradeLevel: {
            gradeLevel: record?.gradeLevelId?.gradeLevel,
            _id: record?.gradeLevelId?._id
        },
        session: {
            session: record?.sessionId?.startYear,
            _id: record?.sessionId?._id
        }
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-green-500">Add New Discount</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('discount type','Discount Type',setDiscountType,'text')}
            {renderInput('discount percentage','Discount Percentage',setDiscountPercentage,'number',true,{ step: "0.01" })}
            {renderInput('discount amount','Discount Amount',setAmount,'number',{ step: "0.01" },null,'Leave this empty if n/a')}
            {renderInput('discount code','Discount Category',setDiscountCode,'text',true)}
            {renderSelect('gradeLevel','Grade Level',setGradeLevel,gradeLevels,'grade level','Leave this empty if n/a')}
            {/* {renderSelect('session','School Year',setSchoolYear,schoolYears,'school year')} */}
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Discount" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addDiscount,setShowForm) }

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
    )
}

export default Discount;

const renderInput = (label,value,onChange,inputType,required = false, extraProps = {},placeholder) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{value}</label>
        <input placeholder={placeholder} required={required} className="outline-none p-1 rounded-md border border-gray-300" type={inputType} onChange={(e) => onChange(e.target.value)} { ...extraProps } />
    </div>
)

const renderSelect = (label,value,onChange,options,placeholder, required = false) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{value}</label>
        <select 
            className="outline-none p-1 rounded-md border border-gray-300"
            onChange={(e) => onChange(e.target.value)}
            
        >
            <option value="" className="text-xs text-gray-200" hidden>Leave this empty if n/a</option>
            { options?.map(option => (
                <option key={option._id} value={option._id}>
                    { label === 'session' ? `${option.startYear.split('-')[0]}-${option.endYear.split('-')[0]}` : option[label]}
                </option>
            )) }
        </select>
    </div>
)