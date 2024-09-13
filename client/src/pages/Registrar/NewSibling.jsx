import { useState,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext'; 

const NewSibling = () => {
    const navigate = useNavigate();
    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState('');

    const { currentUserId, session,genericPath } = useContext(MainContext);

    const addSibling = async (e) => {
        e.preventDefault();

        const siblingInformation = {
            firstName,
            middleName,
            lastName,
            email,
            inputter: currentUserId,
            studentId,
            session
        };

        try {
           if(studentId !== '') {
            const data = await axios.post(`${baseUrl()}/sibling`, siblingInformation);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                navigate(`/${genericPath}/siblings`)
            }, 2000);
           }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.mssg, {
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
        <main className="p-8 bg-gray-100 flex items-center justify-center">
            <form onSubmit={addSibling} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Add New Sibling</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="firstName">First Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="middleName">Middle Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
                                type="text"
                                id="middleName"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="lastName">Last Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="email">Active Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="student">Student Sibling</label>
                            <select
                                className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
                                id="student"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                            >
                                <option value="" hidden>Select sibling</option>
                                {students?.map(student => (
                                    <option key={student._id} value={student._id}>
                                        {student.firstName} {student.middleName} {student.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <button className="bg-blue-500 text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(-1)} className="bg-red-500 hover:bg-red-600 text-white ml-2 text-sm p-3 mt-6 rounded-md">
                    Cancel
                </button>
            </form>
            <ToastContainer />
        </main>
    );
};

export default NewSibling;
