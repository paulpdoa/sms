import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const Section = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/sections`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);

    const [section, setSection] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [adviser, setAdviser] = useState('');
    // const [department, setDepartment] = useState('');
    const [error,setError] = useState({ section: '', gradeLevel: '', adviser: '' });
    const { enqueueSnackbar } = useSnackbar();

    const { role,searchQuery,showForm,setShowForm,session,currentUserId } = useContext(MainContext);

    const columns = [
        {
            accessorKey: 'section',
            header: 'Section',
            editable: true
        },
        {
            accessorKey: 'gradeLevel.gradeLevel', // Update this line
            header: 'Grade Level',
            editable: true,
            selectOptions: gradeLevels.map(gl => ({ value: gl._id, label: gl.gradeLevel })),
        },
        {
            accessorKey: 'adviser.name', // Update this line
            header: 'Adviser',
            editable: true,
            selectOptions: teachers.map(teacher => ({ value: teacher._id, label: `${teacher.firstName} ${teacher.lastName}` })),
        },
        {
            accessorKey: 'department',
            header: 'Department'
        },
    ];

    const updateNewSection = async (id, updatedData) => {
        
        try {
            const newData = await axios.patch(`${baseUrl()}/section/${id}`, {
                newSection: updatedData.section,
                newGradeLevel: updatedData.gradeLevel._id,
                newAdviser: updatedData.adviser._id,
                role,
                sessionId: session,
                session,
                currentUserId
            });
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
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating section record', { 
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

    const deleteSection = async (id) => {
        try {
            const removeSection = await axios.put(`${baseUrl()}/section/${id}`, { recordStatus: 'Deleted' });
            enqueueSnackbar(removeSection.data.mssg, { 
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
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting section record', { 
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

    const addSection = async (e) => {
        e.preventDefault();

        if(!section) {
            setError(prev => ({ ...prev, section: 'Section cannot be empty' }));
            return enqueueSnackbar('Section is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setError({ section: '' });
                }
            });
        }
        if(!gradeLevel) {
            setError(prev => ({ ...prev, gradeLevel: 'Grade level cannot be empty' }));
            return enqueueSnackbar('Grade level is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setError({ gradeLevel: '' });
                }
            });
        }
        if(!adviser) {
            setError(prev => ({ ...prev, adviser: 'Adviser cannot be empty' }));
            return enqueueSnackbar('Adviser is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setError({ adviser: '' });
                }
            });
        }

        try {
            const newSection = await axios.post(`${baseUrl()}/sections`, { section, gradeLevel, adviser, role,sessionId: session,session,currentUserId });
            enqueueSnackbar(newSection.data.mssg, { 
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
        } catch (err) {
            console.log(err)
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding section record', { 
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

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        gradeLevel: {
            _id: record?.gradeLevel?._id,
            gradeLevel: record?.gradeLevel?.gradeLevel
        },
        adviser: {
            _id: record?.adviser?._id,
            name: record?.adviser ? `${record?.adviser?.firstName} ${record?.adviser?.lastName}` : 'Not assigned'
        },
        department: record?.gradeLevel?.department?.department
    }));

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Section</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="section">Section</label>
            <input className={`outline-none p-1 rounded-md border ${error.section ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setSection(e.target.value)} />
            { error.section && <span className="text-xs text-red-500">{error.section}</span> }
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="grade level">Grade Level</label>
            <select className={`outline-none p-1 rounded-md border ${error.gradeLevel ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setGradeLevel(e.target.value)}
            >
                <option hidden>Grade Level</option>
                {gradeLevels?.map(gradeLevel => (
                    <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                ))}
            </select>
            { error.gradeLevel && <span className="text-xs text-red-500">{error.gradeLevel}</span> }
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="adviser">Adviser</label>
            <select className={`outline-none p-1 rounded-md border ${error.adviser ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setAdviser(e.target.value)}
            >
                <option hidden>Select adviser</option>
                {teachers?.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>{teacher.firstName} {teacher.middleName} {teacher.lastName}</option>
                ))}
            </select>
            { error.adviser && <span className="text-xs text-red-500">{error.adviser}</span> }
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Sections" />
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addSection,setShowForm)}
                <div className="relative col-span-2  h-fit">
                    <MasterTable
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewSection}
                        onDelete={deleteSection}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </main>
    )
}

export default Section;
