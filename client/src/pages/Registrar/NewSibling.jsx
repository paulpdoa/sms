import { useState,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext'; 
import { useSnackbar } from 'notistack';

const NewSibling = () => {
    const navigate = useNavigate();
    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { enqueueSnackbar } = useSnackbar();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState('');
    const [errors,setErrors] = useState({ firstName: '', lastName: '', email: '', studentId: '' })

    const { currentUserId, session,genericPath, showError } = useContext(MainContext);

    const addSibling = async (e) => {
        e.preventDefault();

        if(!firstName) return showError('firstName', 'First name cannot be empty','First name is a required field',setErrors);
        if(!lastName) return showError('lastName','Last name cannot be empty','Last name is a required field',setErrors);
        if(!email) return showError('email','Email cannot be empty', 'Email is a required field', setErrors);
        if(!studentId) return showError('studentId', 'Student sibling cannot be empty', 'Student sibling is a required field',setErrors);

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
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate(`/${genericPath}/siblings`)
                }
            });
           }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding sibling record', {
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
        <main className="p-8 bg-gray-100 flex items-center justify-center">
            <form onSubmit={addSibling} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Add New Sibling</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="firstName">First Name</label>
                            <input
                                className={`outline-none p-2 rounded-md border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            { errors.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span> }
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="middleName">Middle Name</label>
                            <input
                                className={`outline-none p-2 rounded-md border border-gray-300 focus:border-blue-500`}
                                type="text"
                                id="middleName"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="lastName">Last Name</label>
                            <input
                                className={`outline-none p-2 rounded-md border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            { errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span> }

                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="email">Active Email</label>
                            <input
                                className={`outline-none p-2 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            { errors.email && <span className="text-red-500 text-xs">{errors.email}</span> }

                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="student">Student Sibling</label>
                            <select
                                className={`outline-none p-2 rounded-md border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
                                id="student"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            >
                                <option value="" hidden>Select sibling</option>
                                {students?.map(student => (
                                    <option key={student._id} value={student._id}>
                                        {student.firstName} {student.middleName} {student.lastName}
                                    </option>
                                ))}
                            </select>
                            { errors.studentId && <span className="text-red-500 text-xs">{errors.studentId}</span> } 
                        </div>
                    </div>
                </section>

                <button className="bg-customView text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(`/${genericPath}/siblings`)} className="bg-red-500 hover:bg-red-600 text-white ml-2 text-sm p-3 mt-6 rounded-md">
                    Cancel
                </button>
            </form>
        </main>
    );
};

export default NewSibling;
