import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../helpers/MainContext';

const Profile = () => {
    const { id } = useParams();
    const { records: user } = useFetch(`${baseUrl()}/user/${id}`);
    const { currentUserId } = useContext(MainContext);

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
            setProfilePictureUrl(user.profilePictureUrl);  // assuming you have a URL for the profile picture in user data
        }
    }, [user]);

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setProfilePictureUrl(URL.createObjectURL(e.target.files[0]));
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

            toast.success(response.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            
            setProfilePictureUrl(response.data.profilePictureUrl); // assuming response contains the updated URL

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="w-4/5 bg-white rounded-lg shadow-md p-8">
                <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Hi, {firstName} {lastName}</h1>
                    <div className="flex justify-center mb-4">
                        <img
                            src={profilePictureUrl ? `${baseUrl()}${profilePictureUrl}` : '/avatar/avatar.png'}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Middle Name:</label>
                            <input
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
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
            <ToastContainer />
        </main>
    );
};

export default Profile;
