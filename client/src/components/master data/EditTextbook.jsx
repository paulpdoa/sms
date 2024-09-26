import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from "../../baseUrl";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MainContext } from "../../helpers/MainContext";
import { useSnackbar } from "notistack";

const EditTextbook = () => {
    const { id } = useParams();
    const { records: textbook } = useFetch(`${baseUrl()}/textbook/${id}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [bookCode, setBookCode] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [gradeLevelId, setGradeLevelId] = useState('');
    const [strandId, setStrandId] = useState('');
    const [bookAmount, setBookAmount] = useState('');
    const [schoolYear, setSchoolYear] = useState('');

    const [errors, setErrors] = useState({ bookTitle: '', bookCode: '', bookAmount: '', gradeLevel: '' });

    const { role, currentUserId, session, genericPath, showError } = useContext(MainContext);

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

    const currentGradeLevel = gradeLevels.filter(gl => gl._id === gradeLevelId).find(gl => gl._id === gradeLevelId)?.gradeLevel.toLowerCase();

    const isGrade11Or12 = currentGradeLevel === 'grade 11' || currentGradeLevel === 'grade 12';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gradeLevelId) return showError('gradeLevel', 'Grade level cannot be empty', 'Grade level is a required field', setErrors);
        if (!bookTitle) return showError('bookTitle', 'Book title cannot be empty', 'Book title is a required field', setErrors);
        if (!bookCode) return showError('bookCode', 'Book code cannot be empty', 'Book code is a required field', setErrors);
        if (!bookAmount) return showError('bookAmount', 'Book amount cannot be empty', 'Book amount is a required field', setErrors);

        const bookInfo = {
            newBookCode: bookCode,
            newBookTitle: bookTitle,
            newBookAmount: bookAmount,
            newGradeLevel: gradeLevelId,
            newStrand: strandId,
            newInputter: currentUserId,
            newSession: session,
            newSchoolYear: schoolYear,
            role,
            sessionId: session
        }

        try {
            const newData = await axios.patch(`${baseUrl()}/textbook/${id}`, bookInfo);
            enqueueSnackbar(newData.data.mssg, { 
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating textbook record', { 
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
            <form onSubmit={handleSubmit} className="space-y-8 bg-white w-3/4 shadow-lg p-8 rounded-lg mx-auto border border-gray-200">
                <h1 className="font-bold text-gray-700 text-2xl mb-4">Edit Textbook: {textbook?.bookTitle}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {renderInput('bookTitle', 'Book Title', bookTitle, setBookTitle, 'text', errors.bookTitle)}
                    {renderInput('bookCode', 'Book Code', bookCode, setBookCode, 'text', errors.bookCode)}
                    {renderInput('bookAmount', 'Book Amount', bookAmount, setBookAmount, 'number', errors.bookAmount, { step: "0.01" })}
                    {renderSelect('gradeLevel', 'Grade Level', gradeLevelId, setGradeLevelId, gradeLevels, 'Select Grade Level', errors.gradeLevel)}
                    {isGrade11Or12 && renderSelect('strand', 'Strand', strandId, setStrandId, strands, 'Select strand', null)}
                </div>

                <button type="submit" className="bg-customView text-white text-sm p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Update Textbook
                </button>
                <button onClick={() => navigate(`/${genericPath}/text-books`)} type="button" className="bg-customCancel text-white text-sm p-3 ml-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
            </form>
        </main>
    )
}

export default EditTextbook;

const renderInput = (id, label, value, onChange, type, error, extraProps = {}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...extraProps}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, error) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>
                    {option[id]}
                </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);
