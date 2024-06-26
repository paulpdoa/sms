import React, { useState, useMemo } from 'react';
import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import AdmissionTable from '../AdmissionTable';;
import StudentInfoPopup from "./StudentInfoPopup";

const StudentInfoTable = ({ setViewRecord, searchQuery }) => {
    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
        { accessorKey: 'action', header: 'Action' }
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const [updatePopup, setUpdatePopup] = useState(false);
    const [studentRec, setStudentRec] = useState([]);

    const updateStudentInfo = (student) => {
        setUpdatePopup(!updatePopup);
        setStudentRec(student);
    };

    const actions = (student) => (
        <div className="flex gap-2 items-center">
            <button onClick={() => setViewRecord(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
            <button onClick={() => updateStudentInfo(student)} className="font-medium text-green-500 hover:underline">Update</button>
        </div>
    );

    const formattedStudents = students?.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.isRegistered ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        action: actions(student)
    }));

    return (
        <>
            <AdmissionTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} />
            {updatePopup && <StudentInfoPopup id={studentRec} closeModal={setUpdatePopup} />}
        </>
    );
};

export default StudentInfoTable;
