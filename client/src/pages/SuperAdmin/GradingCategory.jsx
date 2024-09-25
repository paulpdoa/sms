import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from "../../helpers/MainContext";
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';

const GradingCategory = () => {

    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role } = useContext(MainContext);

    const { records: gradingCategories } = useFetch(`${baseUrl()}/grading-categories`);

    const [gradingCategory,setGradingCategory] = useState('');
    const [errors,setErrors] = useState({ gradingCategory: '' });
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        { accessorKey: 'gradingCategory', header: 'Category', editable: true }
    ]

    const form = () => (
        <>
            <h1 className="font-semibold text-xl text-gray-700">Add New Grading Category</h1>

            <div className="flex flex-col mt-1">
                <label className="text-sm" htmlFor="grading category">Grading Category</label>
                <input className={`outline-none p-1 rounded-md border ${errors.gradingCategory ? 'border-red-500' : 'border-gray-300'}`} type="text" onChange={(e) => setGradingCategory(e.target.value)} />
                { errors.gradingCategory && <span className="text-xs text-red-500">{errors.gradingCategory}</span> }
            </div>
        </>
    )

    const addGradingCategory = async (e) => {
        e.preventDefault();
        
        if(!gradingCategory) {
            setErrors({ gradingCategory: 'Grading category cannot be empty' });
            return enqueueSnackbar('Grading category is a required field', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
                onClose: () => {
                    setErrors({ gradingCategory: '' });
                }
            });
        }
        
        try {
            const data = await axios.post(`${baseUrl()}/grading-category`, { gradingCategory, sessionId: currentSession, inputter: currentUserId });
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding grade category record', { 
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

    const updateGradingCategory = async(id,updatedData) => {
        try {
            const data = await axios.patch(`${baseUrl()}/grading-category/${id}`,{ gradingCategory: updatedData.gradingCategory, inputter: currentUserId });
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating grade category record', { 
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

    const deleteGradingCategory = async(id) => {
        try {
            const data = await axios.put(`${baseUrl()}/grading-category/${id}`);
            enqueueSnackbar(data.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload()
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while deleting grade category record', { 
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

    return (
        <main className="p-2 relative">
            <TabActions title="Grading Categories" />
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
        </main>
    )
}

export default GradingCategory;