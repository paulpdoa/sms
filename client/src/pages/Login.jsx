import { useState } from 'react';
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

    const schoolName = 'Name Of School';
    const logoPath = '/schoolLogo/school-logo-filler.png';

    const loginUser = async (e) => {
        e.preventDefault();

        if (!username) setError((prev) => ({ ...prev, username: 'Username cannot be empty' }));
        if (!password) setError((prev) => ({ ...prev, password: 'Password cannot be empty' }));
        if (!schoolYear) setError((prev) => ({ ...prev, session: 'Session cannot be empty' }));

        if (!username || !password || !schoolYear) return;

        try {
            const data = await axios.post(`${baseUrl()}/user-login`, { username, password, session: schoolYear });
            
            localStorage.setItem('role', data.data.role);
            localStorage.setItem('username', data.data.data.username);
            localStorage.setItem('id', data.data.data._id);

            localStorage.setItem('session', schoolYear);

            toast.success(data.data.mssg, {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });

            setTimeout(() => {
                setCookie('userToken', data.data.token, { maxAge: 100000 });
                navigate(data.data.redirect);
            }, 2000);
        } catch (err) {
            toast.error(err.response.data.mssg, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
        }
    };

    const signUpNewStudent = () => {
        localStorage.setItem('isStudentSignup', true);
        navigate('/new-student');
    };

    return (
        <main className="bg-gray-200 h-screen flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full">
                {/* Login Form */}
                <form onSubmit={loginUser} className="bg-white p-10 flex flex-col justify-center">
                    <h1 className="text-2xl font-semibold text-gray-700 mb-5">Login</h1>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 text-sm">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`border ${error.username ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md bg-transparent text-sm`}
                        />
                        {error.username && <span className="text-red-500 text-xs">{error.username}</span>}
                    </div>

                    <div className="flex flex-col gap-1 mt-3 relative">
                        <label className="text-gray-700 text-sm">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`border ${error.password ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md bg-transparent text-sm`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-8 bg-transparent text-gray-500 text-xs"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                        {error.password && <span className="text-red-500 text-xs">{error.password}</span>}
                    </div>

                    <div className="flex flex-col gap-1 mt-3">
                        <label className="text-gray-700 text-sm">Session</label>
                        <select
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            className={`border ${error.session ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md bg-transparent text-sm`}
                        >
                            <option hidden>Select session</option>
                            {schoolYears.map((sy) => (
                                <option key={sy._id} value={sy._id}>
                                    {`${sy.startYear.split('-')[0]}-${sy.endYear.split('-')[0]}`} {sy.isYearDone && 'Done'}
                                </option>
                            ))}
                            <option value={true}>Create new school year</option>
                        </select>
                        {error.session && <span className="text-red-500 text-xs">{error.session}</span>}
                    </div>

                    <button className="bg-blue-500 text-sm hover:bg-blue-600 w-full p-2 rounded-md text-white cursor-pointer mt-5">Login</button>
                </form>

                {/* Right Side - School Logo and Information */}
                <div className="bg-blue-500 flex items-center justify-center flex-col p-10 text-white">
                    <img className="mb-4 w-32 h-32" src={logoPath} alt="School Logo" />
                    <h1 className="text-xl font-semibold">Welcome to {schoolName}</h1>
                    <p className="mt-2 text-sm">Manage your school's activities effectively.</p>
                    <button
                        onClick={signUpNewStudent}
                        className="mt-5 bg-white text-blue-500 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
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
