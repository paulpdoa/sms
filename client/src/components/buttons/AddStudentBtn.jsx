import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext } from "react";
import { MainContext } from "../../helpers/MainContext";

const AddStudentBtn = () => {
    const { session } = useContext(MainContext);

    const { records:schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone;
    return (
        <div>
            <Link onClick={(e) => isYearDone && e.preventDefault() } to='/registrar/new-student' className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded-md ${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'}`}><PiStudentFill /> Add New Student</Link>                
        </div>
    )
}

export default AddStudentBtn;