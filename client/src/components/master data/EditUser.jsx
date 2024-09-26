import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MainContext } from '../../helpers/MainContext';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

const EditUser = () => {
    const { id } = useParams();
    const { records: user } = useFetch(`${baseUrl()}/user/${id}`);
    const { records: userRoles } = useFetch(`${baseUrl()}/user-roles`);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState('');
    const [isAllowedToLogin, setIsAllowedToLogin] = useState(false);

    const [currentRole, setCurrentRole] = useState('');
    const [errors, setErrors] = useState({ role: '', username: '', password: '', confirmPassword: '' });

    const { role, currentUserId, genericPath, showError } = useContext(MainContext);

    useEffect(() => {
        if (user) {
            setFirstName(user?.firstName || '');
            setMiddleName(user?.middleName || '');
            setLastName(user?.lastName || '');
            setUsername(user?.username || '');
            setUserRole(user?.role || '');
            setIsActive(user?.isActive || '');
            setCurrentRole(user?.role?.userRole || '');
            setIsAllowedToLogin(user?.isAllowedToLogin || false); // Adjust default value
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role) return showError('role', 'Role cannot be empty', 'Role is a required field', setErrors);
        if (!username) return showError('username', 'Username cannot be empty', 'Username is a required field', setErrors);

        // Validate passwords match
        if (password && password !== confirmPassword) {
            return enqueueSnackbar('Passwords do not match', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
        }

        try {
            const updatedUser = await axios.patch(`${baseUrl()}/user/${id}`, {
                firstName,
                middleName,
                lastName,
                username,
                userRole,
                password,
                confirmPassword,
                role,
                isActive,
                inputter: currentUserId,
                isAllowedToLogin: currentRole === 'Student' ? isAllowedToLogin : undefined // Only send this field for Students
            });

            enqueueSnackbar(updatedUser.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    if (user._id === currentUserId) {
                        setTimeout(() => {
                            ['id', 'currentUserId', 'session', 'role', 'username'].forEach(lclstg => localStorage.removeItem(lclstg));
                            removeCookie('userToken', { path: '/login' });
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            navigate(`/${genericPath}/users`);
                        }, 2000);
                    }
                },
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.error || 'An error occurred while updating user record', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
        }
    };

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Edit User: {user?.username}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('username', 'Username', username, setUsername, 'text', errors)}
                    {renderSelect(
                        'userRole',
                        'User Role',
                        userRole,
                        setUserRole,
                        userRoles.filter((role) => role.userRole.toLowerCase() === 'registrar' || role.userRole.toLowerCase() === 'super admin'),
                        'Select User Role',
                        currentRole,
                        errors
                    )}

                    {currentRole === 'Student' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Allowed to Login</label>
                            <select
                                value={isAllowedToLogin}
                                onChange={(e) => setIsAllowedToLogin(e.target.value === 'true')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={true}>Allow</option>
                                <option value={false}>Don't Allow</option>
                            </select>
                        </div>
                    )}

                    {renderInput('password', 'Password', password, setPassword, 'password', errors)}
                    {renderInput('confirmPassword', 'Confirm Password', confirmPassword, setConfirmPassword, 'password', errors)}
                </div>

                <button type="submit" className="bg-customView text-white text-sm p-3 rounded-md hover:bg-customHighlight focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Update User
                </button>
                <button onClick={() => navigate(-1)} type="button" className="bg-customCancel text-white text-sm p-3 ml-3 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400">
                    Cancel
                </button>
            </form>
        </main>
    );
};

export default EditUser;

const renderInput = (id, label, value, onChange, type, errors) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors[id] && <span className="text-xs text-red-500">{errors[id]}</span>}
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, currentValue, errors) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value={currentValue || ''} hidden>{currentValue ?? placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
        </select>
        {errors['role'] && <span className="text-xs text-red-500">{errors['role']}</span>}
    </div>
);
