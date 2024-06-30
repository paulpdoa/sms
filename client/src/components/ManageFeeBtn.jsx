import { Link } from 'react-router-dom';

const ManageFeeBtn = () => {
    return (
        <div>
            <Link to='/registrar/create-fees' className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md">Manage Fees</Link>                
        </div>
    )
}

export default ManageFeeBtn;