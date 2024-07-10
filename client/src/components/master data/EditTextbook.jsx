import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from "../../baseUrl";
import { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MainContext } from "../../helpers/MainContext";

const EditTextbook = () => {

    const { id } = useParams();
    const { records: textbook } = useFetch(`${baseUrl()}/textbook/${id}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);

    const navigate = useNavigate();

    const [bookCode, setBookCode] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [gradeLevelId, setGradeLevelId] = useState('');
    const [strandId, setStrandId] = useState('');
    const [bookAmount, setBookAmount] = useState('');
    const [schoolYear, setSchoolYear] = useState('');

    const { role, currentUserId, session } = useContext(MainContext);

    useEffect(() => {
        if (textbook) {
            setBookCode(textbook?.bookCode || '');
            setBookTitle(textbook?.bookTitle || '');
            setGradeLevelId(textbook?.gradeLevel || '');
            setStrandId(textbook?.strand || '');
            setBookAmount(textbook?.bookAmount || '');
            setSchoolYear(textbook?.schoolYear || '');
        }
    }, [textbook]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookInfo = {
            newBookCode: bookCode,
            newBookTitle: bookTitle,
            newBookAmount: bookAmount,
            newGradeLevel: gradeLevelId,
            newStrand: strandId,
            newInputter: currentUserId,
            newSession: session,
            newSchoolYear: schoolYear,
            role
        }

        try {
            const newData = await axios.patch(`${baseUrl()}/textbook/${id}`, bookInfo);
            toast.success(newData.data.mssg, {
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
                navigate(-1);
            }, 2000)
        } catch (err) {
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
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-green-600 text-2xl mb-4">Edit User: {textbook?.bookTitle}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('bookTitle', 'Book Title', bookTitle, setBookTitle, 'text')}
                    {renderInput('bookCode', 'Book Code', bookCode, setBookCode, 'text')}
                    {renderInput('bookAmount', 'Book Amount', bookAmount, setBookAmount, 'number', { step: "0.01" })}
                    {renderSelect('gradeLevel', 'Grade Level', gradeLevelId, setGradeLevelId, gradeLevels, 'Select Grade Level')}
                    {renderSelect('strand', 'Strand', strandId, setStrandId, strands, 'Select strand', true)}
                </div>

                <button type="submit" className="bg-green-600 text-white text-sm p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                    Update Textbook
                </button>
                <button onClick={() => navigate(-1)} type="button" className="bg-red-600 text-white text-sm p-3 ml-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
            <ToastContainer />
        </main>
    )
}

export default EditTextbook;

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
