import { useState } from 'react';
import { baseUrl } from '../baseUrl';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

const Login = () => {

    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [schoolYear,setSchoolYear] = useState('');

    const navigate = useNavigate();

    const loginUser = async (e) => {

        e.preventDefault();
        try {
            const data = await axios.post(`${baseUrl()}/user-login`,{ username,password,session: schoolYear });
            
            localStorage.setItem('userToken',data.data.token);
            localStorage.setItem('role',data.data.role);
            localStorage.setItem('username',data.data.data.username);
            localStorage.setItem('id',data.data.data._id);
            localStorage.setItem('session',schoolYear);

            toast.success(data.data.mssg, {
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
                window.location.reload()
                navigate(data.data.redirect);
            },2000)
        } catch(err) {
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
            console.log(err.response.data.mssg);
        }
    } 

    return (
        <main className="bg-green-300 h-screen flex items-center justify-center">
            <img className="absolute right-0 top-0" src="/loginImage/Vector.png" alt="Vector" />

            <img className="absolute left-0 bottom-0 z-50" src='/loginImage/Ellipse.png' alt="Ellipse" />
            <img className="absolute left-0 bottom-0 z-40" src='/loginImage/Ellipse-1.png' alt="Ellipse 1" />
            <img className="absolute left-0 bottom-0" src='/loginImage/Ellipse-2.png' alt="Ellipse 2" />

            <form onSubmit={loginUser} className="z-50 bg-white p-10 rounded-lg">

                {/* LOGO HERE */}
                <h1 className="text-xl font-semibold text-gray-700">School Management System</h1>
                {/* LOGO HERE */}
                
                <div className="flex flex-col gap-1 mt-5">
                    <span className="text-gray-700">Username</span>
                    <input onChange={(e) => setUsername(e.target.value)} className="border border-gray-300 outline-none p-2 bg-transparent rounded-md" type="text" />
                </div>

                <div className="flex flex-col gap-2 my-2">
                    <span className="text-gray-700">Password</span>
                    <input onChange={(e) => setPassword(e.target.value)} className="border outline-none border-gray-300 p-2 bg-transparent rounded-md" type="password" />
                </div>

                <div className="flex flex-col gap-2 my-2">
                    <span className="text-gray-700">Session</span>
                    <select onChange={(e) => setSchoolYear(e.target.value)} className="border outline-none border-gray-300 p-2 bg-transparent rounded-md">
                        <option hidden>Select session</option>
                        { schoolYears?.map(sy => (
                            <option key={sy._id} value={sy._id}>{sy.startYear.split('-')[0]}-{sy.endYear.split('-')[0]}</option>
                        )) }
                    </select>
                </div>

                <button className="bg-green-500 w-full p-1 rounded-md text-gray-200 cursor-pointer my-3">Login</button>
            </form>
            <ToastContainer />
        </main>
    )
}

export default Login;