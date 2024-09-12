import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { MainContext } from "../../helpers/MainContext";

const AddReligionBtn = () => {
    const { genericPath } = useContext(MainContext);

    return (
        <div>
            <Link to={`/${genericPath}/new-religion`} className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md"><PiStudentFill /> Add New Religion</Link>                
        </div>
    )
}

export default AddReligionBtn;