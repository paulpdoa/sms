import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewUser = () => {

    const navigate = useNavigate();
    const { role: userRole, currentUserId } = useContext(MainContext);
    const { records: roles } = useFetch(`${baseUrl()}/user-roles`);

    const [firstName,setFirstName] = useState('');
    const [middleName,setMiddleName] = useState('');
    const [lastName,setLastName] = useState('');
    const [role,setRole] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const addUser = async (e) => {
        e.preventDefault();
        try {
            const newUser = await axios.post(`${baseUrl()}/user`,{ firstName,middleName,lastName,username,role,password,confirmPassword,userRole,inputter: currentUserId });
            localStorage.setItem('user',newUser.data.token);
            toast.success(newUser.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                navigate('/users')
            },2000)
        } catch(err) {
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={addUser} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Add User</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* {renderInput('firstName', 'First Name', firstName, setFirstName, 'text')}
                    {renderInput('middleName', 'Middle Name', middleName, setMiddleName, 'text')}
                    {renderInput('lastName', 'Last Name', lastName, setLastName,'text')} */}
                    {renderSelect('userRole', 'Role', role, setRole, roles, 'Select role', true)}
                    {renderInput('username', 'Username', username, setUsername, 'text')}
                    {renderInput('password', 'Password', password, setPassword, 'password')}
                    {renderInput('confirmPassword', 'Confirm Password', confirmPassword, setConfirmPassword, 'password')}                
                </div>

                <button type="submit" className="bg-blue-500 text-white text-sm p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                    Add User
                </button>
                <button onClick={() => navigate(-1)} type="button" className="bg-red-500 text-white text-sm p-3 ml-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
            <ToastContainer />
        </main>
    )
}

export default NewUser;

const renderInput = (id, label, value, onChange, type, extraProps = {}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            {...extraProps}
            required
        />
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, required = false) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required={required}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
        </select>
    </div>
);