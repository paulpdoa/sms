import { useState, useEffect, useContext } from 'react';
import { MainContext } from '../helpers/MainContext';
import { baseUrl } from '../baseUrl';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from '../hooks/useFetch';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [schoolYear, setSchoolYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cookies, setCookie] = useCookies(['userToken']);
    const [error, setError] = useState({ username: '', password: '', session: '' });
    const navigate = useNavigate();
    const { role } = useContext(MainContext);

    // Prevents navigation if user is already logged in
    useEffect(() => {
        if (cookies.userToken) {
            role === 'Super Admin' ? navigate('/master/dashboard') : navigate('/');
        } else {
            navigate('/login');
        }
    }, [role, cookies, navigate]);

    const loginUser = async (e) => {
        e.preventDefault();

        if (!username) setError((prev) => ({ ...prev, username: 'Username cannot be empty' }));
        if (!password) setError((prev) => ({ ...prev, password: 'Password cannot be empty' }));
        if (!schoolYear) setError((prev) => ({ ...prev, session: 'Session cannot be empty' }));

        setTimeout(() => {
            setError({ username: '', password: '', session: '' });
        }, 3000);

        if (!username || !password || !schoolYear) return;

        try {
            const { data } = await axios.post(`${baseUrl()}/user-login`, { username, password, session: schoolYear });

            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.data.username);
            localStorage.setItem('id', data.data._id);

            schoolYear === 'true' ? localStorage.setItem('isFreshYear', true) : localStorage.setItem('session', schoolYear);

            toast.success(data.mssg, {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: true,
                onClose: () => {
                    setCookie('userToken', data.token, { path: '/', maxAge: 100000 });
                    navigate(data.redirect);
                },
            });
        } catch (err) {
            toast.error(err.response?.data.mssg || 'Login failed', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    };

    const signUpNewStudent = () => {
        localStorage.setItem('isStudentSignup', true);
        navigate('/new-student');
    };

    const renderError = (fieldError) => fieldError && <span className="text-red-500 text-xs">{fieldError}</span>;

    return (
        <main className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
                {/* Login Form */}
                <form onSubmit={loginUser} className="bg-white p-8 md:p-12 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>

                    {/* Username Input */}
                    <div className="mb-4">
                        <label className="text-gray-600 text-sm">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full border ${error.username ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {renderError(error.username)}
                    </div>

                    {/* Password Input */}
                    <div className="mb-4 relative">
                        <label className="text-gray-600 text-sm">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border ${error.password ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-600 text-xs"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                        {renderError(error.password)}
                    </div>

                    {/* Session Selector */}
                    <div className="mb-6">
                        <label className="text-gray-600 text-sm">Session</label>
                        <select
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            className={`w-full border ${error.session ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option hidden>Select session</option>
                            {schoolYears.map((sy) => (
                                <option key={sy._id} value={sy._id}>
                                    {`${sy.startYear.split('-')[0]}-${sy.endYear.split('-')[0]}`} {sy.isYearDone && '(Done)'}
                                </option>
                            ))}
                            <option value="true">Create new school year</option>
                        </select>
                        {renderError(error.session)}
                    </div>

                    {/* Login Button */}
                    <button className="bg-blue-500 text-white text-sm py-2 rounded-md w-full hover:bg-blue-600 transition-all">Login</button>
                </form>

                {/* Right Side - School Info */}
                <div className="bg-blue-500 flex flex-col justify-center items-center p-10 text-white">
                    <img className="mb-6 w-32 h-32" src="/schoolLogo/school-logo-filler.png" alt="School Logo" />
                    <h2 className="text-2xl font-semibold">Welcome to Name Of School</h2>
                    <p className="mt-2 text-sm">Manage your school's activities effectively.</p>
                    <button
                        onClick={signUpNewStudent}
                        className="mt-6 bg-white text-blue-500 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-all"
                    >
                        Register as a Student
                    </button>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default Login;
