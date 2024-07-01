import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const EditStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/student/${id}`);

    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: religions } = useFetch(`${baseUrl()}/religions`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);
    const session = localStorage.getItem('session');

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState('');
    const [religion, setReligion] = useState('');
    const [nationality, setNationality] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if(records) {
            setFirstName(records.firstName);
            setMiddleName(records.middleName);
            setLastName(records.lastName);
            setSuffix(records.suffix);
            setDateOfBirth(records.dateOfBirth);
            setAge(calculateAge(records.dateOfBirth));
            setSex(records.sex?._id);
            setReligion(records.religion?._id);
            setNationality(records.nationality?._id);
            setPlaceOfBirth(records.placeOfBirth);
            setEmail(records.email);
            setContactNumber(records.contactNumber);
            setAddress(records.address);
        }
    }, [records]);

    const calculateAge = (dob) => {
        const age = Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e+10);
        return age >= 0 ? age : 0;
    };

    const handleDateOfBirthChange = (e) => {
        const dob = e.target.value;
        setDateOfBirth(dob);
        setAge(calculateAge(dob));
    };

    const editStudent = async (e) => {
        e.preventDefault();

        const studentInformation = {
            firstName,
            middleName,
            lastName,
            suffix,
            dateOfBirth,
            age,
            gender: sex,
            religion,
            nationality,
            placeOfBirth,
            email,
            contactNumber,
            address,
            session
        };

        try {
            const data = await axios.patch(`${baseUrl()}/student/${id}`, studentInformation);
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
                window.location.reload();
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
        <main className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
            <form onSubmit={editStudent} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-green-600 text-3xl mb-6">Edit Student</h1>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("firstName", "First Name", firstName, setFirstName, "text")}
                        {renderInput("middleName", "Middle Name", middleName, setMiddleName, "text")}
                        {renderInput("lastName", "Last Name", lastName, setLastName, "text")}
                        {renderInput("suffix", "Ext/Suffix", suffix, setSuffix, "text")}
                        {renderInput("dateOfBirth", "Date of Birth", dateOfBirth, handleDateOfBirthChange, "date")}
                        {renderInput("age", "Age", age, () => {}, "number", true)}
                        {renderSelect("sex", "Sex", sex, setSex, genders, "Gender")}
                        {renderSelect("religion", "Religion", religion, setReligion, religions, "Religion")}
                        {renderSelect("nationality", "Nationality", nationality, setNationality, nationalities, "Nationality")}
                        {renderInput("placeOfBirth", "Place of Birth", placeOfBirth, setPlaceOfBirth, "text")}
                        {renderInput("address", "Address", address, setAddress, "text", false, true)}
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("email", "Active Email", email, setEmail, "email")}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="contactNumber">Contact Number</label>
                            <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-green-500">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className="outline-none p-2 flex-grow"
                                    type="text"
                                    id="contactNumber"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
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
                    { label === 'Religion' && option.religion }
                    { label === 'Nationality' && option.nationality }
                    { label === 'Sex' && option.gender }
                </option>
            ))}
        </select>
    </div>
);

export default EditStudent;
