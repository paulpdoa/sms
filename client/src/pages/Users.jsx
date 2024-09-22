import { useNavigate } from 'react-router-dom';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { useContext } from 'react';
import MasterTable from "../components/MasterTable";
import { MainContext } from "../helpers/MainContext";
import { useSnackbar } from 'notistack';
import TabActions from '../components/TabActions';

const Users = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/users`);
    
    const navigate = useNavigate();

    const { role: userRole,currentUserId,searchQuery,setSearchQuery,genericPath } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    
    const columns = [
        {
            accessorKey: 'username',
            header: 'Username',
        },
        {
            accessorKey: 'role.userRole',
            header: 'Role',
        }
    ]

    const deleteUser = async (id) => {
        try {
            const removeUser = await axios.put(`${baseUrl()}/user/${id}`,{ role: userRole, recordStatus: 'Deleted' });
            enqueueSnackbar(removeUser.data.mssg, { 
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

    

    const recordsWithoutInputter = records?.filter(record => record.recordStatus === 'Live').map(record => ({
        ...record,
    }));

    const goToEdit = (id) => navigate(`/${genericPath}/edit-user/${id}`)

    return (
        <main className="p-2">
            <TabActions title="Users" redirect="new-user" />

            <div className="gap-2 mt-5">
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteUser}
                        goToEdit={goToEdit}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
        </main>
    )
}

export default Users;