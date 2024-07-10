import DateTime from "../DateTime";
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from "../../baseUrl";
import { useState,useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EditUser = () => {
    const { id } = useParams();
    const { records: user } = useFetch(`${baseUrl()}/user/${id}`);
    const { records: userRoles } = useFetch(`${baseUrl()}/user-roles`);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive,setIsActive] = useState('');

    const [currentRole,setCurrentRole] = useState('');
    
    const role = localStorage.getItem('role');

    useEffect(() => {
       if(user) {
            setFirstName(user?.firstName || '');
            setMiddleName(user?.middleName || '');
            setLastName(user?.lastName || '');
            setUsername(user?.username || '');
            setUserRole(user?.role || '');
            setIsActive(user?.isActive || ''); 
            setCurrentRole(user?.role?.userRole)
       }
    },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
            return;
        }

        try {
            const newData = await axios.patch(`${baseUrl()}/user/${id}`, {
                firstName,
                middleName,
                lastName,
                username,
                userRole,
                password,
                confirmPassword,
                role,
                isActive
            });
            toast.success(newData.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            toast.error('Error has occurred while updating user record', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    }

    return (
        <main>
            <DateTime />
            <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-lg p-8 rounded-lg max-w-4xl mx-auto border border-gray-200">
                <h1 className="font-bold text-green-600 text-2xl mb-4">Edit User: {user?.username}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('firstName', 'First Name', firstName, setFirstName, 'text')}
                    {renderInput('middleName', 'Middle Name', middleName, setMiddleName, 'text')}
                    {renderInput('lastName', 'Last Name', lastName, setLastName, 'text')}
                    {renderInput('username', 'Username', username, setUsername, 'text')}
                    {renderSelect('userRole', 'User Role', userRole, setUserRole, userRoles, 'Select User Role',currentRole)}
                    {renderInput('password', 'Password', password, setPassword, 'password')}
                    {renderInput('confirmPassword', 'Confirm Password', confirmPassword, setConfirmPassword, 'password')}
                </div>

                <button type="submit" className="bg-green-600 text-white text-sm p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                    Update User
                </button>
            </form>
            <ToastContainer />
        </main>
    )
}

export default EditUser;

const renderInput = (id, label, value, onChange, type) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder,currentValue) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            <option hidden>{currentValue ?? placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
        </select>
    </div>
);