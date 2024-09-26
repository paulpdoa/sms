import { useContext, useState } from 'react';
import { MainContext } from '../../helpers/MainContext';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const NewTextbook = () => {
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);

    const { role, session, currentUserId, genericPath, showError } = useContext(MainContext);

    const { enqueueSnackbar } = useSnackbar();

    const [schoolYear, setSchoolYear] = useState(session);
    const [bookCode, setBookCode] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [bookAmount, setBookAmount] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [strand, setStrand] = useState('');

    const [errors, setErrors] = useState({ bookTitle: '', bookCode: '', bookAmount: '', gradeLevel: '' });

    const navigate = useNavigate();

    const addTextbook = async (e) => {
        e.preventDefault();

        if (!gradeLevel) return showError('gradeLevel', 'Grade level cannot be empty', 'Grade level is a required field', setErrors);
        if (!bookTitle) return showError('bookTitle', 'Book title cannot be empty', 'Book title is a required field', setErrors);
        if (!bookCode) return showError('bookCode', 'Book code cannot be empty', 'Book code is a required field', setErrors);
        if (!bookAmount) return showError('bookAmount', 'Book amount cannot be empty', 'Book amount is a required field', setErrors);

        const bookInfo = {
            schoolYear,
            bookCode,
            bookTitle,
            bookAmount,
            gradeLevel,
            strand,
            inputter: currentUserId,
            session: schoolYear,
            role,
            sessionId: session
        }

        try {
            const newtextbook = await axios.post(`${baseUrl()}/textbook`, bookInfo);
            enqueueSnackbar(newtextbook.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate(`/${genericPath}/text-books`);
                }
            });
        } catch (err) {
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding textbook record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <form onSubmit={addTextbook} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Add Textbook</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('bookTitle', 'Book Title', bookTitle, setBookTitle, 'text', errors.bookTitle)}
                    {renderInput('bookCode', 'Book Code', bookCode, setBookCode, 'text', errors.bookCode)}
                    {renderInput('bookAmount', 'Book Amount', bookAmount, setBookAmount, 'number', errors.bookAmount, { step: "0.01" })}
                    {renderSelect('gradeLevel', 'Grade Level', gradeLevel, setGradeLevel, gradeLevels, 'Select Grade Level', errors.gradeLevel, true)}
                    {renderSelect('strand', 'Strand', strand, setStrand, strands, 'Select Strand', '')}
                </div>

                <button type="submit" className="bg-customView text-white text-sm p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Add Textbook
                </button>
                <button onClick={() => navigate(`/${genericPath}/text-books`)} type="button" className="bg-customCancel text-white text-sm p-3 ml-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
        </main>
    )
}

export default NewTextbook;

// Render Input Function (Now accepts error as a parameter)
const renderInput = (id, label, value, onChange, type, error, extraProps = {}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customView`}
            {...extraProps}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

// Render Select Function (Now accepts error as a parameter)
const renderSelect = (id, label, value, onChange, options, placeholder, error, required = false) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customView`}
            required={required}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
            {label === 'Strand' && (
                <option value=''>Not applicable</option>
            )}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);
