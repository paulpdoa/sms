
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import { useSnackbar } from "notistack";


const ParentChildAttendance = () => {

    const { currentUserId,searchQuery, dateFormatter } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const [currentChild,setCurrentChild] = useState('');
    const [date,setDate] = useState('');

   
    const { records } = useFetch(`${baseUrl()}/parent-child-attendance/${currentUserId}?currentDate=${date}`);
    const attendanceData = records?.studentsAttendance?.filter(student => student.studentId._id === currentChild)?.map((student) => ({
        ...student,
        date: dateFormatter(student.dateToday)
    }))
    const attendanceColumn = [
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'remarks', header: 'Remarks' },
        { accessorKey: 'comment', header: 'Comment' } 
    ];

    const handleStudentAttendance = (id) => {
        setCurrentChild(id);
        enqueueSnackbar('Please select a date to view childs attendance on different days', { 
            variant: 'info',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            autoHideDuration: 4000,
            preventDuplicate: true,
        });
    }

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.parentName}!</h1>
            </header>

            <section className="w-full px-4 mt-5">
                <h2 className="text-2xl font-bold text-gray-700 px-1 mb-2">Select Child to View Attendance</h2>
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                        { records?.students?.map(student => (
                            <button
                                key={student._id}
                                onClick={() => handleStudentAttendance(student._id)}
                                className={`p-2 text-sm rounded-md border transition-all duration-200 focus:ring focus:ring-blue-300
                                    ${currentChild === student._id 
                                        ? 'bg-customView text-white hover:bg-customHighlight' 
                                        : 'bg-white text-customView border-blue-500 hover:bg-blue-500 hover:text-white'}`}
                            >
                                { student.firstName } { student.lastName } 
                            </button>
                        )) }
                    </div>

                    <input 
                        type="date" 
                        value={date || new Date().toISOString().split('T')[0]}
                        className="p-2 border-gray-300 border rounded-md outline-none focus:ring-2 focus:ring-customView"    
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <TabActions title="Students Attendance" noView={true} />
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

export default ParentChildAttendance;