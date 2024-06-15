import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'terms',
        header: 'Terms',
    },
    {
        accessorKey: 'payEvery',
        header: 'Pay Every(months)'
    },
    {
        accessorKey: 'installmentBy',
        header: 'Installment By'
    },
    {
        accessorKey: 'inputter',
        header: 'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const PaymentSchedule = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/payment-terms`);
    
    const [term,setTerm] = useState('');
    const [installmentBy,setInstallmentBy] = useState(0);
    const [payEvery,setPayEvery] = useState(0);
    
    const [updatePaymentTerm,setUpdatePaymentTerm] = useState(false);
    const [paymentTermId,setPaymentTermId] = useState('');
    const [newTerm,setNewTerm] = useState('');
    const [newInstallmentBy,setNewInstallmentBy] = useState('');
    const [newPayEvery,setNewPayEvery] = useState('');

    const enableEditPaymentTerm = (record) => {
        setUpdatePaymentTerm(!updatePaymentTerm);
        setPaymentTermId(record._id);
        setNewTerm(record.term);
        setNewInstallmentBy(record.installmentBy);
        setNewPayEvery(record.payEvery);
    }

    const currentUserId = localStorage.getItem('id');

    const updateNewPaymentTerm = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/payment-term/${id}`,{ newTerm,newPayEvery,newInstallmentBy,currentUserId });
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


    const deletePaymentTerm = async (id) => {
        try {
            const removePaymentTerm = await axios.delete(`${baseUrl()}/payment-term/${id}`);
            toast.success(removePaymentTerm.data.mssg, {
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

    const addPaymentTerm = async (e) => {
        e.preventDefault();
        try {
            const newPaymentTerm = await axios.post(`${baseUrl()}/payment-term`,{ term,payEvery,installmentBy,inputter: currentUserId });
            toast.success(newPaymentTerm.data.mssg, {
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

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Payment Schedule</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addPaymentTerm} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add Payment Schedule</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="term">Term</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setTerm(e.target.value)}>
                            <option hidden>Select installment term</option>
                            <option value="Installment">Installment</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Semi-annual">Semi-Annual</option>
                            <option value="Annually">Annually</option>
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="pay every">Pay Every</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setPayEvery(e.target.value)}>
                            <option hidden>Select pay every term</option>
                            <option value={1}>1 month</option>
                            <option value={3}>3 months</option>
                            <option value={6}>6 months</option>
                            <option value={12}>12 months</option>
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="installment by">Installment By</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setInstallmentBy(e.target.value)}>
                            <option hidden>Select installment by term</option>
                            <option value={10}>10 terms</option>
                            <option value={4}>4 terms</option>
                            <option value={2}>2 terms</option>
                            <option value={1}>1 term</option>
                        </select>
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
                                    { updatePaymentTerm && (paymentTermId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            <input type="text" value={newPayEvery} onChange={(e) => setNewPayEvery(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            <input type="text" value={newInstallmentBy} onChange={(e) => setNewInstallmentBy(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </td>
                                        </>  
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.term} 
                                        </th>     
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.payEvery }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.installmentBy }
                                        </th>  
                                        <th scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </th>  
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updatePaymentTerm && (paymentTermId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewPaymentTerm(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditPaymentTerm(!updatePaymentTerm)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditPaymentTerm(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deletePaymentTerm(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default PaymentSchedule