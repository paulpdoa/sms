import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const NewSibling = () => {
    const navigate = useNavigate();
    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState('');

    const currentUserId = localStorage.getItem('id');

    const addSibling = async (e) => {
        e.preventDefault();

        const siblingInformation = {
            firstName,
            middleName,
            lastName,
            email,
            inputter: currentUserId,
            studentId
        };

        try {
           if(studentId !== '') {
            const data = await axios.post(`${baseUrl()}/sibling`, siblingInformation);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
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
           }
        } catch (err) {
            console.error(err);
            toast.error("Error adding sibling. Please try again.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    };

    return (
        <main className="p-8 bg-gray-100 flex items-center justify-center">
            <form onSubmit={addSibling} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-green-600 text-3xl mb-6">Add New Sibling</h1>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mb-4">Basic Information</h2>
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
                    <h2 className="text-green-600 font-bold text-xl mb-4">Contact Details</h2>
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

                <button className="bg-green-600 text-white text-sm p-3 mt-5 rounded-md hover:bg-green-700 transition duration-300">
                    Submit
                </button>
            </form>
            <ToastContainer />
        </main>
    );
};

export default NewSibling;
