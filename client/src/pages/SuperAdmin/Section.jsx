import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const Section = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/sections`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: teachers } = useFetch(`${baseUrl()}/teachers`);

    const [section, setSection] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [adviser, setAdviser] = useState('');
    // const [department, setDepartment] = useState('');

    const { role,searchQuery,setSearchQuery,showForm,setShowForm,session } = useContext(MainContext);

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
                sessionId: session
            });
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

            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (err) {
            toast.error('Error has occurred while updating section record', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const deleteSection = async (id) => {
        try {
            const removeSection = await axios.put(`${baseUrl()}/section/${id}`, { data: { role } });
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
            }, 2000)
        } catch (err) {
            console.log(err);
        }
    }

    const addSection = async (e) => {
        e.preventDefault();

        try {
            const newSection = await axios.post(`${baseUrl()}/sections`, { section, gradeLevel, adviser, role,sessionId: session });
            toast.success(newSection.data.mssg, {
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
            }, 2000)
        } catch (err) {
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
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
                {gradeLevels?.map(gradeLevel => (
                    <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="adviser">Adviser</label>
            <select className="outline-none p-1 rounded-md border border-gray-300"
                onChange={(e) => setAdviser(e.target.value)}
                required
            >
                <option hidden>Select adviser</option>
                {teachers?.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>{teacher.firstName} {teacher.middleName} {teacher.lastName}</option>
                ))}
            </select>
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Section" />

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
            <ToastContainer />
        </main>
    )
}

export default Section;
