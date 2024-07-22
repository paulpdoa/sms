import { MainContext } from '../../helpers/MainContext';
import { useContext } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';

const AddNewData = ({ label,onShow }) => {

    const { session } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear?.isYearDone
    
    return (
        <button disabled={isYearDone ? true : false} onClick={() => onShow(prevVal => !prevVal)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-green-600 hover:bg-green-700 text-gray-100 p-2 rounded-md`}>
            { `Add New ${label}` }
        </button>
    )
}

export default AddNewData;