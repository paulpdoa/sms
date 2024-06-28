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
        accessorKey: 'section',
        header: 'Section',
    },
    {
        accessorKey: 'gradeLevel',
        header: 'Grade Level',
    },
    {
        accessorKey: 'teacher',
        header: 'Adviser'
    },
    {
        accessorKey: 'department',
        header: 'Department'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Section = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/sections`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: departments } = useFetch(`${baseUrl()}/departments`);
    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);

    const [section,setSection] = useState('');
    const [gradeLevel,setGradeLevel] = useState('');
    const [adviser,setAdviser] = useState('');
    const [department,setDepartment] = useState('');

    const [updateSection,setUpdateSection] = useState(false);
    const [sectionId,setSectionId] = useState('');
    const [newSection,setNewSection] = useState('');
    const [newGradeLevel,setNewGradeLevel] = useState('');
    const [newAdviser,setNewAdviser] = useState('');
    const [newDepartment,setNewDepartment] = useState('');

    const enableEditSection = (record) => {
        setUpdateSection(!updateSection);
        setSectionId(record?._id);
        setNewSection(record?.section)
        setNewGradeLevel(record.gradeLevel?._id);
        setNewAdviser(record.adviser?._id);
        setNewDepartment(record.department?._id);
    }

    const updateNewSection = async (id) => {
        
        try {
            const newData = await axios.patch(`${baseUrl()}/section/${id}`,{ newSection,newGradeLevel,newAdviser,newDepartment });
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

    const deleteSection = async (id) => {
        try {
            const removeSection = await axios.put(`${baseUrl()}/section/${id}`);
            toast.success(removeSection.data.mssg, {
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

    const addSection = async (e) => {
        e.preventDefault();
       
        try {
            const newSection = await axios.post(`${baseUrl()}/sections`,{ section,gradeLevel,department,adviser });
            toast.success(newSection.data.mssg, {
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
        }
    }

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2  items-center">
                <h1 className="text-xl text-green-500 font-bold">Section</h1>
                <Searchbar />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addSection} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Section</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="section">Section</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setSection(e.target.value)} required />
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="grade level">Grade Level</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setGradeLevel(e.target.value)}
                            required
                            >
                            <option hidden>Grade Level</option>
                            { gradeLevels?.map(gradeLevel => (
                                <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="adviser">Adviser</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setAdviser(e.target.value)}
                            required
                            >
                            <option hidden>Select adviser</option>
                            { teachers?.map(teacher => (
                                <option key={teacher._id} value={teacher._id}>{teacher.firstName} {teacher.middleName} {teacher.lastName}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="department">Department</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                            >
                            <option hidden>Department</option>
                            { departments?.map(department => (
                                <option key={department._id} value={department._id}>{department.department}</option>
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
                                    { updateSection && (sectionId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <input type="text" value={newSection} onChange={(e) => setNewSection(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewGradeLevel(e.target.value)}>
                                                <option hidden>{record.gradeLevel.gradeLevel}</option>
                                                { gradeLevels?.map(gradeLevel => (
                                                    <option key={gradeLevel._id} value={gradeLevel._id}>{ gradeLevel.gradeLevel }</option>
                                                )) }
                                            </select>
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewAdviser(e.target.value)}>
                                                <option hidden>{record.adviser?.teacher ? record.adviser?.teacher : 'Choose adviser'}</option>
                                                { teachers?.map(teacher => (
                                                    <option key={teacher._id} value={teacher._id}>{ teacher.firstName } { teacher.middleName } { teacher.lastName }</option>
                                                )) }
                                            </select>
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewDepartment(e.target.value)}>
                                                <option hidden>{ record.department?.department }</option>
                                                { departments?.map(department => (
                                                    <option key={department._id} value={department._id}>{ department.department }</option>
                                                )) }
                                            </select>
                                        </td>
                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record?.section }
                                        </th>
                                        <td className="px-6 py-4 gap-2">
                                            { isNaN(record.gradeLevel?.gradeLevel) ? record.gradeLevel?.gradeLevel : `Grade ${record.gradeLevel?.gradeLevel}` }
                                        </td>
                                        <td className="px-6 py-4 gap-2">
                                            { record.adviser === undefined ? 'Not Assigned' : `${record.adviser?.firstName} ${record.adviser?.middleName} ${record.adviser?.lastName}` }
                                        </td>
                                        <td className="px-6 py-4 gap-2">
                                            { record.department ? record.department?.department : 'Not Assigned' }
                                        </td>
                                        </>
                                    }
                                    
                                    
                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateSection && (sectionId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewSection(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditSection(!updateSection)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditSection(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteSection(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default Section;