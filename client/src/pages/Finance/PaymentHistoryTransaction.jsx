import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import Warning from '../../components/Warning';
import { jsPDF } from "jspdf";
import { useSnackbar } from "notistack";

const PaymentHistoryTransaction = () => {

    const { records } = useFetch(`${baseUrl()}/finance-payment-history/${currentUserId}`);

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>
        
        </main>
    )
}

export default PaymentHistoryTransaction;