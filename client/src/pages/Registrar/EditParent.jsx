import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const EditParent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/parent/${id}`);
    const { records: students } = useFetch(`${baseUrl()}/students`);

    const [motherName, setMotherName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [motherOccupation, setMotherOccupation] = useState('');
    const [fatherOccupation, setFatherOccupation] = useState('');
    const [guardianOccupation, setGuardianOccupation] = useState('');
    const [motherContact, setMotherContact] = useState('');
    const [fatherContact, setFatherContact] = useState('');
    const [guardianContact, setGuardianContact] = useState('');
    const [motherEmail, setMotherEmail] = useState('');
    const [fatherEmail, setFatherEmail] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [motherOffice, setMotherOffice] = useState('');
    const [fatherOffice, setFatherOffice] = useState('');
    const [guardianOffice, setGuardianOffice] = useState('');
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        if (records) {
            setMotherName(records.motherName || '');
            setFatherName(records.fatherName || '');
            setGuardianName(records.guardianName || '');
            setMotherOccupation(records.motherOccupation || '');
            setFatherOccupation(records.fatherOccupation || '');
            setGuardianOccupation(records.guardianOccupation || '');
            setMotherContact(records.motherContact || '');
            setFatherContact(records.fatherContact || '');
            setGuardianContact(records.guardianContact || '');
            setMotherEmail(records.motherEmail || '');
            setFatherEmail(records.fatherEmail || '');
            setGuardianEmail(records.guardianEmail || '');
            setMotherOffice(records.motherOffice || '');
            setFatherOffice(records.fatherOffice || '');
            setGuardianOffice(records.guardianOffice || '');
            setStudentId(records.studentId || '');
        }
    }, [records]);

    const editParent = async (e) => {
        e.preventDefault();

        const parentInformation = {
            motherName,
            fatherName,
            guardianName,
            motherOccupation,
            fatherOccupation,
            guardianOccupation,
            motherContact,
            fatherContact,
            guardianContact,
            motherEmail,
            fatherEmail,
            guardianEmail,
            motherOffice,
            fatherOffice,
            guardianOffice,
            studentId
        };

        try {
            const data = await axios.patch(`${baseUrl()}/parent/${id}`, parentInformation);
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
                navigate('/');
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error("Error editing parent. Please try again.", {
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

    const renderInput = (id, label, value, onChange, type = 'text') => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
        </div>
    );

    const renderSelect = (id, label, value, onChange, options, placeholder) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
                <option hidden>{ value ? `${value.firstName} ${value.middleName} ${value.lastName}` : placeholder}</option>
                {options?.map((option) => (
                    <option key={option._id} value={option._id}>
                        {option.firstName} {option.middleName} {option.lastName}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <main className="p-4">
            <form onSubmit={editParent} className="space-y-8 bg-gray-100 shadow-md p-6 rounded-md">
                <h1 className="font-bold text-start text-gray-700 text-3xl">Edit Parent</h1>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Mother's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {renderInput('motherName', "Mother's Name", motherName, setMotherName)}
                        {renderInput('motherOccupation', "Mother's Occupation", motherOccupation, setMotherOccupation)}
                        {renderInput('motherOffice', "Mother's Office", motherOffice, setMotherOffice)}
                        {renderInput('motherContact', "Mother's Contact #", motherContact, setMotherContact)}
                        {renderInput('motherEmail', "Mother's Email", motherEmail, setMotherEmail, 'email')}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Father's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {renderInput('fatherName', "Father's Name", fatherName, setFatherName)}
                        {renderInput('fatherOccupation', "Father's Occupation", fatherOccupation, setFatherOccupation)}
                        {renderInput('fatherOffice', "Father's Office", fatherOffice, setFatherOffice)}
                        {renderInput('fatherContact', "Father's Contact #", fatherContact, setFatherContact)}
                        {renderInput('fatherEmail', "Father's Email", fatherEmail, setFatherEmail, 'email')}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Guardian's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {renderInput('guardianName', "Guardian's Name", guardianName, setGuardianName)}
                        {renderInput('guardianOccupation', "Guardian's Occupation", guardianOccupation, setGuardianOccupation)}
                        {renderInput('guardianOffice', "Guardian's Office", guardianOffice, setGuardianOffice)}
                        {renderInput('guardianContact', "Guardian's Contact #", guardianContact, setGuardianContact)}
                        {renderInput('guardianEmail', "Guardian's Email", guardianEmail, setGuardianEmail, 'email')}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Parent Of:</h2>
                    {renderSelect('student', 'Student Name', studentId, setStudentId, students, 'Select student')}
                </section>

                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-3 mt-6 rounded-md">
                    Submit
                </button>
                <button onClick={() => navigate('/parents')} className="bg-red-500 hover:bg-red-600 ml-2 text-white text-sm p-3 mt-6 rounded-md">
                    Cancel
                </button>
            </form>
            <ToastContainer />
        </main>
    );
};

export default EditParent;
