import AddStudentBtn from "../components/buttons/AddStudentBtn";
import DateTime from "../components/DateTime";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useContext } from "react";
import { MainContext } from '../helpers/MainContext';
import ReusableTable from '../components/ReusableTable';
import MasterTable from "../components/MasterTable";
import { useNavigate } from 'react-router-dom';

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
    const { searchQuery,setSearchQuery,session,role } = useContext(MainContext);
    
    const navigate = useNavigate();
    
    const deleteStudent = async (id) => {
        try {
            const removeStudent = await axios.delete(`${baseUrl()}/student/${id}`, { data: { role,session } });
            toast.success(removeStudent.data.mssg, {
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

    const goToEdit = (id) => navigate(`/registrar/edit-student/${id}`);

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
            <div className="mx-4 my-2">
                <h1 className="text-2xl text-gray-700 font-semibold">Students</h1>
                <div className="flex items-center justify-between mt-3">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddStudentBtn />
                </div>
            </div>

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
            <ToastContainer />
        </main>
    )
}

export default Students;
