import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';
import Dropdown from 'react-dropdown-select';

const Subjects = () => {

    const [subjectName,setSubjectName] = useState('');
    const [subjectCode,setSubjectCode] = useState('');
    const [gradeLevelId,setGradeLevelId] = useState([]);
    const [errors,setErrors] = useState({ subjectName: '', subjectCode: '', gradeLevelId: '' });

    const { records: subjects,isLoading } = useFetch(`${baseUrl()}/subjects`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    // const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { enqueueSnackbar } = useSnackbar();
    
    const { session,currentUserId,setShowForm,searchQuery,showForm,role,showError } = useContext(MainContext);

    const addSubject = async (e) => {
        e.preventDefault();

        if(!subjectName) return showError('subjectName','Subject name cannot be empty','Subject name is a required field',setErrors)
        if(!subjectCode) return showError('subjectCode','Subject code cannot be empty', 'Subject code is a required field', setErrors)
        if(gradeLevelId.length < 1) return showError('gradeLevelId', 'Grade level cannot be empty', 'Grade level is a required field', setErrors);

        try {   
            const data = await axios.post(`${baseUrl()}/subject`,{subjectName,subjectCode,gradeLevelId,sessionId: session, inputter:currentUserId});
            enqueueSnackbar(data.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding subject record', { 
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

    const updateSubject = async (id, updatedData) => {

        try {   
            const newData = await axios.patch(`${baseUrl()}/subject/${id}`,{ subjectName: updatedData.subjectName,subjectCode: updatedData.subjectCode, gradeLevelId: updatedData.gradeLevelId,inputter: currentUserId,sessionId:session });
            enqueueSnackbar(newData.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating subject record', { 
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

    const deleteSubject = async (id) => {

        try {
            const data = await axios.put(`${baseUrl()}/subject/${id}`,{ role });
            enqueueSnackbar(data.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting subject record', { 
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
 
    const columns = [  
        { accessorKey: 'subjectName', header: 'Subject', editable: true },
        { accessorKey: 'subjectCode', header: 'Subject Code', editable: true },
        { accessorKey: 'gradeLevel', header: 'Grade Level', editable: true, selectOptions: gradeLevels?.map(gl => ({ value: gl._id, label: gl.gradeLevel })) },
        // { accessorKey: 'strand', header: 'Strand', editable: true, selectOptions: strands?.map(strand => ({ value: strand._id, label: strand.strand })) }
    ]

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Subject</h1>

        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="subject name">Subject</label>
                <input className={`outline-none p-1 rounded-md border ${errors.subjectName ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setSubjectName(e.target.value)} />
                { errors.subjectName && <span className="text-red-500 text-xs">{errors.subjectName}</span> }
            </div>
            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="subject code">Subject Code</label>
                <input className={`outline-none p-1 rounded-md border ${errors.subjectCode ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setSubjectCode(e.target.value)} />
                { errors.subjectCode && <span className="text-red-500 text-xs">{errors.subjectCode}</span> }
            </div>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="grade level">Grade Level</label>
                <Dropdown
                    className={`outline-none p-1 rounded-md border ${errors.gradeLevelId ? 'border-red-500' : 'border-gray-300'}`} 
                    options={gradeLevels}
                    onChange={(selectedItems) => {
                        const ids = selectedItems.map(item => item._id);  // Extract only the IDs
                        setGradeLevelId(ids);
                    }}
                    values={gradeLevels?.filter(gradeLevel => gradeLevelId.includes(gradeLevel._id))}
                    labelField='gradeLevel'
                    valueField="_id"
                    multi={true}
                    placeholder="Select Grade levels"
                />
                {/* <select className={`outline-none p-1 rounded-md border ${errors.gradeLevelId ? 'border-red-500' : 'border-gray-300'}`} onChange={(e) => setGradeLevelId(e.target.value)}>
                    <option hidden>Choose grade level</option>
                    { gradeLevels?.map(gl => (
                        <option key={gl._id} value={gl._id}>{gl.gradeLevel}</option>
                    )) }
                    <option value="">N/A</option>
                </select> */}
                { errors.gradeLevelId && <span className="text-red-500 text-xs">{errors.gradeLevelId}</span> }
            </div>
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
        </main>
    )
}

export default Subjects;