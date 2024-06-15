import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';
import SubmittedReq from "../../components/admission/SubmittedReq";

const columns = [
    {
        accessorKey: 'fullName',
        header: 'Full Name',
    },
    {
        accessorKey: 'admitted',
        header: 'Admitted'
    },
    {
        accessorKey: 'dateAdmitted',
        header: 'Date Admitted'
    },
    {
        accessorKey: 'gradelevel',
        header: 'Grade Level'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Admission = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/students`);

    const admissionPages = ['Student Information','Parents','Sibling','Academic','Submitted Requirements'];
    const [currentPage,setCurrentPage] = useState('Student Information');

    const [currStudRec,setCurrStudRec] = useState('');
    const [enableView,setEnableView] = useState(false);
    
    const [term,setTerm] = useState('');
    const [installmentBy,setInstallmentBy] = useState(0);
    const [payEvery,setPayEvery] = useState(0);
    
    const [updatePaymentTerm,setUpdatePaymentTerm] = useState(false);
    const [paymentTermId,setPaymentTermId] = useState('');
    const [newTerm,setNewTerm] = useState('');
    const [newInstallmentBy,setNewInstallmentBy] = useState('');
    const [newPayEvery,setNewPayEvery] = useState('');

    const enableViewStudentRecord = (record) => {
        // Enable record to be shown in page
        setCurrStudRec(record);
        setEnableView(true);
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
                <h1 className="text-xl text-green-500 font-bold">Admission</h1>
                <Searchbar />
            </div>

            <div className="gap-2 mt-5 flex">
                <div className="p-4 h-fit rounded-lg border border-gray-300 w-auto">
                    <h1 className="font-semibold text-xl text-green-500">{currentPage} { currStudRec && `- ${currStudRec.firstName} ${currStudRec.lastName}'s` } </h1>

                    <div className="flex items-center mt-2"> 
                        { admissionPages.map((page,key) => (
                            <button onClick={() => setCurrentPage(page)} className="text-xs text-green-500 border-2 border-b-0 p-2 rounded-lg" key={key}>{page}</button>
                        )) }
                    </div>

                    {/* Pages for admission */}
                    {/* Should only be visible if view in table is clicked */}
                    { enableView ? 
                        currentPage === 'Submitted Requirements' && <SubmittedReq id={currStudRec._id} />
                        :
                        <h1 className="text-sm text-green-500">Please select view record first in student list</h1>
                    } 
                    {/* Pages for admission */}
                </div>

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
                                            { record.firstName } { record.middleName } { record.lastName }
                                        </th>
                                        <td className="px-6 py-4">
                                            { record?.isAdmitted ? 'Yes' : 'No' }
                                        </td>
                                        <td className="px-6 py-4">
                                            { record?.dateAdmitted ? record.dateAdmitted : 'Not admitted' }
                                        </td>
                                        <td className="px-6 py-4">
                                            { record.nationality?.nationality ? record.nationality.nationality : 'Not Assigned' }
                                        </td>
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        <button onClick={() => enableViewStudentRecord(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
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

export default Admission;