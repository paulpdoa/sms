import { useState, useEffect, useContext } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js';
import CountUp from 'react-countup';
import { PiStudentDuotone, PiChalkboardTeacherFill } from 'react-icons/pi';
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import { MainContext } from '../helpers/MainContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const Dashboard = () => {

  const { session } = useContext(MainContext);
  const { records: students } = useFetch(`${baseUrl()}/students`);
  const { records: teachers } = useFetch(`${baseUrl()}/teachers`);
  const { records: academics } = useFetch(`${baseUrl()}/academics`);
  const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
  const { records: enrolledStudents } = useFetch(`${baseUrl()}/enrolled/students/${session}`);
  const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);

  const { records: dashboard } = useFetch(`${baseUrl()}/dashboard/${session}`);

  const [studentRegistered, setStudentRegistered] = useState(0);
  const [studentAdmitted, setStudentAdmitted] = useState(0);
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
  const [teachersCount,setTeachersCount] = useState(0);
  const [gradeLevelCounts, setGradeLevelCounts] = useState({});
  const [nationalityCounts, setNationalityCounts] = useState({ local: 0, foreign: 0 });
  const [enrolledStudentsCount, setEnrolledStudentsCount] = useState(0);
  const [academicStatusOfStudents,setAcademicStatusOfStudents] = useState({ new: 0, transferred: 0,old: 0, graduated: 0, admittedButDidNotContinue: 0 });

  useEffect(() => {
    if(dashboard) {
      setStudentRegistered(dashboard.studentsRegistered);
      setStudentAdmitted(dashboard.studentsAdmitted);
      setGenderCounts({ male: dashboard.studentsGender?.male, female: dashboard.studentsGender?.female });
      setTeachersCount(dashboard.teachersCount);
      setNationalityCounts({ local: dashboard.studentsNationality?.local, foreign: dashboard.studentsNationality?.foreign });
      // setGradeLevelCounts(dashboard.gradeCounts);
      setEnrolledStudentsCount(dashboard.enrolledStudents);
      setAcademicStatusOfStudents({ 
        new: dashboard.academicStatusOfStudents?.new, 
        transferred: dashboard.academicStatusOfStudents?.transferred, 
        old: dashboard.academicStatusOfStudents?.old,
        graduated: dashboard.academicStatusOfStudents?.graduated,
        admittedButDidNotContinue: dashboard.academicStatusOfStudents?.admittedButDidNotContinue

      })
    }
  },[dashboard])

  useEffect(() => {
    // if (students) {
    //   const studentRegisteredCount = students.filter(student => student.isRegistered).length;
    //   const studentAdmittedCount = students.filter(student => student.isAdmitted).length;
    //   const maleCount = students.filter(student => student.sex.toLowerCase() === 'male').length;
    //   const femaleCount = students.filter(student => student.sex.toLowerCase() === 'female').length;
    //   const localCount = students.filter(student => student.nationality.nationalityCodeId.nationalityCode === 'L').length;
    //   const foreignCount = students.filter(student => student.nationality.nationalityCodeId.nationalityCode === 'F').length;

    //   setStudentRegistered(studentRegisteredCount);
    //   setStudentAdmitted(studentAdmittedCount);
    //   setGenderCounts({ male: maleCount, female: femaleCount });
    //   setNationalityCounts({ local: localCount, foreign: foreignCount });
    // }

    if (academics) {
      const gradeCounts = {};
      gradeLevels?.forEach(gl => {
        gradeCounts[gl.gradeLevel] = academics.filter(acad => acad.gradeLevelId?.gradeLevel.toLowerCase() === gl?.gradeLevel.toLowerCase()).length;
      });
      setGradeLevelCounts(gradeCounts);
    }

    // if (enrolledStudents) {
    //   const enrolledCount = enrolledStudents.length;
    //   setEnrolledStudentsCount(enrolledCount);
    // }
   }, [students, academics, enrolledStudents]);

  const academicStatusData = {
    labels: ['New', 'Old', 'Transferred', 'Graduated', 'Admitted but did not continue'],
    datasets: [{
      data: [academicStatusOfStudents.new, academicStatusOfStudents.old, academicStatusOfStudents.transferred, academicStatusOfStudents.graduated, academicStatusOfStudents.admittedButDidNotContinue],
      backgroundColor: ['#36A2EB', '#FF6384','#4BC0C0','#FF9F40','#DC2626'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384','#4BC0C0','#FF9F40','#DC2626'],
    }],
  };

  const nationalityData = {
    labels: ['Local', 'International'],
    datasets: [{
      data: [nationalityCounts.local, nationalityCounts.foreign],
      backgroundColor: ['#4BC0C0', '#FF9F40'],
      hoverBackgroundColor: ['#4BC0C0', '#FF9F40'],
    }],
  };

  const studentBarData = {
    labels: gradeLevels.map(gl => gl.gradeLevel),
    datasets: [{
      label: 'Student Grade Levels',
      data: Object.entries(gradeLevelCounts).map(([, count]) => count * 10), // Scale counts by 10
      backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
    }],
  };

  const enrolleesLineData = {
    labels: schoolYears.map(sy => sy.sessionName),
    datasets: [{
      label: 'Enrollees',
      data: schoolYears.map(sy => {
        const enrolledCount = enrolledStudents.filter(es => es.sessionId === sy._id).length;
        return enrolledCount;
      }),
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      pointBackgroundColor: '#4BC0C0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4BC0C0',
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10, // Adjust step size for better visualization
        },
      },
    },
  };

  return (
    <main className="bg-gray-100 min-h-screen flex w-full">
      
      {/* Main Content */}
      <div className="p-6 w-full">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome {localStorage.getItem('username')}!</h1>
        </header>

        <section className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-lg">Admitted Students</h2>
              <CountUp className="text-3xl font-bold text-green-600" end={studentAdmitted} duration={2} />
            </div>
            <PiStudentDuotone className="text-5xl text-green-600" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-lg">Registered Students</h2>
              <CountUp className="text-3xl font-bold text-blue-600" end={studentRegistered} duration={2} />
            </div>
            <PiStudentDuotone className="text-5xl text-blue-600" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-lg">Enrolled Students</h2>
              <CountUp className="text-3xl font-bold text-red-600" end={enrolledStudentsCount || 0} duration={2} />
            </div>
            <PiStudentDuotone className="text-5xl text-red-600" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-lg">Teachers</h2>
              <CountUp className="text-3xl font-bold text-purple-600" end={teachers?.length || 0} duration={2} />
            </div>
            <PiChalkboardTeacherFill className="text-5xl text-purple-600" />
          </div>
         
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Academic Status Data Distribution</h2>
            <div style={{ height: '300px' }}>
              <Pie data={academicStatusData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Nationality Distribution</h2>
            <div style={{ height: '300px' }}>
              <Pie data={nationalityData} options={chartOptions} />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Students by Grade Level</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <Bar data={studentBarData} options={chartOptions} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Enrolled Students Over the Years</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <Line data={enrolleesLineData} options={chartOptions} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
