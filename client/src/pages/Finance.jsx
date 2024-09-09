import { useContext } from 'react';
import AddTeacherBtn from "../components/buttons/AddTeacherBtn";
import Searchbar from "../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../baseUrl";
import axios from "axios";
import { MainContext } from '../helpers/MainContext';
import { useNavigate } from 'react-router-dom';
import MasterTable from '../components/MasterTable';
import AddFinanceBtn from '../components/buttons/AddFinanceBtn';

const Finance = () => {
    const { records: financeLists, isLoading } = useFetch(`${baseUrl()}/finance`);
    const { searchQuery,setSearchQuery,role } = useContext(MainContext);

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
        birthDate: new Date(fl.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }));

    console.log(financeData);

   

    const deleteFinance = async (id) => {
        try {
            const removeFinance = await axios.put(`${baseUrl()}/finance/${id}`, { role,recordStatus: 'Deleted' });
            toast.success(removeFinance.data.mssg, {
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
            }, 2000);
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
    };

    const goToEdit = (id) => navigate(`/master/edit-finance/${id}`)

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="mx-4 my-2">
                <h1 className="text-2xl text-gray-700 font-semibold">Finance</h1>
                <div className="flex items-center justify-between mt-3">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddFinanceBtn />
                </div>
            </div>

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
            <ToastContainer />          
        </main>
    );
};

export default Finance;
