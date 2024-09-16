import React, { useState, useContext } from 'react';
import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import StudentInfoPopup from "./StudentInfoPopup";
import MasterTable from '../../MasterTable';
import StudentInfo from './StudentInfo';
import { MainContext } from '../../../helpers/MainContext';
import { RiCloseLargeFill } from "react-icons/ri";
import StudentAcademic from '../acad/StudentAcademic';
import StudentRegistration from './StudentRegistration';

const StudentInfoTable = ({ setViewRecord, searchQuery }) => {

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        // { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'isAdmitted', header: 'Admitted' },
        { accessorKey: 'dateAdmitted', header: 'Date Admitted' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
    ];

    const buttonPages = ['Information','Academic','Assistance','Registration'];
    const [currentPage,setCurrentPage] = useState('Information');   
    const { setCurrStudRec,currStudRec } = useContext(MainContext);

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
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
        isAdmitted: student?.academicId?.isAdmitted ? 'Yes' : 'No',
        dateAdmitted: new Date(student?.academicId?.dateAdmitted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        })
    })).sort((a, b) => a.lastName.localeCompare(b.lastName));
    

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
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                        {/* Modal container with fixed max size */}
                        <div className="relative bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg max-h-[80vh] min-h-[300px] overflow-y-auto">
                            {/* Modal header */}
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-700">
                                    {currStudRec?.firstName} {currStudRec?.lastName}'s Information
                                </h1>
                                <RiCloseLargeFill
                                    className="text-3xl text-red-400 cursor-pointer"
                                    onClick={() => setUpdatePopup(false)}
                                />
                            </div>

                            {/* Tabs for different pages */}
                            <div className="mb-6 mt-3 flex items-center gap-4">
                                {buttonPages.map((buttonPage) => (
                                    <button
                                        onClick={() => setCurrentPage(buttonPage)}
                                        className={`${
                                            currentPage === buttonPage
                                                ? 'bg-blue-500 hover:bg-blue-600 text-gray-100'
                                                : 'border-blue-500 hover:bg-blue-500 text-gray-800 font-semibold hover:text-gray-100'
                                        } border p-2 rounded-md text-sm transition`}
                                    >
                                        {buttonPage}
                                    </button>
                                ))}
                            </div>

                            {/* Render the content based on the selected tab */}
                            <div className="flex-grow">
                                {currentPage === 'Information' && (
                                    <StudentInfoPopup id={studentRec} closeModal={setUpdatePopup} />
                                )}
                                {currentPage === 'Assistance' && <StudentInfo />}
                                {currentPage === 'Academic' && <StudentAcademic />}
                                {currentPage === 'Registration' && (
                                    <StudentRegistration id={studentRec} />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

           
        </div>
    );
};

export default StudentInfoTable;
