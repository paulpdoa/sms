import { MainContext } from '../../helpers/MainContext';
import { useContext } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddNewData = ({ label, onShow,redirect }) => {
    const { session, isFreshYear, genericPath } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear?.isYearDone;
    const location = useLocation();
    const isSchoolYearPage = location.pathname.includes('school-year');
    const navigate = useNavigate();

    const buttonStyles = "flex items-center gap-2 text-white p-2 rounded-md text-sm transition-colors duration-200";
    const enabledStyles = "bg-customView hover:bg-customHighlight";
    const disabledStyles = "bg-gray-400 cursor-not-allowed";

    const renderButton = (isDisabled, label) => (
        <button
            disabled={isDisabled}
            onClick={() => redirect ? navigate(`/${genericPath}/${redirect}`) : onShow(prevVal => !prevVal)}
            className={`${buttonStyles} ${isDisabled ? disabledStyles : enabledStyles}`}
        >
            {`Add New ${label}`}
        </button>
    );

    return (
        <>
            {isFreshYear && isSchoolYearPage && renderButton(false, label)}
            {!isYearDone && isFreshYear === null && !isSchoolYearPage && renderButton(isYearDone, label === 'Manage Fees' ? 'Fees' : label)}
        </>
    );
};

export default AddNewData;
