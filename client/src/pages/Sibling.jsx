import Searchbar from "../components/Searchbar";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import AddSiblingBtn from "../components/buttons/AddSiblingBtn";
import MasterTable from '../components/MasterTable';
import { MainContext } from '../helpers/MainContext';
import { useContext } from 'react';
import { useSnackbar } from 'notistack';
import TabActions from "../components/TabActions";

const Sibling = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/siblings`);
    const { searchQuery,setSearchQuery,role,genericPath } = useContext(MainContext);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        {
            accessorKey: 'fullName',
            header: 'Full Name',
        },
        {
           accessorKey: 'siblingName',
           header: 'Sibling'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        }
    ];

    const siblingData = records?.map(sibling => ({
        ...sibling,
        fullName: `${sibling.firstName} ${sibling.middleName} ${sibling.lastName}`,
        siblingName: `${sibling.studentId.firstName} ${sibling.studentId.middleName} ${sibling.studentId.lastName}`
    }))

    const deleteSibling = async (id) => {
        try {
            const removeSibling = await axios.put(`${baseUrl()}/sibling/${id}`,{ role,recordStatus:'Deleted' });
            enqueueSnackbar(removeSibling.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting sibling record', { 
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

    const goToEdit = id => navigate(`/${genericPath}/edit-sibling/${id}`);

    return (
        <main className="p-2">
            <TabActions title="Sibling" redirect="new-sibling" />
            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={siblingData || []}
                    onDelete={deleteSibling}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Sibling;