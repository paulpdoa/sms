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
        header: 'Grade Level',
    },
    {
        header: 'Department'
    },
    {
        header: 'Inputter'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const GradeLevel = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/grade-levels`);
    const { records:departments } = useFetch(`${baseUrl()}/departments`);
    const [gradeLevel,setGradeLevel] = useState('');
    const [department,setDepartment] = useState('');

    const [updateGradeLevel,setUpdateGradeLevel] = useState(false);
    const [gradeLevelId,setGradeLevelId] = useState('');
    const [newGradeLevel,setNewGradeLevel] = useState('');
    const [newDepartment,setNewDepartment] = useState('');

    const currentUserId = localStorage.getItem('id');

    const enableEditGradeLevel = (record) => {
        setUpdateGradeLevel(!updateGradeLevel);
        setGradeLevelId(record._id);
        setNewGradeLevel(record.gradeLevel)
        setNewDepartment(record.department?._id);
    }

    const updateNewGradeLevel = async (id) => {
        
        try {
            const newData = await axios.patch(`${baseUrl()}/grade-level/${id}`,{ newGradeLevel,inputter: currentUserId,department: newDepartment });
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

    const deleteGradeLevel = async (id) => {
        try {
            const removeGradeLevel = await axios.delete(`${baseUrl()}/grade-level/${id}`);
            toast.success(removeGradeLevel.data.mssg, {
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

    const addGradeLevel = async (e) => {
        e.preventDefault();
        try {
            const newGradeLevel = await axios.post(`${baseUrl()}/grade-levels`,{ gradeLevel,inputter: currentUserId,department });
            toast.success(newGradeLevel.data.mssg, {
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
                <h1 className="text-xl text-green-500 font-bold">Grade Level</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addGradeLevel} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Grade Level</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="grade level">Grade Level</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setGradeLevel(e.target.value)} />
                    </div>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="department">Department</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setDepartment(e.target.value)}>
                            <option hidden>Select department</option>
                            { departments?.map(department => (
                                <option key={department._id} value={department._id}>{ department.department }</option>
                            )) }
                        </select>
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
                                    { updateGradeLevel && (gradeLevelId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newGradeLevel} onChange={(e) => setNewGradeLevel(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewDepartment(e.target.value)}>
                                                <option hidden>{record.department?.department}</option>
                                                { departments?.map(department => (
                                                    <option key={department._id} value={department._id}>{ department.department }</option>
                                                )) }
                                            </select>
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </td>
                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { isNaN(record.gradeLevel) ? record.gradeLevel : `Grade ${record.gradeLevel}` }
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.department?.department }
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium">
                                            { record.inputter?.username }
                                        </td>
                                        </>
                                    }

                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateGradeLevel && (gradeLevelId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewGradeLevel(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditGradeLevel(!updateGradeLevel)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditGradeLevel(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteGradeLevel(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default GradeLevel;