import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'discountType',
        header: 'Discount Type',
    },
    {
        accessorKey: 'discountPercent',
        header: 'Discount Percent'
    },
    {
        accessorKey: 'amount',
        header: 'Discount Amount'
    },
    {
        accessorKey: 'discountCode',
        header: 'Discount Code'
    },
    {
        accessorKey: 'gradeLevelId.gradeLevel',
        header: 'Grade Level'
    },
    {
        accessorKey: 'sessionId.startYear',
        header: 'Session'
    },
    {   
        header: 'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Discount = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/discounts`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);



    const [updateDiscount,setUpdateDiscount] = useState(false);
    const [discountId,setDiscountId] = useState('');

    const [newDiscountType,setNewDiscountType] = useState('');
    const [newDiscountPercentage,setNewDiscountPercentage] = useState(0);
    const [newAmount,setNewAmount] = useState(0);
    const [newDiscountCode,setNewDiscountCode] = useState('');
    const [newSchoolYear,setNewSchoolYear] = useState('');
    const [newGradeLevel,setNewGradeLevel] = useState('');

    const [discountType,setDiscountType] = useState('');
    const [discountPercentage,setDiscountPercentage] = useState(0);
    const [amount,setAmount] = useState(0);
    const [discountCode,setDiscountCode] = useState('');
    const [schoolYear,setSchoolYear] = useState('');
    const [gradeLevel,setGradeLevel] = useState('');

    const currentUserId = localStorage.getItem('id');
    const session = localStorage.getItem('session');

    const enableEditDiscount = (record) => {
        setUpdateDiscount(!updateDiscount);
        setDiscountId(record._id);
        setNewDiscountType(record.discountType);
        setNewDiscountPercentage(record.discountPercent);
        setNewAmount(record.amount);
        setNewDiscountCode(record.discountCode);
        setNewSchoolYear(record.sessionId?._id);
        setNewGradeLevel(record.gradeLevelId?._id);
    }

    const updateNewDiscount = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/discount/${id}`,{ newDepartment,currentUserId });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
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
                progress: undefined,
                theme: "light"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        }
    }      

    const deleteDiscount = async (id) => {
        try {
            const removeDiscount = await axios.delete(`${baseUrl()}/discount/${id}`);
            toast.success(removeDiscount.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
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
            const newDiscount = await axios.post(`${baseUrl()}/discount`,{ discountType,discountCode,discountPercentage,amount,schoolYear,gradeLevel,inputter: currentUserId });
            toast.success(newDiscount.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Discount</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addDiscount} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Discount</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput('discount type','Discount Type',setDiscountType,'text')}
                    {renderInput('discount percentage','Discount Percentage',setDiscountPercentage,'number')}
                    {renderInput('discount amount','Discount Amount',setAmount,'number')}
                    {renderInput('discount code','Discount Code',setDiscountCode,'text')}
                    {renderSelect('gradeLevel','Grade Level',setGradeLevel,gradeLevels,'grade level')}
                    {renderSelect('session','School Year',setSchoolYear,schoolYears,'school year')}
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                { columns?.map((column,key) => (
                                    <th key={key} scope="col" className="px-6 py-3">
                                        { column.header }
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            { records?.map(record => (
                                <tr key={record._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    { updateDiscount && (discountId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newDiscountType} onChange={(e) => setNewDiscountType(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="number" value={newDiscountPercentage} onChange={(e) => setNewDiscountPercentage(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newDiscountCode} onChange={(e) => setNewDiscountCode(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewGradeLevel(e.target.value)}>
                                                <option hidden>{ record?.gradeLevelId ? record?.gradeLevelId?.gradeLevel : 'Select Grade Level' }</option>
                                                { gradeLevels?.map(gradeLevel => (
                                                    <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                                                )) }
                                            </select>
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewSchoolYear(e.target.value)}>
                                                <option hidden>{ record?.sessionId ? `${record?.sessionId?.startYear.split('-')[0]}-${record?.sessionId?.endYear.split('-')[0]}` : 'Select School Year' }</option>
                                                { schoolYears?.map(schoolYear => (
                                                    <option key={schoolYear._id} value={schoolYear._id}>{`${record?.sessionId?.startYear.split('-')[0]}-${record?.sessionId?.endYear.split('-')[0]}`}</option>
                                                )) }
                                            </select>                                        
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter.username }
                                        </td>
                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.discountType }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.discountPercent * 100 }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.amount }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.discountCode }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.gradeLevelId.gradeLevel }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.sessionId.startYear.split('-')[0] }-{ record.sessionId.endYear.split('-')[0] }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </th>
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateDiscount && (discountId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewDiscount(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditDiscount(!updateDiscount)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditDiscount(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteDiscount(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </>
                                        }
                                        
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Discount;

const renderInput = (label,value,onChange,inputType) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{value}</label>
        <input className="outline-none p-1 rounded-md border border-gray-300" type={inputType} onChange={(e) => onChange(e.target.value)} />
    </div>
)

const renderSelect = (label,value,onChange,options,placeholder) => (
    <div className="flex flex-col mt-2">
        <label className="text-sm" htmlFor={label}>{value}</label>
        <select 
            className="outline-none p-1 rounded-md border border-gray-300"
            onChange={(e) => onChange(e.target.value)}
        >
            <option hidden>Select {placeholder}</option>
            { options?.map(option => (
                <option key={option._id} value={option._id}>
                    { label === 'session' ? `${option.startYear.split('-')[0]}-${option.endYear.split('-')[0]}` : option[label]}
                </option>
            )) }
        </select>
    </div>
)