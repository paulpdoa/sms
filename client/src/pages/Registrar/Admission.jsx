import React, { useState, useContext } from 'react';
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
import { MainContext } from '../../helpers/MainContext';

const Admission = () => {
    const admissionPages = ['Requirements', 'Information', 'Parents', 'Sibling', 'Academic'];
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
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-2xl text-gray-700 font-bold">Admission</h1>
                <Searchbar onSearch={handleSearch} />
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mt-5">
                <div className="rounded-md h-fit">
                    {currentPage === 'Requirements' && <StudentReqTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Information' && <StudentInfoTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Academic' && <StudentAcadTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Parents' && <StudentParentTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                    {currentPage === 'Sibling' && <StudentSiblingTable setViewRecord={enableViewStudentRecord} searchQuery={searchQuery} />}
                </div>

                {currStudRec?._id && (
                    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-20 p-4 bg-white rounded-lg border border-gray-300 max-h-[80vh] overflow-y-auto shadow-lg z-50 w-3/4">
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="font-semibold text-xl text-gray-700 mb-4">
                                {currStudRec ? `${currStudRec.firstName} ${currStudRec.lastName}'s` : 'Student'} {currentPage}
                            </h1>
                            <button onClick={() => {
                                setCurrStudRec(null);
                                setEnableView(false);
                            }} className="bg-red-500 text-sm hover:bg-red-600 p-2 text-white rounded-md transition">Cancel</button>
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
                                {currentPage === 'Requirements' && <SubmittedReq id={currStudRec._id} />}
                                {currentPage === 'Parents' && <StudentParent id={currStudRec._id} />}
                                {currentPage === 'Information' && <StudentInfo id={currStudRec._id} />}
                                {currentPage === 'Academic' && <StudentAcademic id={currStudRec._id} />}
                                {currentPage === 'Sibling' && <StudentSibling id={currStudRec} />}
                            </>
                        ) : (
                            <p className="text-sm text-red-500">Please select a student from the list to view details.</p>
                        )}
                    </div>
                )}
            </div>

            <ToastContainer />
        </main>
    );
};

export default Admission;
