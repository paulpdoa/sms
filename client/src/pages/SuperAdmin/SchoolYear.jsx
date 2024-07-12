import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const SchoolYear = () => {

    const { records } = useFetch(`${baseUrl()}/school-years`);
    const [yearStart,setYearStart] = useState('');
    const [yearEnd,setYearEnd] = useState('');
    const [syTheme,setSyTheme] = useState('');

    const { role,currentUserId,showForm,searchQuery,setShowForm } = useContext(MainContext);

    const columns = [
        { accessorKey: 'startYear', header: 'Start Year',editable: true,type: "date" },
        { accessorKey: 'endYear', header: 'End Year',editable: true,type: "date" },
        { accessorKey: 'schoolTheme', header: 'School Theme',editable: true, type: "text" },
        { accessorKey: 'isYearDone' ,header: 'Status',editable: true, selectOptions: ['Yes','No'].map(isReq => ({ value: `${isReq === 'No' ? true : false }`, label: isReq }))}
    ]

    const updateNewStartYear = async (id,updatedData) => {
        let isYearDone = updatedData.isYearDone === 'Done' ? true : false;
        try {
            const newData = await axios.patch(`${baseUrl()}/school-year/${id}`,{ newStartYear:updatedData.startYear,newEndYear:updatedData.endYear,newSchoolTheme:updatedData.schoolTheme,isYearDone,role });
            toast.success(newData.data.mssg, {
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
            },2000)
        } catch(err) {
            toast.error(err.response.data.mssg, {
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
            },2000)
        }
    }

    const deleteSchoolYear = async (id) => {
        try {
            const removeSchoolYear = await axios.put(`${baseUrl()}/school-year/${id}`,{ data: { role } });
            toast.success(removeSchoolYear.data.mssg, {
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
            },2000)
        } catch(err) {
            console.log(err);
        }
    }

    const addSchoolYear = async (e) => {
        e.preventDefault();
        try {
            const newStartYear = await axios.post(`${baseUrl()}/school-year`,{ yearStart,yearEnd,syTheme,role });
            toast.success(newStartYear.data.mssg, {
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
            },2000)
        } catch(err) {
            console.log(err);
        }
    }

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        isYearDone: record.isYearDone ? 'Done' : 'Ongoing'
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-green-500">Add New School Year</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="school year">School Year Start</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="date" onChange={(e) => setYearStart(e.target.value)} />
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="school year">School Year End</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="date" onChange={(e) => setYearEnd(e.target.value)} />
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="school year">School Year Theme</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setSyTheme(e.target.value)} />
        </div>
        </>
    )

    return (
        <main className="p-2 relative">

            <TabActions title="School Year" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addSchoolYear,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteSchoolYear}
                        onUpdate={updateNewStartYear}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default SchoolYear;