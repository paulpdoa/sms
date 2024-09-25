import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from '../../components/MasterTable';
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const GradeLevel = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/grade-levels`);
    const { records:departments } = useFetch(`${baseUrl()}/departments`);
    const [gradeLevel,setGradeLevel] = useState('');
    const [department,setDepartment] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const [errors,setErrors] = useState({ gradeLevel: '', department: '' });

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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating grade level record', { 
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

    const deleteGradeLevel = async (id) => {
        try {
            const removeGradeLevel = await axios.put(`${baseUrl()}/grade-level/${id}`, { recordStatus: 'Deleted' });
            enqueueSnackbar(removeGradeLevel.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting grade level record', { 
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

    const addGradeLevel = async (e) => {
        e.preventDefault();


        if(!gradeLevel) {
            setErrors(prev => ({...prev,gradeLevel: 'Grade level cannot be empty'}));
            return enqueueSnackbar('Grade level is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ gradeLevel: '' });
                }
            });
        }

        if(!department) {
            setErrors(prev => ({...prev,department: 'Department cannot be empty'}));
            return enqueueSnackbar('Department is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ department: '' });
                }
            });
        }

        try {
            const newGradeLevel = await axios.post(`${baseUrl()}/grade-levels`,{ gradeLevel,inputter: currentUserId,department,role, sessionId });
            enqueueSnackbar(newGradeLevel.data.mssg, { 
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
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding grade level record', { 
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
            <input className={`outline-none p-1 rounded-md border ${errors.gradeLevel ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setGradeLevel(e.target.value)} />
            { errors.gradeLevel && <span className="text-xs text-red-500">{errors.gradeLevel}</span> }
        </div>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="department">Department</label>
            <select className={`outline-none p-1 rounded-md border ${errors.department ? 'border-red-500' : 'border-gray-300'}`} onChange={(e) => setDepartment(e.target.value)}>
                <option hidden>Select department</option>
                { departments?.map(department => (
                    <option key={department._id} value={department._id}>{ department.department }</option>
                )) }
            </select>
            { errors.department && <span className="text-xs text-red-500">{errors.department}</span> }
        </div>

        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Grade Levels" />
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
        </main>
    )
}

export default GradeLevel;