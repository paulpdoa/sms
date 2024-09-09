import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState, useEffect } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";

const FinancePaymentSchedule = () => {

    const { currentUserId,searchQuery } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/finance-payment-schedule/${currentUserId}`);
    
    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'email', header: 'Email' }
    ];

    const studentData = records?.students?.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`
    }))

    const viewStudentPayments = (studentRecord) => {
        console.log(studentRecord);
    }

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                <TabActions title="Your Payment Schedules" noView={true} />
                <MasterTable 
                    columns={columns}
                    data={studentData || []}
                    searchQuery={searchQuery}
                    viewRecord={viewStudentPayments}
                />
            </section>

        </main>
    )
}

export default FinancePaymentSchedule;