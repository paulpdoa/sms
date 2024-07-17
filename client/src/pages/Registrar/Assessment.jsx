import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTime from '../../components/DateTime';
import Searchbar from '../../components/Searchbar';
import TotalFees from '../../components/assessment/TotalFees'
import AssessmentTable from '../../components/assessment/AssessmentTable';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import PaymentTerm from '../../components/assessment/PaymentTerm';
import AssessTextbooks from '../../components/assessment/AssessTextbooks';
import Assistance from '../../components/assessment/Assistance';
import MasterTable from '../../components/MasterTable';
import { useFetch } from '../../hooks/useFetch';

const Assessment = () => {

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const admissionPages = ['Total Fees', 'Textbooks', 'Assistance', 'Payment Term'];
    const [currentPage, setCurrentPage] = useState('Total Fees');
    const [currStudRec, setCurrStudRec] = useState(undefined);
    const [enableView, setEnableView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'nationality', header: 'Nationality' },
    ];

    const enableViewStudentRecord = (record) => {
        setCurrStudRec(record);
        setEnableView(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const currentUserId = localStorage.getItem('id');
    const session = localStorage.getItem('session');

    const generateFees = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Creating fees, please wait...');

        try {
            const { data } = await axios.get(`${baseUrl()}/generate-fees/${session}`);
            setIsLoading(false);
            toast.update(toastId, {
                render: data.mssg,
                type: "success",
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch(err) {
            toast.update(toastId, {
                render: err.response.data.error,
                type: "error",
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            setIsLoading(false)
        }

    }

    const deleteGeneratedFees = async () => {
        try {
            const { data } = await axios.delete(`${baseUrl()}/delete-student-payments`);
            toast.success(data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch(err) {
            console.log(err);
        }
    };

    const formattedStudents = students?.filter(student => student.isAdmitted && student.isRegistered).map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student.isRegistered ? 'Yes' : 'No',
        admitted: student.isAdmitted ? 'Yes' : 'No',
        dateRegistered: student.dateRegistered ? student.dateRegistered.split('T')[0] : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
    }));

    return (
        <main className="p-4">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-2xl text-green-500 font-bold">Assessment</h1>
                <div className="flex items-center gap-2">
                    <Searchbar onSearch={handleSearch} />
                    <button className="items-end text-sm bg-red-500 hover:bg-red-600 cursor-pointer text-white p-2 rounded-md" onClick={deleteGeneratedFees}>Delete Fees</button>
                    <button onClick={generateFees} className="items-end text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-md">{ isLoading ? 'Loading' : 'Generate Fees'}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-5">

                <div className="rounded-md h-fit w-full">
                    <MasterTable columns={columns} data={formattedStudents} viewRecord={enableViewStudentRecord} searchQuery={searchQuery} />
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-300 h-fit">
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

                    {enableView && currStudRec?._id ? (
                        <>
                            {currentPage === 'Total Fees' && <TotalFees record={currStudRec}/> }
                            {currentPage === 'Textbooks' && <AssessTextbooks record={currStudRec}/> }
                            {currentPage === 'Payment Term' && <PaymentTerm record={currStudRec} /> }
                            {currentPage === 'Assistance' && <Assistance record={currStudRec} /> }
                        </>
                    ) : (
                        <p className="text-sm text-red-500">Please select a student from the list to view details.</p>
                    )}
                </div>

                
            </div>

            <ToastContainer />
        </main>
    );
};

export default Assessment;
