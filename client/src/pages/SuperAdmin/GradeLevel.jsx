import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';
import MasterTable from '../../components/MasterTable';

const GradeLevel = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/grade-levels`);
    const { records:departments } = useFetch(`${baseUrl()}/departments`);
    const [gradeLevel,setGradeLevel] = useState('');
    const [department,setDepartment] = useState('');
    const [searchQuery,setSearchQuery] = useState('');

    const currentUserId = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    const columns = [
        {
            accessorKey: 'gradeLevel',
            header: 'Grade Level',
            editable: true,
        },
        {
            accessorKey: 'department.department',
            header: 'Department',
            editable: true,
            selectOptions: departments.map(department => ({ value: department._id, label: `${department.department}` })),
        },
        { 
            accessorKey: 'inputter', 
            header: 'Inputter'
        }
    ];

    

    const updateNewGradeLevel = async (id,updatedData) => {
        console.log(updatedData);
        try {
            const newData = await axios.patch(`${baseUrl()}/grade-level/${id}`,{ newGradeLevel: updatedData.gradeLevel,inputter: currentUserId,department: updatedData.department._id,role });
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
            const removeGradeLevel = await axios.delete(`${baseUrl()}/grade-level/${id}`, { data: { role } })
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
            const newGradeLevel = await axios.post(`${baseUrl()}/grade-levels`,{ gradeLevel,inputter: currentUserId,department,role });
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

    const recordsWithInputter = records.map(record => ({
        ...record,
        department: {
            _id: record?.department._id,
            department: record?.department?.department
        },
        inputter: record?.inputter?.username
    }));

    return (
        <main className="p-2">
            <DateTime />

            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Grade Level</h1>
                <Searchbar onSearch={setSearchQuery} />
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

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewGradeLevel}
                        onDelete={deleteGradeLevel}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default GradeLevel;