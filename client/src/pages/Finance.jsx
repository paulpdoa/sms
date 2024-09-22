import { useContext } from 'react';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { MainContext } from '../helpers/MainContext';
import { useNavigate } from 'react-router-dom';
import MasterTable from '../components/MasterTable';
import { useSnackbar } from 'notistack';
import TabActions from '../components/TabActions';

const Finance = () => {
    const { records: financeLists, isLoading } = useFetch(`${baseUrl()}/finance`);
    const { searchQuery,setSearchQuery,role,dateFormatter } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'sex', header: 'Gender' },
        { accessorKey: 'birthDate', header: 'Date Of Birth' },
        { accessorKey: 'nationalityId.nationality', header: 'Nationality' }
    ];

    const financeData = financeLists?.map(fl => ({
        ...fl,
        fullName: `${fl.firstName} ${fl.middleName} ${fl.lastName}`,
        birthDate: dateFormatter(fl.dateOfBirth)
    }));


    const deleteFinance = async (id) => {
        try {
            const removeFinance = await axios.put(`${baseUrl()}/finance/${id}`, { role,recordStatus: 'Deleted' });
            enqueueSnackbar(removeFinance.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting finance record', { 
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

    const goToEdit = (id) => navigate(`/master/edit-finance/${id}`)

    return (
        <main className="p-2">
            <TabActions title="Finance" redirect="new-finance" />
            <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                <MasterTable 
                    columns={columns}
                    data={financeData}
                    onDelete={deleteFinance}
                    searchQuery={searchQuery}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                />
            </div> 
        </main>
    );
};

export default Finance;
