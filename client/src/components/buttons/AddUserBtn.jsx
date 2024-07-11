import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddUserBtn = () => {
    return (
        <div>
            <Link to='/new-user' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md">
                <PiStudentFill /> Add New User
            </Link>                
        </div>
    )
}

export default AddUserBtn;