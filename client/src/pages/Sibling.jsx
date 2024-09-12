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



const Sibling = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/siblings`);
    const { searchQuery,setSearchQuery,role,genericPath } = useContext(MainContext);

    const navigate = useNavigate();

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

    console.log(records);

    const siblingData = records?.map(sibling => ({
        ...sibling,
        fullName: `${sibling.firstName} ${sibling.middleName} ${sibling.lastName}`,
        siblingName: `${sibling.studentId.firstName} ${sibling.studentId.middleName} ${sibling.studentId.lastName}`
    }))

    const deleteSibling = async (id) => {
        try {
            const removeSibling = await axios.put(`${baseUrl()}/sibling/${id}`,{ role,recordStatus:'Deleted' });
            toast.success(removeSibling.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            },2000)
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    const goToEdit = id => navigate(`/${genericPath}/edit-sibling/${id}`);

    return (
        <main className="p-2">
            <div className="mx-4 my-2">
                <h1 className="text-2xl text-gray-700 font-semibold">Sibling</h1>
                <div className="flex items-center justify-between mt-3">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddSiblingBtn />
                </div>
            </div>

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