import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const NewStudent = () => {
    const { records: religions } = useFetch(`${baseUrl()}/religions`);
    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const navigate = useNavigate();

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
    const [status, setStatus] = useState('');

    const calculateAge = (dob) => {
        const age = Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e+10);
        return age >= 0 ? age : 0;
    }

    const handleDateOfBirthChange = (e) => {
        const dob = e.target.value;
        setDateOfBirth(dob);
        setAge(calculateAge(dob));
    }

    const addStudent = async (e) => {
        e.preventDefault();

        const studentInformation = {
            firstName,
            middleName,
            lastName,
            suffix,
            dateOfBirth,
            age,
            sex,
            religion,
            nationality,
            placeOfBirth,
            email,
            contactNumber,
            address,
            status
        };

        try {
            const data = await axios.post(`${baseUrl()}/students`, studentInformation);
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
                navigate(data.data.redirect);
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <main className="p-4">
            <h1 className="font-semibold text-center text-gray-800 text-2xl">Add New Student</h1>
            <form onSubmit={addStudent} className="mt-6 space-y-8">
                <section>
                    <h2 className="text-green-500 font-bold text-xl">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="firstName">First Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="firstName"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="middleName">Middle Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="middleName"
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="lastName">Last Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="lastName"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="suffix">Ext/Suffix</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="suffix"
                                onChange={(e) => setSuffix(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="dateOfBirth">Date of Birth</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="date"
                                id="dateOfBirth"
                                onChange={handleDateOfBirthChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="age">Age</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="age"
                                value={age}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="sex">Sex</label>
                            <select
                                className="outline-none p-2 rounded-md border border-gray-300"
                                id="sex"
                                onChange={(e) => setSex(e.target.value)}
                            >
                                <option hidden>Gender</option>
                                {genders?.map(gender => (
                                    <option key={gender._id} value={gender._id}>{gender.gender}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="religion">Religion</label>
                            <select
                                className="outline-none p-2 rounded-md border border-gray-300"
                                id="religion"
                                onChange={(e) => setReligion(e.target.value)}
                            >
                                <option hidden>Religion</option>
                                {religions?.map(religion => (
                                    <option key={religion._id} value={religion._id}>{religion.religion}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="nationality">Nationality</label>
                            <select
                                className="outline-none p-2 rounded-md border border-gray-300"
                                id="nationality"
                                onChange={(e) => setNationality(e.target.value)}
                            >
                                <option hidden>Nationality</option>
                                {nationalities?.map(nationality => (
                                    <option key={nationality._id} value={nationality._id}>{nationality.nationality}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="placeOfBirth">Place of Birth</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="placeOfBirth"
                                onChange={(e) => setPlaceOfBirth(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col col-span-full sm:col-span-2 md:col-span-3">
                            <label className="text-sm" htmlFor="address">Address</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="address"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-500 font-bold text-xl">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="email">Active Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="contactNumber">Contact Number</label>
                            <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className="outline-none p-2 flex-grow"
                                    type="text"
                                    id="contactNumber"
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="status">Status</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="status"
                                onChange={(e) => setStatus(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <button className="bg-green-500 text-white text-sm p-2 mt-5 rounded-md">Submit</button>
            </form>
            <ToastContainer />
        </main>
    );
};

export default NewStudent;
