import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import AdmissionTable from "../AdmissionTable";
import MasterTable from "../../MasterTable";
import { useContext } from 'react';
import { MainContext } from "../../../helpers/MainContext";

const StudentReqTable = ({ searchQuery }) => {

    const { setCurrStudRec: setViewRecord } = useContext(MainContext);

    // This student will display all students that are not admitted yet

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        // { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'admitted', header: 'Admitted' },
        { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        // { accessorKey: 'gradeLevel', header: 'Grade Level' },
        // { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const actions = (student) => (
        <div className="flex gap-2 items-center">
            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
        </div>
    );

    const formattedStudents = students?.filter(student => student?.academicId?.academicStatus?.toLowerCase() !== 'graduated').map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student?.academicId?.isRegistered ? 'Yes' : 'No',
        admitted: student?.academicId?.isAdmitted ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? new Date(student.dateRegistered.split('T')[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Not Registered',
        // gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        // strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status    
    }));

    return (
        <MasterTable columns={columns} data={formattedStudents} viewRecord={setViewRecord} searchQuery={searchQuery} /> 
    )
}

export default StudentReqTable;