import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import AddParentBtn from "../components/buttons/AddParentBtn";
import { useContext } from "react";
import { MainContext } from '../helpers/MainContext';
import MasterTable from '../components/MasterTable';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import TabActions from "../components/TabActions";

const columns = [
    {
        accessorKey: 'motherName',
        header: 'Mother Name',
    },
    {
        accessorKey: 'fatherName',
        header: 'Father Name',
    },
    {
        accessorKey: 'guardianName',
        header: 'Guardian Name',
    },
    {
        accessorKey: 'studentId.fullname',
        header: 'Student Name',
    }
]

const Parents = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/parents`);
    const { searchQuery,setSearchQuery,role,currentUserId,genericPath } = useContext(MainContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const deleteParent = async (id) => {
        try {
            const removeParent = await axios.delete(`${baseUrl()}/parent/${id}`,{ role,recordStatus: 'Deleted' });
            enqueueSnackbar(removeParent.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg, { 
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

    const goToEdit = (id) => navigate(`/${genericPath}/edit-parent/${id}`)

    const recordsWithoutInputter = records.filter(record => record.studentId !== null).map(record => ({
        ...record,
        studentId: {
            fullname: record?.studentId?.firstName + ' ' + record?.studentId?.middleName + ' ' + record?.studentId?.lastName
        }
    }))

    return (
        <main className="p-2">
            <TabActions title="Parents" redirect='new-parent' />
            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={recordsWithoutInputter}
                    onDelete={deleteParent}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div> 
        </main>
    )
}

export default Parents;