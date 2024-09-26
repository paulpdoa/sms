import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const NewUser = () => {

    const navigate = useNavigate();
    const { role: userRole, currentUserId,genericPath,showError } = useContext(MainContext);
    const { records: roles } = useFetch(`${baseUrl()}/user-roles`);

    const { enqueueSnackbar } = useSnackbar();

    const [role,setRole] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const [errors,setErrors] = useState({ role: '', username: '', password: '', confirmPassword: '' });

    const addUser = async (e) => {
        e.preventDefault();

        if(!role) return showError('role','Role cannot be empty','Role is a required field', setErrors);
        if(!username) return showError('username', 'Username cannot be empty', 'Username is a required field',setErrors);
        if(!password) return showError('password','Password cannot be empty', 'Password is a required field', setErrors);
        if(!confirmPassword) return showError('confirmPassword', 'Confirm password cannot be empty', 'Confirm password is a required field', setErrors);

        // Validate passwords match
        if (password !== confirmPassword) {
            return enqueueSnackbar('Passwords do not match', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
           
        }
        
        try {
            const newUser = await axios.post(`${baseUrl()}/user`,{ firstName,middleName,lastName,username,role,password,confirmPassword,userRole,inputter: currentUserId });
            
            // To be checked why token is placed in localstorage
            localStorage.setItem('user',newUser.data.token);
            enqueueSnackbar(newUser.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () =>{
                    navigate(`/${genericPath}/users`)
                }
            });
        } catch(err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={addUser} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Add User</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderSelect('role', 'Role', role, setRole, roles.filter(role => role.userRole.toLowerCase() === 'registrar' || role.userRole.toLowerCase() === 'super admin'), 'Select role', true,errors)}
                    {renderInput('username', 'Username', username, setUsername, 'text',errors)}
                    {renderInput('password', 'Password', password, setPassword, 'password',errors)}
                    {renderInput('confirmPassword', 'Confirm Password', confirmPassword, setConfirmPassword, 'password',errors)}                
                </div>

                <button type="submit" className="bg-customView text-white text-sm p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Add User
                </button>
                <button onClick={() => navigate(`/${genericPath}/users`)} type="button" className="bg-customCancel text-white text-sm p-3 ml-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
        </main>
    )
}

export default NewUser;

const renderInput = (id, label, value, onChange, type, errors) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        { errors[id] && <span className="text-xs text-red-500">{errors[id]}</span> }
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, required = false,errors) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border ${errors['role'] ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option['userRole']}
                </option>
            ))}
        </select>
        { errors['role'] && <span className="text-xs text-red-500">{errors['role']}</span> }
    </div>
);