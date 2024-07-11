import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddSiblingBtn = () => {
    return (
        <div>
            <Link to='/registrar/new-sibling' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md"><PiStudentFill /> Add New Sibling</Link>                
        </div>
    )
}

export default AddSiblingBtn;