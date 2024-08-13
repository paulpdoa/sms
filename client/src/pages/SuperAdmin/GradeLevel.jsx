import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const GradeLevel = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/grade-levels`);
    const { records:departments } = useFetch(`${baseUrl()}/departments`);
    const [gradeLevel,setGradeLevel] = useState('');
    const [department,setDepartment] = useState('');

    const { currentUserId, searchQuery,session: sessionId, role,showForm,setShowForm } = useContext(MainContext);

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
        }
    ];

    

    const updateNewGradeLevel = async (id,updatedData) => {
        try {
            const newData = await axios.patch(`${baseUrl()}/grade-level/${id}`,{ newGradeLevel: updatedData.gradeLevel,inputter: currentUserId,department: updatedData.department._id,role,sessionId });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }      

    const deleteGradeLevel = async (id) => {
        try {
            const removeGradeLevel = await axios.put(`${baseUrl()}/grade-level/${id}`, { recordStatus: 'Deleted' });
            toast.success(removeGradeLevel.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const addGradeLevel = async (e) => {
        e.preventDefault();
        try {
            const newGradeLevel = await axios.post(`${baseUrl()}/grade-levels`,{ gradeLevel,inputter: currentUserId,department,role, sessionId });
            toast.success(newGradeLevel.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
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
        }
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Grade Level</h1>

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

        </>
    )

    return (
        <main className="p-2 relative">

            <TabActions title="Grade Level" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addGradeLevel,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewGradeLevel}
                        onDelete={deleteGradeLevel}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default GradeLevel;