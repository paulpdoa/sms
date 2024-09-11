import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from '../../baseUrl';
import { useState, useContext, useEffect } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import TabActions from "../../components/TabActions";
import axios from 'axios';

const TeacherStudentAttendance = () => {
    const { currentUserId, searchQuery, session } = useContext(MainContext);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());    // Default to current year
    const [daysInMonth, setDaysInMonth] = useState(30); // Default to 30 days
    const [attendanceData, setAttendanceData] = useState({}); // Track attendance inputs

    const { records } = useFetch(`${baseUrl()}/teacher-student-attendance/${currentUserId}?month=${selectedMonth}&&year=${selectedYear}`);


    // Function to get the number of days in a given month and year
    const calculateDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    useEffect(() => {
        const fetchStudentsAttendance = async() => {
            try {

            } catch(err) {
                console.log(err);
            }
        }
        fetchStudentsAttendance();
    },[selectedMonth,selectedYear])

    // Update days in month whenever the month or year changes
    useEffect(() => {
        setDaysInMonth(calculateDaysInMonth(selectedMonth, selectedYear));
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        // Initialize attendanceData based on fetched records
        console.log(records?.attendanceData);
        if (records?.attendanceData) {
            const initializedData = {};
            records.attendanceData.forEach(record => {
                const studentId = record.studentId;
                const dayKey = `day${new Date(record.dateToday).getDate()}`;
                

                if (!initializedData[studentId]) {
                    initializedData[studentId] = {};
                }
                
                initializedData[studentId][dayKey] = record.remarks;
            });
            setAttendanceData(initializedData);
        }
    }, [records]);

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handleAttendanceChange = (studentId, day, value) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [day]: value
            }
        }));
    };

    const mainColumns = [
        { accessorKey: 'fullName', header: 'Full Name' },
    ];

    // Dynamically generate columns based on the days in the selected month
    for (let i = 1; i <= daysInMonth; i++) {
        mainColumns.push({
            accessorKey: `day${i}`,
            header: `${selectedMonth}/${i}`,
            editable: true
        });
    }

    const mainStudentData = records?.teacherStudentLists?.map(student => ({
        ...student,
        fullName: `${student.studentId.firstName} ${student.studentId.middleName} ${student.studentId.lastName}`
    }));

    const submitAttendance = async () => {
        try {
            const { data } = await axios.post(`${baseUrl()}/teacher-student-attendance`, {
                attendanceData,
                selectedMonth,
                selectedYear,
                sessionId: session,
                inputter: currentUserId
            });
    
            setAttendanceData(prev => ({
                ...prev,
                ...attendanceData
            }));
    
            alert('Attendance successfully submitted!');
        } catch (err) {
            console.log(err);
            alert('Error submitting attendance');
        }
    };

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.teacherName}!</h1>
            </header>

            <section className="px-4 mt-5 w-full">
                <TabActions title="Students Attendance" noView={true} />
                
                {/* Month and Year Selectors */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white shadow-md p-4 rounded-lg w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center">
                        <label htmlFor="month" className="mr-2 font-semibold text-gray-700">Select Month: </label>
                        <select 
                            id="month" 
                            value={selectedMonth} 
                            onChange={handleMonthChange} 
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    {new Date(0, i).toLocaleString('en', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-col md:flex-row md:items-center">
                        <label htmlFor="year" className="mr-2 font-semibold text-gray-700">Select Year: </label>
                        <input
                            id="year"
                            type="number"
                            value={selectedYear}
                            onChange={handleYearChange}
                            min="2000"
                            max="2100"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div> 

                <button
                    onClick={submitAttendance}
                    className="bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded-md text-sm my-2"
                >
                    Submit Attendance
                </button>

                {/* Attendance Table */}
                <div className="overflow-x-auto shadow-md rounded-lg w-full">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {mainColumns.map((column, idx) => (
                                    <th
                                        key={idx}
                                        className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mainStudentData?.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    {mainColumns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700"
                                        >
                                            {column.accessorKey === 'fullName' ? (
                                                row[column.accessorKey] || ""
                                            ) : (
                                                <select
                                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    value={attendanceData?.[row.studentId._id]?.[`day${colIndex}`] || ""}
                                                    onChange={(e) => handleAttendanceChange(row.studentId._id, `day${colIndex}`, e.target.value)}
                                                >
                                                    <option value="" hidden>Select</option>
                                                    <option value="Present">Present</option>
                                                    <option value="Absent">Absent</option>
                                                    <option value="Late">Late</option>
                                                    <option value="Excused">Excused</option>
                                                </select>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default TeacherStudentAttendance;
