import AddStudentBtn from "../components/buttons/AddStudentBtn";
import Searchbar from "../components/Searchbar";
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useContext } from "react";
import { MainContext } from '../helpers/MainContext';
import MasterTable from "../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import TabActions from "../components/TabActions";

const columns = [
    {
        accessorKey: 'fullName',
        header: 'Full Name'
    },
    {
        accessorKey: 'studentNo',
        header: 'Student No.'
    },
    {
        accessorKey: 'gradeLevel',
        header: 'Grade Level'
    },
    {
        accessorKey: 'nationality',
        header: 'Nationality'
    },
    {
        accessorKey: 'strand',
        header: 'Strand'
    },
    {
        accessorKey: 'section',
        header: 'Section'
    },
    {
        accessorKey: 'adviser',
        header: 'Adviser'
    },
    {
        accessorKey: 'paymentTerm',
        header: 'Payment Term'
    }
];

const Students = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/students`);
    const { searchQuery,setSearchQuery,session,role,genericPath } = useContext(MainContext);

    const { enqueueSnackbar } = useSnackbar();
    
    const navigate = useNavigate();
    
    const deleteStudent = async (id) => {
        try {
            const removeStudent = await axios.put(`${baseUrl()}/student/${id}`, { role,session,recordStatus: 'Deleted' });
            enqueueSnackbar(removeStudent.data.mssg, { 
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
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting student record', { 
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

    const goToEdit = (id) => navigate(`/${genericPath}/edit-student/${id}`);

    const formattedStudents = records?.map(student => ({
        ...student,
        fullName: `${student.firstName} ${student.middleName} ${student.lastName}`,
        studentNo: student?.studentNo ?? 'Not Registered yet',
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel ?? 'Not assigned yet',
        nationality: student?.nationality?.nationality ?? 'Not assigned yet',
        strand: student?.academicId?.strandId?.strand ?? 'Not Assigned yet',
        section: student?.academicId?.sectionId?.section ?? 'Not Assigned yet',
        adviser: `${student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser.firstName} ${student?.academicId?.sectionId?.adviser.lastName}` : 'Not Assigned'}`,
        paymentTerm: student?.academicId?.paymentTermId?.term ?? 'Not Assigned'
    }))


    return (
        <main className="p-2">
            
            <TabActions title="Student" redirect="new-student" />

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={formattedStudents}
                    onDelete={deleteStudent}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div>
        </main>
    )
}

export default Students;
