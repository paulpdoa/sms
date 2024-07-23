import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext } from "react";
import { MainContext } from "../../helpers/MainContext";
import { GiBookshelf } from "react-icons/gi";

const AddTextbookBtn = () => {
    const { session } = useContext(MainContext);

    const { records:schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone;
    
    return (
        <div>
            <Link to='/new-textbook' onClick={(e) => isYearDone && e.preventDefault() } className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded-md ${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <GiBookshelf /> Add New Textbook
            </Link>                
        </div>
    )
}

export default AddTextbookBtn;