import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from '../../components/MasterTable';
import { MainContext } from "../../helpers/MainContext";


const PaymentTerm = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/payment-terms`);
    
    const [term,setTerm] = useState('');
    const [installmentBy,setInstallmentBy] = useState(0);
    const [payEvery,setPayEvery] = useState(0);

    const columns = [
        {
            accessorKey: 'term',
            header: 'Terms',
            editable: true
        },
        {
            accessorKey: 'payEvery',
            header: 'Pay Every(months)',
            editable: true,
            selectOptions: [1,3,6,12].map(month => ({ value: month, label: `${month} month/s` }))
        },
        {
            accessorKey: 'installmentBy',
            header: 'Installment By',
            editable: true,
            selectOptions: [1,2,4,10].map(month => ({ value: month, label: `${month} term/s` }))
        }
    ]

    const { currentUserId, role, searchQuery, setSearchQuery } = useContext(MainContext);


    const updateNewPaymentTerm = async (id,updatedData) => {

        console.log(updatedData);
        try {
            const newData = await axios.patch(`${baseUrl()}/payment-term/${id}`,{ newTerm: updatedData.term,newPayEvery: updatedData.payEvery,newInstallmentBy: updatedData.installmentBy,currentUserId,role });
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
            const removePaymentTerm = await axios.delete(`${baseUrl()}/payment-term/${id}`,{ data: { role } });
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
            const newPaymentTerm = await axios.post(`${baseUrl()}/payment-term`,{ term,payEvery,installmentBy,inputter: currentUserId,role });
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

    const recordsWithoutInputter = records.map(record => ({
        ...record,
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Payment Terms</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addPaymentTerm} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Payment Terms</h1>

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

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        onUpdate={updateNewPaymentTerm}
                        onDelete={deletePaymentTerm}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default PaymentTerm