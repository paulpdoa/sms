import React, { useState, useContext } from 'react';
import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import StudentInfoPopup from "./StudentInfoPopup";
import MasterTable from '../../MasterTable';
import StudentInfo from './StudentInfo';
import { MainContext } from '../../../helpers/MainContext';

const StudentInfoTable = ({ setViewRecord, searchQuery }) => {

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        // { accessorKey: 'studentNo', header: 'Student No.' },
        // { accessorKey: 'registered', header: 'Registered' },
        // { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
    ];

    const buttonPages = ['Information','Academic','Registration','Assistance'];
    const [currentPage,setCurrentPage] = useState('Information');   
    const { setCurrStudRec } = useContext(MainContext);

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const [updatePopup, setUpdatePopup] = useState(false);
    const [studentRec, setStudentRec] = useState([]);

    const updateStudentInfo = (student) => {
        setUpdatePopup(!updatePopup);
        setStudentRec(student);
        setCurrStudRec(student);
    };

    const actions = (student) => (
        <div className="flex gap-2 items-center">
            <button onClick={() => {
                // setViewRecord(student);
                updateStudentInfo(student)

            }} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">View</button>
            {/* <button onClick={() => updateStudentInfo(student)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Update</button> */}
        </div>
    );

    const formattedStudents = students?.filter(student => student?.academicId?.isAdmitted).map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.academicId?.isRegistered ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? new Date(student.dateRegistered.split('T')[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        // action: actions(student)
    }));
    

    return (
        <div className="relative">
            {/* <AdmissionTable columns={columns} data={formattedStudents} actions={actions} searchQuery={searchQuery} /> */}
            <MasterTable 
                columns={columns} 
                data={formattedStudents} 
                searchQuery={searchQuery} 
                viewRecord={setViewRecord} 
                actions={actions} 
            />

            {updatePopup && (
                <>
                    <div className="mb-6 mt-3 flex items-center gap-4">
                        { buttonPages.map(buttonPage => (
                            <button 
                                onClick={() => setCurrentPage(buttonPage)} 
                                className={`${currentPage === buttonPage ? 'bg-blue-500 hover:bg-blue-600 text-gray-100' : 'border-blue-500 hover:bg-blue-500 bg-gray-100 text-gray-800 hover:text-gray-100' } border p-2 rounded-md text-sm transition`}
                            >
                                {buttonPage}
                            </button>
                        )) } 
                    </div>


                    { currentPage && (
                       <>
                            {currentPage === 'Information' && <StudentInfoPopup id={studentRec} closeModal={setUpdatePopup} />}
                            {currentPage === 'Assistance' && <StudentInfo />}
                       </> 
                    ) }
                    {/* <StudentInfoPopup id={studentRec} closeModal={setUpdatePopup} />
                    <StudentInfo /> */}
                </>
            )}
           
        </div>
    );
};

export default StudentInfoTable;
