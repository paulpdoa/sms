import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewTextbook = () => {
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);

    const { role, session, currentUserId } = useContext(MainContext);

    const [schoolYear, setSchoolYear] = useState(session);
    const [bookCode, setBookCode] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [bookAmount, setBookAmount] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [strand, setStrand] = useState('');

    const navigate = useNavigate();

    const addTextbook = async (e) => {
        e.preventDefault();

        if (!gradeLevel) {
            toast.error("Please fill in all required fields.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
            return;
        }

        const bookInfo = {
            schoolYear,
            bookCode,
            bookTitle,
            bookAmount,
            gradeLevel,
            strand,
            inputter: currentUserId,
            session: schoolYear,
            role
        }

        try {
            const newtextbook = await axios.post(`${baseUrl()}/textbook`, bookInfo);
            toast.success(newtextbook.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                navigate(-1);
            }, 2000)
        } catch (err) {
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
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={addTextbook} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Add Textbook</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('bookTitle', 'Book Title', bookTitle, setBookTitle, 'text')}
                    {renderInput('bookCode', 'Book Code', bookCode, setBookCode, 'text')}
                    {renderInput('bookAmount', 'Book Amount', bookAmount, setBookAmount, 'number', { step: "0.01" })}
                    {renderSelect('gradeLevel', 'Grade Level', gradeLevel, setGradeLevel, gradeLevels, 'Select Grade Level', true)}
                    {renderSelect('strand', 'Strand', strand, setStrand, strands, 'Select Strand')}
                </div>

                <button type="submit" className="bg-blue-500 text-white text-sm p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                    Add Textbook
                </button>
                <button onClick={() => navigate(-1)} type="button" className="bg-red-500 text-white text-sm p-3 ml-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
            <ToastContainer />
        </main>
    )
}

export default NewTextbook;

const renderInput = (id, label, value, onChange, type, extraProps = {}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            {...extraProps}
            required
        />
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, required = false) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required={required}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
        </select>
    </div>
);
