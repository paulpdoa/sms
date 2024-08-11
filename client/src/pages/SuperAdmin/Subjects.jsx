import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const Subjects = () => {

    const [subjectName,setSubjectName] = useState('');
    const [subjectCode,setSubjectCode] = useState('');
    const [gradeLevelId,setGradeLevelId] = useState('');

    const { records: subjects,isLoading } = useFetch(`${baseUrl()}/subjects`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    
    const { session,currentUserId,setShowForm,searchQuery,showForm,role } = useContext(MainContext);

    const addSubject = async (e) => {
        e.preventDefault();

        try {   
            const data = await axios.post(`${baseUrl()}/subject`,{subjectName,subjectCode,gradeLevelId,sessionId: session, inputter:currentUserId});
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
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
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const updateSubject = async (id, updatedData) => {

        try {   
            const newData = await axios.patch(`${baseUrl()}/subject/${id}`,{ subjectName: updatedData.subjectName, gradeLevelId: updatedData.gradeLevelId,currentUserId,session });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const deleteSubject = async (id) => {

        try {
            const data = await axios.put(`${baseUrl()}/subject/${id}`,{ role, recordStatus: 'Deleted' });
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
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
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }
 
    const columns = [  
        { accessorKey: 'subjectName', header: 'Subject', editable: true },
        { accessorKey: 'subjectCode', header: 'Subject Code', editable: true },
        { accessorKey: 'gradeLevel', header: 'Grade Level', editable: true, selectOptions: gradeLevels?.map(gl => ({ value: gl._id, label: gl.gradeLevel })) }
    ]

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Subject</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="subject name">Subject</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setSubjectName(e.target.value)} />
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="subject code">Subject Code</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setSubjectCode(e.target.value)} />
        </div>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="grade level">Grade Level</label>
            <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setGradeLevelId(e.target.value)}>
                <option hidden>Choose grade level</option>
                { gradeLevels?.map(gl => (
                    <option key={gl._id} value={gl._id}>{gl.gradeLevel}</option>
                )) }
                <option value="">N/A</option>
            </select>
        </div>
        </>
    )

    const recordsWithoutInputter = subjects?.map(subject => ({
        ...subject,
        gradeLevel: subject?.gradeLevelId?.gradeLevel
    }))

    return (
        <main className="p-2 relative">
            <TabActions title="Subjects" />
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addSubject,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateSubject}
                        onDelete={deleteSubject}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Subjects;