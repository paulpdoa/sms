import { GiTeacher } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext } from "react";
import { MainContext } from "../../helpers/MainContext";
const AddFinanceBtn = () => {

    const { session,genericPath } = useContext(MainContext);

    const { records:schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone;
    
    return (
        <div>
            { !isYearDone && (
                <Link to={`/${genericPath}/new-finance`} onClick={(e) => isYearDone && e.preventDefault() } className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded-md ${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <GiTeacher /> Add New Finance
                </Link> 
            ) }               
        </div>
    )
}

export default AddFinanceBtn;