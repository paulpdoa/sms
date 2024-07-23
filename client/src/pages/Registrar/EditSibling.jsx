import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';

const EditSibling = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/sibling/${id}`);

    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState('');

    const { currentUserId } = useContext(MainContext);

    useEffect(() => {
        if (records) {
            setFirstName(records.firstName);
            setMiddleName(records.middleName);
            setLastName(records.lastName);
            setEmail(records.email);
            setStudentId(records.studentId?._id);
        }
    }, [records]);

    const editSibling = async (e) => {
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
            const data = await axios.patch(`${baseUrl()}/sibling/${id}`, siblingInformation);
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
                navigate('/siblings')
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error("Error editing student. Please try again.", {
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
            <form onSubmit={editSibling} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Edit Sibling</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("firstName", "First Name", firstName, setFirstName, "text")}
                        {renderInput("middleName", "Middle Name", middleName, setMiddleName, "text")}
                        {renderInput("lastName", "Last Name", lastName, setLastName, "text")}                        
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("email", "Email", email, setEmail, "email")}
                        {renderSelect("studentId", "Student Sibling", studentId, setStudentId ,students, "Select student")}
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

const renderInput = (id, label, value, onChange, type, disabled = false, fullSpan = false) => (
    <div className={`flex flex-col ${fullSpan ? "col-span-full sm:col-span-2 md:col-span-3" : ""}`}>
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <input
            className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
            type={type}
            id={id}
            value={value}
            onChange={type === "date" ? onChange : (e) => onChange(e.target.value)}
            disabled={disabled}
            required={!disabled}
        />
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>
                    { option.firstName} {option.middleName} {option.lastName}
                </option>
            ))}
        </select>
    </div>
);

export default EditSibling;
