import { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { PiStudentDuotone } from "react-icons/pi";
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import CountUp from 'react-countup';
import { genders as genderSelections } from '../data/genders.json';
import { PiChalkboardTeacherFill } from "react-icons/pi";


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const sessionId = localStorage.getItem('session'); // School Year id
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${sessionId}`);
    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);
    const { records: academics } = useFetch(`${baseUrl()}/academics`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);

    const [studentRegistered, setStudentRegistered] = useState(0);
    const [studentAdmitted, setStudentAdmitted] = useState(0);
    const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
    const [gradeLevelCounts ,setGradeLevelCounts] = useState({
        nursery: 0,
        
    })

    useEffect(() => { // Fetch and count the student records
        if (students) {
            const studentRegisteredCount = students.filter(student => student.isRegistered).length;
            const studentAdmittedCount = students.filter(student => student.isAdmitted).length;

            const maleCount = students.filter(student => student.sex.toLowerCase() === 'male').length;
            const femaleCount = students.filter(student => student.sex.toLowerCase() === 'female').length;

            setStudentRegistered(studentRegisteredCount);
            setStudentAdmitted(studentAdmittedCount);
            setGenderCounts({ male: maleCount, female: femaleCount });
        }

        if(academics) {
            console.log(academics);
        }

    }, [students,academics]);

    const genderData = {
        labels: genderSelections.map(gender => gender.name),
        datasets: [{
            data: [genderCounts.male, genderCounts.female, genderCounts.other],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
        }]
    };

    const studentBarData = {
        labels: ['Registered', 'Admitted'],
        datasets: [{
            label: 'Students',
            data: [studentRegistered, studentAdmitted],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    return (
        <main className="bg-gray-100">
            <h1 className="p-4 text-2xl font-semibold text-green-600">Dashboard</h1>
            <section className="p-8">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-8 mt-1">
                    <div className="bg-gradient-to-r from-red-200 to-red-300 p-6 rounded-lg shadow-md flex items-center">
                        <PiStudentDuotone className="text-7xl" />
                        <div className="flex flex-col items-start">
                            <CountUp 
                                className="text-2xl font-bold"
                                end={studentRegistered}
                                duration={2}
                            />
                            <h2 className="text-sm font-semibold">Students Registered</h2>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-200 to-green-300 p-6 rounded-lg shadow-md flex items-center">
                        <PiStudentDuotone className="text-7xl" />
                        <div className="flex flex-col items-start">
                            <CountUp 
                                className="text-2xl font-bold"
                                end={studentAdmitted}
                                duration={2}
                            />
                            <h2 className="text-sm font-semibold">Students Admitted</h2>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-200 to-blue-300 p-6 rounded-lg shadow-md flex items-center">
                        <PiChalkboardTeacherFill className="text-7xl" />
                        <div className="flex flex-col items-start">
                            <CountUp 
                                className="text-2xl font-bold"
                                end={teachers ? teachers.length : 0}
                                duration={2}
                            />
                            <h2 className="text-sm font-semibold">Teachers Count</h2>
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-lg font-semibold mb-4">Student Gender Distribution</h2>
                        <Pie data={genderData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-lg font-semibold mb-4">Students Overview</h2>
                        <Bar data={studentBarData} />
                    </div>
                </div>
                
            </section>
        </main>
    );
};

export default Dashboard;
