import { MainContext } from '../../helpers/MainContext';
import { useContext } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useLocation } from 'react-router-dom';

const AddNewData = ({ label,onShow }) => {

    const { session,isFreshYear } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear?.isYearDone

    

    const location = useLocation();
    const isSchoolYearPage = location.pathname.includes('school-year');
    console.log(isFreshYear,isYearDone,isSchoolYearPage);

    return (
        <>
            { (isFreshYear && isSchoolYearPage) && (
                <button disabled={isFreshYear ? false : true} onClick={() => onShow(prevVal => !prevVal)} className={`cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded-md`}>
                    { `Add New ${label}` }
                </button>
            )}

            { (!isYearDone && isFreshYear === null && !isSchoolYearPage) ? (
                <button disabled={isYearDone ? true : false} onClick={() => onShow(prevVal => !prevVal)} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded-md`}>
                    { `Add New ${label}` }
                </button>
            ) : (
                ''
            ) }
        </>
    )
}

export default AddNewData;