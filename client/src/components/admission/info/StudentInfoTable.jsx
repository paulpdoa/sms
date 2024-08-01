import React, { useState, useMemo } from 'react';
import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import AdmissionTable from '../AdmissionTable';;
import StudentInfoPopup from "./StudentInfoPopup";
import MasterTable from '../../MasterTable';

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
            <button onClick={() => setViewRecord(student)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">View</button>
            <button onClick={() => updateStudentInfo(student)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Update</button>
        </div>
    );

    const formattedStudents = students?.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.academicId?.isRegistered ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        // action: actions(student)
    }));

    return (
        <>
            {/* <AdmissionTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} /> */}
            <MasterTable columns={columns} data={formattedStudents} searchQuery={searchQuery} viewRecord={setViewRecord} actions={actions} />
            {updatePopup && <StudentInfoPopup id={studentRec} closeModal={setUpdatePopup} />}
        </>
    );
};

export default StudentInfoTable;
