import DateTime from "../components/DateTime";
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';

const Dashboard = () => {
    const sessionId = localStorage.getItem('session'); // School Year id
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${sessionId}`);
    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [studentRegistered, setStudentRegistered] = useState(0);
    const [studentAdmitted, setStudentAdmitted] = useState(0);

    useEffect(() => { // Fetch and count the student records
        if (students) {
            const studentRegisteredCount = students.filter(student => student.isRegistered).length;
            const studentAdmittedCount = students.filter(student => student.isAdmitted).length;

            setStudentRegistered(studentRegisteredCount);
            setStudentAdmitted(studentAdmittedCount);
        }
    }, [students]);

    return (
        <main className="bg-gray-100">
            

            <section className="p-8">
                <div className="flex flex-col items-center justify-center bg-green-300 p-5 rounded-lg shadow-md">
                    <h1 className="text-4xl font-semibold text-green-700 italic text-center">
                        {schoolYear?.schoolTheme ? `"${schoolYear.schoolTheme}"` : 'Admin has not set any theme yet'}
                    </h1>
                    {/* <span className="text-base font-semibold mt-2">
                        {schoolYear?.startYear ? `S.Y ${schoolYear.startYear.split('-')[0]}-${schoolYear.endYear.split('-')[0]}` : 'Please wait'}
                    </span> */}
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                        <CountUp 
                            className="text-3xl font-bold text-blue-600"
                            end={studentRegistered}
                            duration={2}
                        />
                        <h2 className="text-lg font-semibold mt-2">Students Registered</h2>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                        <CountUp 
                            className="text-3xl font-bold text-blue-600"
                            end={studentAdmitted}
                            duration={2}
                        />
                        <h2 className="text-lg font-semibold mt-2">Students Admitted</h2>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Dashboard;
