import React, { useState, useContext } from 'react';
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
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';

const Admission = () => {
    const admissionPages = ['Requirements', 'Parents', 'Sibling'];
    const [currentPage, setCurrentPage] = useState('Requirements');
    const [enableView, setEnableView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { currStudRec, setCurrStudRec, currentUserId } = useContext(MainContext);

    const enableViewStudentRecord = (record) => {
        setCurrStudRec(record);
        setEnableView(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <main className="p-4 relative overflow-hidden">
            <TabActions title="Admission" noView={true} />
            
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mt-5">
                <StudentReqTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />
                {/* <div className="rounded-md h-fit">
                    {currentPage === 'Requirements' && <StudentReqTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Academic' && <StudentAcadTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Parents' && <StudentParentTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Sibling' && <StudentSiblingTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                </div> */}

                {currStudRec?._id && (
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

                            {currStudRec?._id ? (
                                <>
                                    {currentPage === 'Requirements' && <SubmittedReq id={currStudRec._id} setEnableView={setEnableView} />}
                                    {currentPage === 'Parents' && <StudentParent id={currStudRec._id} setEnableView={setEnableView} />}
                                    {currentPage === 'Information' && <StudentInfo id={currStudRec._id} setEnableView={setEnableView} />}
                                    {currentPage === 'Academic' && <StudentAcademic id={currStudRec._id} setEnableView={setEnableView} />}
                                    {currentPage === 'Sibling' && <StudentSibling id={currStudRec} setEnableView={setEnableView} />}
                                </>
                            ) : (
                                <p className="text-sm text-red-500">Please select a student from the list to view details.</p>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
};

export default Admission;
