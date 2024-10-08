import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import ConfirmationPopup from '../../components/ConfirmationPopup';
import { useCookies } from 'react-cookie';
import { closeSnackbar, useSnackbar } from 'notistack';

const SchoolYear = () => {

    const { records,isLoading } = useFetch(`${baseUrl()}/school-years`);
    const [yearStart, setYearStart] = useState('');
    const [yearEnd, setYearEnd] = useState('');
    const [syTheme, setSyTheme] = useState('');
    const [openPopup, setOpenPopup] = useState(false);
    const [closeYear,setCloseYear] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

    const [errors,setErrors] = useState({ yearStart: '', yearEnd: '' });

    const { role, currentUserId, showForm, searchQuery, setShowForm,session,isFreshYear,dateFormatter } = useContext(MainContext);

    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear?.isYearDone;

    const columns = [
        { accessorKey: 'startYear', header: 'Start Year', editable: true, type: "date" },
        { accessorKey: 'endYear', header: 'End Year', editable: true, type: "date" },
        { accessorKey: 'schoolTheme', header: 'School Theme', editable: true, type: "text" },
        { accessorKey: 'isYearDone', header: 'S.Y Status', selectOptions: ['Ongoing', 'Closed'].map(isReq => ({ value: `${isReq === 'Ongoing' ? false : true }`, label: isReq }))}
    ];

    const updateNewStartYear = async (id, updatedData) => {
        let isYearDone = updatedData.isYearDone;
    
        try {
            const newData = await axios.patch(`${baseUrl()}/school-year/${id}`, { newStartYear: updatedData.startYear, newEndYear: updatedData.endYear, newSchoolTheme: updatedData.schoolTheme, isYearDone, role, inputter:currentUserId });
            enqueueSnackbar(newData.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating school year record', { 
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

    const deleteSchoolYear = async (id) => {
        try {
            const removeSchoolYear = await axios.put(`${baseUrl()}/school-year/${id}`, { role, recordStatus: 'Deleted' });
            enqueueSnackbar(removeSchoolYear.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting school year record', { 
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

    const addSchoolYear = async (e) => {
        e.preventDefault();

        if(!yearStart) {
            setErrors(prev => ({...prev, yearStart: 'Starting year cannot be empty'}));
            return enqueueSnackbar('Year start is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ yearStart: '' });
                }
            });
        }

        if(!yearEnd) {
            setErrors(prev => ({...prev, yearEnd: 'Ending year cannot be empty'}));
            return enqueueSnackbar('Year end is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ yearEnd: '' });
                }
            });
        }

        const loading = snackbarKey('Please wait while adding new school year');
        try {
            const newStartYear = await axios.post(`${baseUrl()}/school-year`, { yearStart, yearEnd, syTheme, role, inputter:currentUserId });
            closeSnackbar(loading);
            enqueueSnackbar(newStartYear.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    ['session','username','role','id','isFreshYear'].forEach(lclstg => localStorage.removeItem(lclstg))
                    removeCookie('userToken',{ path: '/' });
                    navigate('/login');
                }
            });
        } catch (err) {
            console.log(err);
            closeSnackbar(snackbarKey())
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding school year record', { 
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

    const closeSchoolYear = async () => {
        setCloseYear(true);

        try {
            const data = await axios.patch(`${baseUrl()}/close-school-year`,{ sessionId: session,inputter: currentUserId });
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                     // Remove userToken cookie
                    ['session','username','role','id','isFreshYear'].forEach(lclstg => localStorage.removeItem(lclstg))
                    removeCookie('userToken',{ path: '/' });
                    navigate('/login');
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while closing school year record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        isYearDone: record.isYearDone ? 'Done' : 'Ongoing'
    }));

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New School Year</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="school year">School Year Start</label>
                <input className={`outline-none p-1 rounded-md border ${errors.yearStart ? 'border-red-500' : 'border-gray-300'}`} type="date" onChange={(e) => setYearStart(e.target.value)} />
                { errors.yearStart && <span className="text-red-500 text-xs">{errors.yearStart}</span> }
            </div>
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="school year">School Year End</label>
                <input className={`outline-none p-1 rounded-md border ${errors.yearEnd ? 'border-red-500' : 'border-gray-300'}`} type="date" onChange={(e) => setYearEnd(e.target.value)} />
                { errors.yearEnd && <span className="text-red-500 text-xs">{errors.yearEnd}</span> }
            </div>
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="school year">School Year Theme</label>
                <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setSyTheme(e.target.value)} />
            </div>
        </>
    );

    return (
        <main className="p-2 relative">
            <TabActions title="School Years" />
            {/* Show this button when the school year viewed is still ongoing */}
            <div className="flex justify-end px-4 absolute right-0 top-16">
                { (!isYearDone && !isFreshYear) && 
                <button onClick={() => setCloseYear(true)} className={`bg-customCancel text-sm hover:bg-red-600 text-gray-100 p-2 rounded-md cursor-pointer`}>
                    Close School Year
                </button>
                }
            </div>
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form, addSchoolYear, setShowForm) }
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteSchoolYear}
                        onUpdate={updateNewStartYear}
                        onOpenPopup={setOpenPopup}
                        openPopup={openPopup}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            { openPopup && 
                <ConfirmationPopup 
                    message="Editing the Start and End of School Year will void the already created Payment Schedule and we need to re-create it again.
                    Are you sure you want to proceed?"
                    onConfirm={() => {
                        localStorage.setItem('isConfirmedEdit', true);
                        setOpenPopup(false);
                    }}
                    onClose={() => {
                        localStorage.removeItem('isConfirmedEdit');
                        window.location.reload()
                        setOpenPopup(false);
                    }}
                /> 
            }

            { closeYear && 
                <ConfirmationPopup 
                    message="Are you sure you want to close this school year?"
                    onConfirm={() => closeSchoolYear()}
                    onClose={() => setCloseYear(false)}
                /> 
            }
        </main>
    );
};

export default SchoolYear;
