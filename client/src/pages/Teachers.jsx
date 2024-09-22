import { useContext } from 'react';
import AddTeacherBtn from "../components/buttons/AddTeacherBtn";
import Searchbar from "../components/Searchbar";
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { MainContext } from '../helpers/MainContext';
import { useNavigate } from 'react-router-dom';
import MasterTable from '../components/MasterTable';
import { useSnackbar } from 'notistack';
import TabActions from '../components/TabActions';

const columns = [
    {
        accessorKey: 'firstName',
        header: 'First Name',
    },
    {
        accessorKey: 'middleName',
        header: 'Middle Name',
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Date Of Birth'
    },
    {
        accessorKey: 'sex.gender',
        header: 'Gender'
    },
    {
        accessorKey: 'nationality.nationality',
        header: 'Nationality'
    }
];

const Teachers = () => {
    const { records, isLoading } = useFetch(`${baseUrl()}/teachers`);
    const { searchQuery,setSearchQuery,role,genericPath, dateFormatter } = useContext(MainContext);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const recordsWithoutInputter = records.map(record => ({
        ...record,
        sex: {
            gender: record?.sex
        },
        nationality: {
            _id: record?.nationality?._id,
            nationality: record?.nationality?.nationality || 'Not Assigned'
        },
        dateOfBirth: dateFormatter(record.dateOfBirth)
    }))

    const deleteTeacher = async (id) => {
        try {
            const removeTeacher = await axios.put(`${baseUrl()}/teacher/${id}`, { role,recordStatus: 'Deleted' });
            enqueueSnackbar(removeTeacher.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting teacher record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    const goToEdit = (id) => navigate(`/${genericPath}/edit-teacher/${id}`)

    return (
        <main className="p-2">
            <TabActions title="Teacher" redirect="new-teacher" />

            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={recordsWithoutInputter}
                    onDelete={deleteTeacher}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div> 
        </main>
    );
};

export default Teachers;
