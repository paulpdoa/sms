import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../helpers/MainContext';
import { useSnackbar } from 'notistack';

const Profile = () => {
    const { id } = useParams();
    const { records: user } = useFetch(`${baseUrl()}/user/${id}`);
    const { currentUserId } = useContext(MainContext);

    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [showPassword, setShowPassword] = useState(false); // state to manage password visibility

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setMiddleName(user.middleName);
            setLastName(user.lastName);
            setUsername(user.username);
            setProfilePictureUrl(`${baseUrl()}${user.profilePictureUrl}`);  // assuming you have a URL for the profile picture in user data
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };
    

    const handleProfileUpdate = async () => {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('confirmPassword',confirmPassword);
        formData.append('inputter', currentUserId);

        if (password === confirmPassword && password !== '') {
            formData.append('password', password);
        }
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.patch(`${baseUrl()}/user/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfilePictureUrl(response.data.profilePictureUrl); // assuming response contains the updated URL

            enqueueSnackbar(response.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate('/');
                }
            });
        } catch (err) {
            console.error('Error updating profile:', error);
            enqueueSnackbar(err.response.data.mssg, { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="w-4/5 bg-white rounded-lg shadow-md p-8">
                <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Hi, {username}</h1>
                    <div className="flex justify-center mb-4">
                    <img
                        src={profilePictureUrl ? profilePictureUrl : '/avatar/avatar.png'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col relative">
                            <label className="mb-1 font-medium text-gray-700">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-gray-600 text-xs"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="flex flex-col relative">
                            <label className="mb-1 font-medium text-gray-700">Confirm Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-gray-600 text-xs"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Profile Picture:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="py-2"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-1/2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Update Profile
                        </button>
                        <button
                            type="button"
                            className="w-full py-2 px-4 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Profile;
