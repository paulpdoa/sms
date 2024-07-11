import { MainContext } from '../../helpers/MainContext';
import { useContext } from 'react';

const AddNewData = ({ label,onShow }) => {

    const { showForm } = useContext(MainContext);
    
    return (
        <button onClick={() => onShow(prevVal => !prevVal)} className={`flex items-center gap-2 ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'} text-gray-100 p-2 rounded-md`}>
            { showForm ? 'Close form' : `Add New ${label}` }
        </button>
    )
}

export default AddNewData;