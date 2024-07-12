import { MainContext } from '../../helpers/MainContext';
import { useContext } from 'react';

const AddNewData = ({ label,onShow }) => {

    const { showForm } = useContext(MainContext);
    
    return (
        <button onClick={() => onShow(prevVal => !prevVal)} className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-gray-100 p-2 rounded-md`}>
            { `Add New ${label}` }
        </button>
    )
}

export default AddNewData;