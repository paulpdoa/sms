import { useState, useContext } from 'react';
import TotalFees from '../../components/assessment/TotalFees'
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import PaymentTerm from '../../components/assessment/PaymentTerm';
import AssessTextbooks from '../../components/assessment/AssessTextbooks';
import Assistance from '../../components/assessment/Assistance';
import MasterTable from '../../components/MasterTable';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';
import TabActions from '../../components/TabActions';
import Filter from '../../components/Filter';

const Assessment = () => {

    const { records: students } = useFetch(`${baseUrl()}/students`);
    const admissionPages = ['Total Fees', 'Textbooks', 'Assistance', 'Payment Term'];
    const [currentPage, setCurrentPage] = useState('Total Fees');
    const [currStudRec, setCurrStudRec] = useState(undefined);
    const [enableView, setEnableView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [filter,setFilter] = useState('');

    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

    const { session, currentUserId, role,snackbarKey,searchQuery,dateFormatter } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone ? true : false;

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No.' },
        { accessorKey: 'registered', header: 'Registered' },
        { accessorKey: 'dateRegistered', header: 'Date Registered' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'nationality', header: 'Nationality' }
    ];

    const enableViewStudentRecord = (record) => {
        setCurrStudRec(record);
        setEnableView(true);
    };

    // const handleSearch = (query) => {
    //     setSearchQuery(query);
    // };

    const generateFees = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loading = snackbarKey('Assigning fees to students, please wait')
        
        try {
            // Close the loading snackbar after success
            const { data } = await axios.post(`${baseUrl()}/generate-fees`, { session, role });
            setIsLoading(false);
            closeSnackbar(loading);
            enqueueSnackbar(data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    window.location.reload()
                }
            });

            
        } catch (err) {
            console.log(err.response.data.mssg);
            // Close the loading snackbar after error
            closeSnackbar(snackbarKey());
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while generating fees', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });

            
            setIsLoading(false)
        }

    }

    const deleteGeneratedFees = async () => {

        try {
            const { data } = await axios.delete(`${baseUrl()}/delete-student-payments`, { data: { session, role } });
            
            closeSnackbar(snackbarKey('Deleting generated fees, please wait'));
            enqueueSnackbar(data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch (err) {
            console.log(err);
            closeSnackbar(snackbarKey())
            enqueueSnackbar(err.response.data.mssg, { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    const formattedStudents = students?.filter(student => {

        const isAssessed = student?.academicId?.isAssessed;

        if(filter === 'Assessed') {
            return isAssessed
        }

        if(filter === 'Not Assessed') {
            return !isAssessed
        }

        return student?.academicId?.isAdmitted && student?.academicId?.isRegistered && student?.academicId?.gradeLevelId
    }).map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        studentNo: student.studentNo || 'Not assigned',
        registered: student?.academicId?.isRegistered ? 'Yes' : 'No',
        admitted: student?.academicId?.isAdmitted ? 'Yes' : 'No',
        dateRegistered: student.academicId?.dateRegistered ? dateFormatter(student.academicId?.dateRegistered) : 'Not Registered',
        gradeLevel: student.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        strand: student.academicId?.strandId?.strand || 'Not assigned',
        nationality: student.nationality?.nationality || 'Not assigned',
        status: student.status,
    })).sort((a, b) => a.lastName.localeCompare(b.lastName));

    

    return (
        <main className="p-4 relative overflow-hidden">
            <div className="flex items-center">
                <TabActions title="Assessment" noView={true} />
                <div className="flex items-center gap-2 mx-9">
                    <button disabled={isYearDone} onClick={deleteGeneratedFees} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} items-end text-sm bg-customCancel hover:bg-red-600 text-white p-2 rounded-md min-w-fit`}>Delete Fees</button>
                    <button disabled={isYearDone} onClick={generateFees} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} items-end text-sm bg-customView hover:bg-customHighlight text-white p-2 rounded-md min-w-fit`}>{isLoading ? 'Loading' : 'Generate Fees'}</button>
                </div>
            </div>
            
            <div className="flex justify-end">
                <Filter options={['Assessed','Not Assessed', 'Clear']} title="option" onChange={setFilter} />
            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                <div className="rounded-md h-fit">
                    <MasterTable columns={columns} data={formattedStudents} viewRecord={enableViewStudentRecord} searchQuery={searchQuery} />
                </div>

                {currStudRec?._id && (
                    <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                    
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white w-full h-full md:w-3/4 md:h-[90%] p-4 rounded-lg border border-gray-300 shadow-lg overflow-y-auto">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="font-semibold text-2xl text-gray-700">
                                    {currStudRec ? `${currStudRec.firstName} ${currStudRec.lastName}'s Generated Fees` : 'Student'}
                                </h1>
                                <button onClick={() => {
                                    setCurrStudRec(null)
                                    setEnableView(false)
                                }} className="bg-red-500 text-sm hover:bg-red-600 p-2 text-white rounded-md transition">Cancel</button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {admissionPages.map((page) => (
                                    <button
                                        key={page}
                                        className={`text-sm font-semibold px-3 py-1 rounded-lg ${currentPage === page ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700'}`}
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
                                    {currentPage === 'Total Fees' && <TotalFees record={currStudRec} />}
                                    {currentPage === 'Textbooks' && <AssessTextbooks record={currStudRec} />}
                                    {currentPage === 'Payment Term' && <PaymentTerm record={currStudRec} />}
                                    {currentPage === 'Assistance' && <Assistance record={currStudRec} />}
                                </>
                            ) : (
                                <p className="text-sm text-red-500">Please select a student from the list to view details.</p>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default Assessment;
