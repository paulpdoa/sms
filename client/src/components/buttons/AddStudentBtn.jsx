import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddStudentBtn = () => {
    return (
        <div>
            <Link to='/registrar/new-student' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md"><PiStudentFill /> Add New Student</Link>                
        </div>
    )
}

export default AddStudentBtn;