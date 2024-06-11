import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'startYear',
        header: 'Start Year',
    },
    {
        accessorKey: 'endYear',
        header: 'End Year',
    },
    {
        accessorKey: 'schoolTheme',
        header: 'School Theme',
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const SchoolYear = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/school-years`);
    const [yearStart,setYearStart] = useState('');
    const [yearEnd,setYearEnd] = useState('');
    const [syTheme,setSyTheme] = useState('');

    const [updateSchoolYear,setUpdateSchoolYear] = useState(false);
    const [schoolYearId,setSchoolYearId] = useState('');
    const [newStartYear,setNewStartYear] = useState('');
    const [newEndYear,setNewEndYear] = useState('');
    const [newSchoolTheme,setNewSchoolTheme] = useState('');

    const enableEditSchoolYear = (record) => {
        setUpdateSchoolYear(!updateSchoolYear);
        setSchoolYearId(record._id);
        setNewStartYear(record.startYear)
        setNewEndYear(record.endYear);
        setNewSchoolTheme(record.schoolTheme);
    }

    const updateNewStartYear = async (id) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/school-year/${id}`,{ newStartYear,newEndYear,newSchoolTheme });
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
            const removeSchoolYear = await axios.delete(`${baseUrl()}/school-year/${id}`);
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
            const newStartYear = await axios.post(`${baseUrl()}/school-year`,{ yearStart,yearEnd,syTheme });
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

    return (
        <main className="p-2">
            <DateTime />

            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">School Year</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addSchoolYear} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
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

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                { columns?.map((column,key) => (
                                    <th key={key} scope="col" className="px-6 py-3">
                                        { column.header }
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            { records?.map(record => (
                                <tr key={record._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    { updateSchoolYear && (schoolYearId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="date" value={newStartYear} onChange={(e) => setNewStartYear(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="date" value={newEndYear} onChange={(e) => setNewEndYear(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newSchoolTheme} onChange={(e) => setNewSchoolTheme(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.startYear }
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.endYear }
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.schoolTheme }
                                        </td>
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateSchoolYear && (schoolYearId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewStartYear(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditSchoolYear(!updateSchoolYear)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditSchoolYear(record  )} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteSchoolYear(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </>
                                        }
                                        
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default SchoolYear;