import { useState,useEffect } from 'react';
import { baseUrl } from '../baseUrl';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useCookies } from 'react-cookie';

const Login = () => {
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [schoolYear, setSchoolYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['userToken']);

    const schoolName = 'School Management System';
    const logoPath = '/schoolLogo/school-logo-filler.png';

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(`${baseUrl()}/user-login`, { username, password, session: schoolYear });
            
            localStorage.setItem('role', data.data.role);
            localStorage.setItem('username', data.data.data.username);
            localStorage.setItem('id', data.data.data._id);
            
            if (schoolYear === 'true') {
                localStorage.setItem('isFreshYear', schoolYear);
            } else {
                localStorage.setItem('session', schoolYear);
            }
    
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
    
            setTimeout(() => {
                setCookie('userToken', data.data.token, { maxAge: 6000 }); // Set cookie with token
                navigate(data.data.redirect);
                // setTimeout(() => {
                //     startCookieCheck();
                // },3000)
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };

    // const checkCookie = () => {
    //     const token = cookies.userToken;
    //     if (!token) {
    //         // Cookie is not present, clear localStorage
    //         localStorage.removeItem('role');
    //         localStorage.removeItem('username');
    //         localStorage.removeItem('id');
    //         localStorage.removeItem('isFreshYear');
    //         localStorage.removeItem('session');
    //     }
    // };
    
    // // Function to start the interval check
    // const startCookieCheck = () => {
    //     setInterval(checkCookie, 1000); // Check every second (adjust as needed)
    // };
    
    // // Optional: If you want to clear the interval when the component unmounts
    // useEffect(() => {
    //     const interval = setInterval(checkCookie, 1000); // Check every second (adjust as needed)
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <main className="bg-gray-200 h-screen flex items-center justify-center">
            <img className="absolute right-0 top-0" src="/loginImage/Vector.png" alt="Vector" />
            <img className="absolute left-0 bottom-0 z-50" src='/loginImage/Ellipse.png' alt="Ellipse" />
            <img className="absolute left-0 bottom-0 z-40" src='/loginImage/Ellipse-1.png' alt="Ellipse 1" />
            <img className="absolute left-0 bottom-0" src='/loginImage/Ellipse-2.png' alt="Ellipse 2" />
            <form onSubmit={loginUser} className="z-50 bg-white p-10 rounded-lg">
                <img className="mx-auto mb-4 w-24 h-24" src={logoPath} alt="School Logo" />
                <h1 className="text-xl font-semibold text-gray-700">{schoolName}</h1>
                <div className="flex flex-col gap-1 mt-5">
                    <span className="text-gray-700 text-sm">Username</span>
                    <input onChange={(e) => setUsername(e.target.value)} className="border border-gray-300 outline-none p-2 bg-transparent rounded-md" type="text" />
                </div>
                <div className="flex flex-col gap-2 my-2 relative">
                    <span className="text-gray-700 text-sm">Password</span>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="border outline-none border-gray-300 p-2 bg-transparent rounded-md"
                        type={showPassword ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-11 bg-transparent border-none cursor-pointer text-gray-500 text-xs"
                    >
                        {(showPassword) ? "Hide" : "Show"}
                    </button>
                </div>
                { schoolYears.length > 0 && (
                    <div className="flex flex-col gap-2 my-2">
                        <span className="text-gray-700 text-sm">Session</span>
                        <select onChange={(e) => setSchoolYear(e.target.value)} className="border outline-none border-gray-300 p-2 bg-transparent rounded-md">
                            <option hidden>Select session</option>
                            {schoolYears?.map(sy => (
                                <option key={sy._id} value={sy._id}>{sy.startYear.split('-')[0]}-{sy.endYear.split('-')[0]} {sy.isYearDone && 'Done'}</option>
                            ))}
                            <option value={true}>Create new school year</option>
                        </select>
                    </div>
                ) }
                <button className="bg-blue-500 hover:bg-blue-600 w-full p-2 rounded-md text-white cursor-pointer my-3">Login</button>
            </form>
            <ToastContainer />
        </main>
    );
};

export default Login;
