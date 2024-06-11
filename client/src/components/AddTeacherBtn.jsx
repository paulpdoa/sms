import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddTeacherBtn = () => {
    return (
        <div>
            <Link to='/school-admin/new-teacher' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md"><PiStudentFill /> Add New Teacher</Link>                
        </div>
    )
}

export default AddTeacherBtn;