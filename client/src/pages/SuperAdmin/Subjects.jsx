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
    const [strandId,setStrandId] = useState([]);
    const [errors,setErrors] = useState({ subjectName: '', subjectCode: '', gradeLevelId: '', strandId: '' });

    const { records: subjects,isLoading } = useFetch(`${baseUrl()}/subjects`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { enqueueSnackbar } = useSnackbar();
    
    const { session,currentUserId,setShowForm,searchQuery,showForm,role,showError } = useContext(MainContext);

    // Check if selected grade level includes Grade 11 or 12
    const isGrade11or12 = gradeLevelId.some(id => {
        const grade = gradeLevels?.find(level => level._id === id)?.gradeLevel;

        if(grade.includes(11) || grade.includes(12)) return true
    });

    const addSubject = async (e) => {
        e.preventDefault();

        if(!subjectName) return showError('subjectName','Subject name cannot be empty','Subject name is a required field',setErrors)
        if(!subjectCode) return showError('subjectCode','Subject code cannot be empty', 'Subject code is a required field', setErrors)
        if(gradeLevelId.length < 1) return showError('gradeLevelId', 'Grade level cannot be empty', 'Grade level is a required field', setErrors);
        if(isGrade11or12 && (strandId.length < 1)) return showError('strandId', 'Strand cannot be empty', 'Strand is a required field with 11 or 12 grade levels', setErrors);

        const subjectInfo = {
            subjectName,
            subjectCode,
            gradeLevelId,
            sessionId: session,
            inputter: currentUserId
        }

        if(isGrade11or12) {
            subjectInfo.strandId = strandId
        }

        try {   
            const data = await axios.post(`${baseUrl()}/subject`,subjectInfo);
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
        console.log(updatedData);
        try {   
            const newData = await axios.patch(`${baseUrl()}/subject/${id}`,{ subjectName: updatedData.subjectName,subjectCode: updatedData.subjectCode, gradeLevelId: updatedData.gradeLevelId,inputter: currentUserId,sessionId:session, strandId: updatedData.strand });
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
        { accessorKey: 'strand', header: 'Strand', editable: true, selectOptions: strands?.map(strand => ({ value: strand._id, label: strand.strand })) }
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
                    searchable={true}
                    searchBy='gradeLevel'
                    selectAll={true}
                />
                { errors.gradeLevelId && <span className="text-red-500 text-xs">{errors.gradeLevelId}</span> }
            </div>

            { isGrade11or12 && (
                <div className="flex flex-col mt-1">
                    <label className="text-sm" htmlFor="strand">Strand</label>
                    <Dropdown
                        className={`outline-none p-1 rounded-md border ${errors.gradeLevelId ? 'border-red-500' : 'border-gray-300'}`} 
                        options={strands}
                        onChange={(selectedItems) => {
                            const ids = selectedItems.map(item => item._id);  // Extract only the IDs
                            setStrandId(ids);
                        }}
                        values={strands?.filter(strand => strandId.includes(strand._id))}
                        labelField='strand'
                        valueField="_id"
                        multi={true}
                        placeholder="Select strand"
                        searchable={true}
                        searchBy='strand'
                        selectAll={true}
                    />
                    { errors.strandId && <span className="text-red-500 text-xs">{errors.strandId}</span> }
                </div>
            )} 
        </div>
        </>
    )



    const recordsWithoutInputter = subjects?.map(subject => ({
        ...subject,
        gradeLevel: subject?.gradeLevelId?.gradeLevel,
        strand: subject?.strandId?.strand
    }));
    console.log(recordsWithoutInputter)

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