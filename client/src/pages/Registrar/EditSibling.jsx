import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const EditSibling = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/sibling/${id}`);
    const { enqueueSnackbar } = useSnackbar();

    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState('');
    const [errors,setErrors] = useState({ firstName: '', lastName: '', email: '', studentId: '' })
    const { currentUserId,genericPath,showError } = useContext(MainContext);

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
            studentId
        };

        try {
            const data = await axios.patch(`${baseUrl()}/sibling/${id}`, siblingInformation);
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
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while editing sibling record', {
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
            <form onSubmit={editSibling} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Edit Sibling</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("firstName", "First Name", firstName, setFirstName, "text",errors)}
                        {renderInput("middleName", "Middle Name", middleName, setMiddleName, "text")}
                        {renderInput("lastName", "Last Name", lastName, setLastName, "text",errors)}                        
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("email", "Email", email, setEmail, "email",errors)}
                        {renderSelect("studentId", "Student Sibling", studentId, setStudentId ,students, "Select student",errors)}
                    </div>
                </section>

                <button className="bg-customView text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(`/${genericPath}/siblings`)} className="ml-2 bg-customCancel text-white text-sm p-3 mt-5 rounded-md hover:bg-red-600 transition duration-300">
                    Cancel
                </button>
            </form>
        </main>
    );
};

const renderInput = (id, label, value, onChange, type, errors = {}, disabled = false, fullSpan = false) => (
    <div className={`flex flex-col ${fullSpan ? "col-span-full sm:col-span-2 md:col-span-3" : ""}`}>
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <input
            className={`outline-none p-2 rounded-md border ${errors[id] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            type={type}
            id={id}
            value={value}
            onChange={type === "date" ? onChange : (e) => onChange(e.target.value)}
            disabled={disabled}
        />
        {errors[id] && <span className="text-red-500 text-xs">{errors[id]}</span>}
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, errors = {}) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className={`outline-none p-2 rounded-md border ${errors[id] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>
                    {option.firstName} {option.middleName} {option.lastName}
                </option>
            ))}
        </select>
        {errors[id] && <span className="text-red-500 text-xs">{errors[id]}</span>}
    </div>
);


export default EditSibling;
