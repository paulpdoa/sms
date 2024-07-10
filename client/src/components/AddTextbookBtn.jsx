import { PiStudentFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddTextbookBtn = () => {
    return (
        <div>
            <Link to='/new-textbook' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md"><PiStudentFill /> Add New Textbook</Link>                
        </div>
    )
}

export default AddTextbookBtn;