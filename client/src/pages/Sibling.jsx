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

const columns = [
    {
        header: 'Full Name',
    },
    {
        header: 'Sibling Name',
    },
    {
        header: 'Email'
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Sibling = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/siblings`);
    const { searchQuery,setSearchQuery,role } = useContext(MainContext);

    const deleteSibling = async (id) => {
        try {
            const removeSibling = await axios.delete(`${baseUrl()}/sibling/${id}`);
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

    const goToEdit = id => navigate(`/registrar/edit-sibling/${id}`);

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
                    data={records}
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