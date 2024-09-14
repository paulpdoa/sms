import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import AdmissionTable from '../AdmissionTable';
import MasterTable from "../../MasterTable";

const StudentParentTable = ({ setViewRecord, searchQuery }) => {

    // This student will display all students that are not admitted yet

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        // { accessorKey: 'registered', header: 'Registered' },
        // { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);

    const actions = (student) => (
        <div className="flex gap-2 items-center">
            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
        </div>
    );

    const formattedStudents = students?.filter(student => student.isAdmitted).map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.isRegistered ? 'Yes' : 'No',
        // dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        action: actions(student)
    }));

    return (
        // <AdmissionTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} />
        <MasterTable columns={columns} data={formattedStudents} viewRecord={setViewRecord} searchQuery={searchQuery} />
    )
}

export default StudentParentTable;