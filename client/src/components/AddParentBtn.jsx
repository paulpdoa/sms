import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddParentBtn = () => {
    return (
        <div>
            <Link to='/registrar/new-parent' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md"><PiStudentFill /> Add New Parent</Link>                
        </div>
    )
}

export default AddParentBtn;