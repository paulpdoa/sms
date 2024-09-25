import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from '../../components/MasterTable';
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const PaymentTerm = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/payment-terms`);
    
    const [term,setTerm] = useState('');
    const [installmentBy,setInstallmentBy] = useState(0);
    const [payEvery,setPayEvery] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [errors,setErrors] = useState({ term: '', installmentBy: '', payEvery: '' });

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

    const { currentUserId, role, searchQuery, setShowForm,showForm,session } = useContext(MainContext);


    const updateNewPaymentTerm = async (id,updatedData) => {

        try {
            const newData = await axios.patch(`${baseUrl()}/payment-term/${id}`,{ newTerm: updatedData.term,newPayEvery: updatedData.payEvery,newInstallmentBy: updatedData.installmentBy,currentUserId,role,sessionId: session });
            enqueueSnackbar(newData.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating payment term record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }


    const deletePaymentTerm = async (id) => {
        try {
            const removePaymentTerm = await axios.put(`${baseUrl()}/payment-term/${id}`,{ role, recordStatus: 'Deleted' });
            enqueueSnackbar(removePaymentTerm.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting payment term record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const addPaymentTerm = async (e) => {
        e.preventDefault();

        if(!term) {
            setErrors(prev => ({...prev,term: 'Term cannot be empty'}));
            return enqueueSnackbar('Term is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ term: '' });
                }
            });
        }

        if(!payEvery) {
            setErrors(prev => ({...prev,payEvery: 'Pay every cannot be empty'}));
            return enqueueSnackbar('Pay every is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ payEvery: '' });
                }
            });
        }
        if(!installmentBy) {
            setErrors(prev => ({...prev,installmentBy: 'Installment by every cannot be empty'}));
            return enqueueSnackbar('Installment by is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ installmentBy: '' });
                }
            });
        }

        try {
            const newPaymentTerm = await axios.post(`${baseUrl()}/payment-term`,{ term,payEvery,installmentBy,inputter: currentUserId,role,sessionId: session });
            enqueueSnackbar(newPaymentTerm.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding payment term record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
    }));


    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Payment Terms</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="term">Term</label>
            <input
                placeholder="Enter a term(ex. Installment, Quarterly)"
                onChange={(e) => setTerm(e.target.value)}
                className={`outline-none p-1 rounded-md border ${errors.term ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
            />
            { errors.term && <span className="text-xs text-red-500">{errors.term}</span> }
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="pay every">Pay Every</label>
            <input
                placeholder="Enter a payment(ex. 1, 3, 6, 12)"
                onChange={(e) => setPayEvery(e.target.value)}
                className={`outline-none p-1 rounded-md border ${errors.payEvery ? 'border-red-500' : 'border-gray-300'}`}
                type="number"
            />
            { errors.payEvery && <span className="text-xs text-red-500">{errors.payEvery}</span> }
            {/* <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setPayEvery(e.target.value)}>
                <option hidden>Select pay every term</option>
                <option value={1}>1 month</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
            </select> */}
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="installment by">Installment By</label>
            <input
                placeholder="Enter a term(ex. 10, 4, 2, 1)"
                onChange={(e) => setInstallmentBy(e.target.value)}
                className={`outline-none p-1 rounded-md border ${errors.installmentBy ? 'border-red-500' : 'border-gray-300'}`}
                type="number"
            />
            { errors.installmentBy && <span className="text-xs text-red-500">{errors.installmentBy}</span> }
            {/* <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setInstallmentBy(e.target.value)}>
                <option hidden>Select installment by term</option>
                <option value={10}>10 terms</option>
                <option value={4}>4 terms</option>
                <option value={2}>2 terms</option>
                <option value={1}>1 term</option>
            </select> */}
        </div>

       
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Payment Terms" />


            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addPaymentTerm,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        onUpdate={updateNewPaymentTerm}
                        onDelete={deletePaymentTerm}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default PaymentTerm