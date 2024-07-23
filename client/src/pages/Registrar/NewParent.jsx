import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const NewParent = () => {
    // Fetch records for religions, genders, students, and nationalities
    const { records: religions, isLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const navigate = useNavigate();

    // Define state variables for form fields
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

    // Function to handle form submission
    const addParent = async (e) => {
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
        }

        try {
            const data = await axios.post(`${baseUrl()}/parent`, parentInformation);
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
                navigate('/parents')
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="p-4">
            
            <form onSubmit={addParent} className="space-y-8 bg-gray-100 shadow-md p-6 rounded-md">
                <h1 className="font-bold text-start text-gray-700 text-3xl">Add New Parent</h1>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Mother's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherName">Mother's Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherName"
                                onChange={(e) => setMotherName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherOccupation">Mother's Occupation</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherOccupation"
                                onChange={(e) => setMotherOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherOffice">Mother's Office</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherOffice"
                                onChange={(e) => setMotherOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherContact">Mother's Contact #</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherContact"
                                onChange={(e) => setMotherContact(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherEmail">Mother's Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="motherEmail"
                                onChange={(e) => setMotherEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Father's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherName">Father's Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherName"
                                onChange={(e) => setFatherName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherOccupation">Father's Occupation</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherOccupation"
                                onChange={(e) => setFatherOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherOffice">Father's Office</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherOffice"
                                onChange={(e) => setFatherOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherContact">Father's Contact #</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherContact"
                                onChange={(e) => setFatherContact(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherEmail">Father's Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="fatherEmail"
                                onChange={(e) => setFatherEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Guardian's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianName">Guardian's Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianName"
                                onChange={(e) => setGuardianName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianOccupation">Guardian's Occupation</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianOccupation"
                                onChange={(e) => setGuardianOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianOffice">Guardian's Office</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianOffice"
                                onChange={(e) => setGuardianOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianContact">Guardian's Contact #</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianContact"
                                onChange={(e) => setGuardianContact(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianEmail">Guardian's Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="guardianEmail"
                                onChange={(e) => setGuardianEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Parent Of:</h2>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm" htmlFor="student">Student Name</label>
                        <select
                            className="outline-none p-2 rounded-md border border-gray-300"
                            id="student"
                            onChange={(e) => setStudentId(e.target.value)}
                        >
                            <option hidden>Select student</option>
                            {students?.map(student => (
                                <option key={student._id} value={student._id}>
                                    {student.firstName} {student.middleName} {student.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-3 mt-6 rounded-md">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(-1)} className="bg-red-500 hover:bg-red-600 text-white ml-2 text-sm p-3 mt-6 rounded-md">
                    Cancel
                </button>
            </form>
            <ToastContainer />
        </main>
    )
}

export default NewParent;
