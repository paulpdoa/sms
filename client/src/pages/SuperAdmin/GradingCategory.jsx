import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const GradingCategory = () => {

    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role } = useContext(MainContext);

    const { records: gradingCategories } = useFetch(`${baseUrl()}/grading-categories`);


    const [gradingCategory,setGradingCategory] = useState('');

    const columns = [
        { accessorKey: 'gradingCategory', header: 'Category', editable: true }
    ]

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Grading Category</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="grading category">Grading Category</label>
                <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setGradingCategory(e.target.value)} />
            </div>
        </>
    )

    const addGradingCategory = async (e) => {
        e.preventDefault();

        try {
            const data = await axios.post(`${baseUrl()}/grading-category`, { gradingCategory, sessionId: currentSession, inputter: currentUserId });
            toast.success(data.data.mssg, {
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
            },2000)
        } catch(err) {
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

    const updateGradingCategory = async(id,updatedData) => {
        try {
            const data = await axios.patch(`${baseUrl()}/grading-category/${id}`,{ gradingCategory: updatedData.gradingCategory, inputter: currentUserId });
            toast.success(data.data.mssg, {
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
            },2000)
        } catch(err) {
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

    const deleteGradingCategory = async(id) => {
        try {
            const data = await axios.put(`${baseUrl()}/grading-category/${id}`);
            toast.success(data.data.mssg, {
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
            },2000)
             
        } catch(err) {
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

    return (
        <main className="p-2 relative">
            <TabActions title="Grading Category" />

            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addGradingCategory,setShowForm)}
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable
                        columns={columns}
                        data={gradingCategories}
                        searchQuery={searchQuery}
                        onUpdate={updateGradingCategory}
                        onDelete={deleteGradingCategory}
                        // isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default GradingCategory;