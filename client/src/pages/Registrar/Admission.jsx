import { useState, useContext } from 'react';
import SubmittedReq from '../../components/admission/reqs/SubmittedReq';
import StudentParent from '../../components/admission/parent/StudentParent';
import StudentReqTable from '../../components/admission/reqs/StudentReqTable';
import StudentSibling from '../../components/admission/sibling/StudentSibling';
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import Filter from '../../components/Filter';
import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';

const Admission = () => {
    const admissionPages = ['Requirements', 'Parents', 'Sibling'];
    const [currentPage, setCurrentPage] = useState('Requirements');
    const [enableView, setEnableView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { currStudRec,setCurrStudRec,currentUserId } = useContext(MainContext);

    // This student will display all students that are not admitted yet
    const [filter,setFilter] = useState('');

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        // { accessorKey: 'studentNo', header: 'Student No.' },
        // { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'admitted', header: 'Admitted' },
        // { accessorKey: 'dateRegistered', header: 'Date Registered' },
        // { accessorKey: 'status', header: 'Status' },
        // { accessorKey: 'gradeLevel', header: 'Grade Level' },
        // { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'nationality', header: 'Nationality' },
    ];

    const { records: students } = useFetch(`${baseUrl()}/students`);

    const formattedStudents = students?.filter(student => {
        const filterStatus = filter === 'Admitted';
        if(student?.academicId?.isAdmitted === filterStatus) {
            return student?.academicId?.academicStatus?.toLowerCase() !== 'graduated' && student?.academicId?.isAdmitted
        } 
        return student?.academicId?.academicStatus?.toLowerCase() !== 'graduated' && !student?.academicId?.isAdmitted
    }).map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        // studentNo: student.studentNo || 'Not assigned',
        registered: student?.academicId?.isRegistered ? 'Yes' : 'No',
        admitted: student?.academicId?.isAdmitted ? 'Yes' : 'No',
        nationality: student.nationality?.nationality || 'Not assigned',
        // status: student.status    
    })).sort((a, b) => a.lastName.localeCompare(b.lastName));


    const enableViewStudentRecord = (record) => {
        setCurrStudRec(record);
        
        if(record) {
            setEnableView(true);
        } 
    };

    return (
        <main className="p-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
                <TabActions title="Admission" noView={true} />
                <Filter options={['Admitted','Not Admitted']} title="option" onChange={setFilter} />
            </div>
            
            {/* <div className="flex flex-wrap gap-2 mb-4">
                {admissionPages.map((page) => (
                    <button
                        key={page}
                        className={`text-sm font-semibold px-3 py-1 rounded-lg ${currentPage === page ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border border-gray-300 text-gray-700'}`}
                        onClick={() => {
                            setCurrentPage(page);
                            setEnableView(false);
                        }}
                    >
                        {page}
                    </button>
                ))}
            </div> */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                <StudentReqTable setViewRecord={enableViewStudentRecord} formattedStudents={formattedStudents || []} columns={columns} />
                {/* <div className="rounded-md h-fit">
                    {currentPage === 'Requirements' && <StudentReqTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Academic' && <StudentAcadTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Parents' && <StudentParentTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Sibling' && <StudentSiblingTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                </div> */}

                { enableView && (
                    // The overlay with black background and opacity
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-40">
                        {/* The modal */}
                        <div className="relative top-20 p-4 bg-white rounded-lg border border-gray-300 max-h-[80vh] overflow-y-auto shadow-lg z-50 w-3/4">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="font-semibold text-xl text-gray-700 mb-4">
                                    {currStudRec ? `${currStudRec.firstName} ${currStudRec.lastName}'s` : 'Student'} {currentPage}
                                </h1>
                                {/* <button
                                    onClick={() => {
                                        setCurrStudRec(null);
                                        setEnableView(false);
                                    }}
                                    className="bg-red-500 text-sm hover:bg-red-600 p-2 text-white rounded-md transition"
                                >
                                    Cancel
                                </button> */}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {admissionPages.map((page) => (
                                    <button
                                        key={page}
                                        className={`text-sm font-semibold px-3 py-1 rounded-lg ${currentPage === page ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border border-gray-300 text-gray-700'}`}
                                        onClick={() => {
                                            setCurrentPage(page);
                                            setEnableView(false);
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                           
                             {/* Show tables here below */}
                            {currentPage === 'Requirements' && <SubmittedReq id={currStudRec._id} setEnableView={setEnableView} />}
                            {currentPage === 'Parents' && <StudentParent id={currStudRec._id} setEnableView={setEnableView} />}
                            {/* {currentPage === 'Information' && <StudentInfo id={currStudRec._id} setEnableView={setEnableView} />}
                            {currentPage === 'Academic' && <StudentAcademic id={currStudRec._id} setEnableView={setEnableView} />} */}
                            {currentPage === 'Sibling' && <StudentSibling id={currStudRec} setEnableView={setEnableView} />}
                             
                           
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
};

export default Admission;
