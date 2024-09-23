import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';

const StudentAttendance = () => {

    const { currentUserId,searchQuery,dateFormatter } = useContext(MainContext);

    const [date,setDate] = useState('');

    const { records } = useFetch(`${baseUrl()}/student-attendance/${currentUserId}?currentDate=${date}`);

    const attendanceData = records?.attendance?.map((student) => ({
        ...student,
        date: dateFormatter(student.dateToday)
    }));
    const attendanceColumn = [
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'remarks', header: 'Remarks' },
        { accessorKey: 'comment', header: 'Comment' } 
    ];

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.studentName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                
                <div className="flex justify-between items-center">
                    <TabActions title="My Attendance" noView={true} />
                    <div className="flex gap-2 items-center justify-between">
                        <input 
                            type="date" 
                            value={date || new Date().toISOString().split('T')[0]}
                            className="p-2 border-gray-300 border rounded-md outline-none focus:ring-2 focus:ring-customView"    
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <MasterTable 
                    columns={attendanceColumn}
                    data={attendanceData ?? []}
                    searchQuery={searchQuery}
                    disableAction={true}
                    // viewRecord={viewMyPaymentSchedule}
                />
            </section>
        </main>
    )
}

export default StudentAttendance;