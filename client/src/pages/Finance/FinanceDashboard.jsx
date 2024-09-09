import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState, useEffect } from 'react';
import { MainContext } from '../../helpers/MainContext';


const FinanceDashboard = () => {

    const { currentUserId } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/finance-dashboard/${currentUserId}`);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            

        </main>
    )
}

export default FinanceDashboard;