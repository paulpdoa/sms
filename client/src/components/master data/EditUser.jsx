import { useParams,useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from "../../baseUrl";
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { MainContext } from "../../helpers/MainContext";
import { useCookies } from 'react-cookie';
import { useSnackbar } from "notistack";

const EditUser = () => {
    const { id } = useParams();
    const { records: user } = useFetch(`${baseUrl()}/user/${id}`);
    const { records: userRoles } = useFetch(`${baseUrl()}/user-roles`);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']); // Importing removeCookie

    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive,setIsActive] = useState('');
    const [isAllowedToLogin,setIsAllowedToLogin] = useState(false);

    const [currentRole,setCurrentRole] = useState('');
    
    const { role,currentUserId, genericPath } = useContext(MainContext);

    useEffect(() => {
       if(user) {
            setFirstName(user?.firstName || '');
            setMiddleName(user?.middleName || '');
            setLastName(user?.lastName || '');
            setUsername(user?.username || '');
            setUserRole(user?.role || '');
            setIsActive(user?.isActive || ''); 
            setCurrentRole(user?.role?.userRole || '');
            setIsAllowedToLogin(user?.isAllowedToLogin || '');
       }
    },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
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
                isActive,
                inputter: currentUserId,
                isAllowedToLogin
            });
            enqueueSnackbar(newData.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    // Set the local storage if the user updated his role
                    // localStorage.setItem('role',userRole);
                    // console.log(currentRole);
                    
                    // Logout the user after updating his profile
                    if(user._id === currentUserId) {
                        setTimeout(() => {
                            ['id', 'currentUserId', 'session', 'role', 'username'].forEach(lclstg => localStorage.removeItem(lclstg));
                            removeCookie('userToken',{ path: '/login' });
                        },2000)
                    } else {
                        setTimeout(() => {
                            navigate(`/${genericPath}/users`);
                        }, 2000);
                    }
                }
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
                preventDuplicate: true
            });
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Edit User: {user?.username}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('username', 'Username', username, setUsername, 'text')}
                    {renderSelect('userRole', 'User Role', userRole, setUserRole, userRoles, 'Select User Role',currentRole)}
                    { currentRole === 'Student' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Allowed</label>
                            <select
                                onChange={(e) => setIsAllowedToLogin(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={isAllowedToLogin || ''} hidden>{ isAllowedToLogin ? 'Allowed' : 'Don\'t Allow' }</option>
                                <option value={true}>Allow</option>
                                <option value={false}>Don't Allow</option>
                            </select>
                        </div>
                    )}
                    {renderInput('password', 'Password', password, setPassword, 'password')}
                    {renderInput('confirmPassword', 'Confirm Password', confirmPassword, setConfirmPassword, 'password')}
                </div>

                <button type="submit" className="bg-customView text-white text-sm p-3 rounded-md hover:bg-customHighlight focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Update User
                </button>
                <button onClick={() => navigate(-1)} type="button" className="bg-customCancel text-white text-sm p-3 ml-3 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value={currentValue || ''} hidden>{ currentValue ?? placeholder }</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
            <option value="">N/A</option>
        </select>
    </div>
);
