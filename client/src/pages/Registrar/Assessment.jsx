import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTime from '../../components/DateTime';
import Searchbar from '../../components/Searchbar';
import SubmittedReq from '../../components/admission/reqs/SubmittedReq';
import StudentParent from '../../components/admission/parent/StudentParent';
import StudentInfo from '../../components/admission/info/StudentInfo';
import StudentAcademic from '../../components/admission/acad/StudentAcademic';
import StudentReqTable from '../../components/admission/reqs/StudentReqTable';
import StudentInfoTable from '../../components/admission/info/StudentInfoTable';
import StudentAcadTable from '../../components/admission/acad/StudentAcadTable';
import StudentParentTable from '../../components/admission/parent/StudentParentTable';
import StudentSibling from '../../components/admission/sibling/StudentSibling';
import StudentSiblingTable from '../../components/admission/sibling/StudentSiblingTable';

import TotalFees from '../../components/assessment/TotalFees'

const Assessment = () => {
    const admissionPages = ['Total Fees', 'Textbooks', 'Assistance', 'Payment Term'];
    const [currentPage, setCurrentPage] = useState('Total Fees');
    const [currStudRec, setCurrStudRec] = useState(null);
    const [enableView, setEnableView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const enableViewStudentRecord = (record) => {
        setCurrStudRec(record);
        setEnableView(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const currentUserId = localStorage.getItem('id');

    return (
        <main className="p-4">
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-2xl text-green-500 font-bold">Assessment</h1>
                <Searchbar onSearch={handleSearch} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-5">
                <div className="p-4 bg-white rounded-lg border border-gray-300 w-fit h-fit">
                    <h1 className="font-semibold text-xl text-green-500 mb-4">
                        {currStudRec ? `${currStudRec.firstName} ${currStudRec.lastName}'s` : 'Student'} {currentPage}
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {admissionPages.map((page) => (
                            <button
                                key={page}
                                className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                                    currentPage === page
                                        ? 'bg-green-500 text-white'
                                        : 'border border-gray-300 text-gray-700'
                                }`}
                                onClick={() => {
                                    setCurrentPage(page);
                                    setCurrStudRec(null);
                                    setEnableView(false);
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* {enableView && currStudRec?._id ? ( */}
                        <>
                            {currentPage === 'Total Fees' && <TotalFees /> }
                            {currentPage === 'Parents' && <StudentParent id={currStudRec._id} />}
                            {currentPage === 'Information' && <StudentInfo id={currStudRec._id} />}
                            {currentPage === 'Academic' && <StudentAcademic id={currStudRec._id} />}
                            {currentPage === 'Sibling' && <StudentSibling id={currStudRec} />}
                        </>
                    {/* ) : (
                        <p className="text-sm text-red-500">Please select a student from the list to view details.</p>
                    )} */}
                </div>

                <div className="rounded-md h-fit">
                    {currentPage === 'Requirements' && <StudentReqTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Information' && <StudentInfoTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Academic' && <StudentAcadTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Parents' && <StudentParentTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Sibling' && <StudentSiblingTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                </div>
            </div>

            <ToastContainer />
        </main>
    );
};

export default Assessment;
