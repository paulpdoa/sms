import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const Input = ({ label, type, name, value, onChange,disabled = false }) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor={name}>{label}</label>
        <input
            className="p-2 rounded-md border border-gray-300"
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            disabled={disabled}
        />
    </div>
);

const Select = ({ label, name, value, options, onChange }) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor={name}>{label}</label>
        <select
            className="p-2 rounded-md border border-gray-300"
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
        >   
            <option value="" hidden>{label}</option>
            {options && options.length > 0 ? (
                options.map(option => (
                    <option key={option._id} value={option._id}>
                        { option[name] }
                    </option>
                ))
            ) : (
                <option disabled>Loading...</option>
            )}
        </select>
    </div>
);


const NewTeacher = () => {
    const { records: religions, isLoading: religionsLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders, isLoading: gendersLoading } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities, isLoading: nationalitiesLoading } = useFetch(`${baseUrl()}/nationalities`);

    const [firstName,setFirstName] = useState('');
    const [middleName,setMiddleName] = useState('');
    const [lastName,setLastName] = useState('');
    const [dateOfBirth,setDateOfBirth] = useState('');
    const [gender,setGender] = useState('');
    const [religion,setReligion] = useState('');
    const [nationality,setNationality] = useState('');
    const [placeOfBirth,setPlaceOfBirth] = useState('');
    const [email,setEmail] = useState('');
    const [contactNumber,setContactNumber] = useState('');
    const [address,setAddress] = useState('');
    const [spouseName,setSpouseName] = useState('');
    const [spouseCel,setSpouseCel] = useState('');
    const [education,setEducation] = useState('');
    const [schoolGraduated,setSchoolGraduated] = useState('');
    const [yearGraduated,setYearGraduated] = useState('');
    const [yearsOfExperience,setYearsOfExperience] = useState('');
    const [joiningDate,setJoiningDate] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const getAge = Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10);

    const addTeacher = async (e) => {
        e.preventDefault();

        const teacherInformation = { 
            firstName,
            lastName,
            middleName,
            dateOfBirth,
            gender,
            religion,
            nationality,
            placeOfBirth,
            email,
            contactNumber,
            address,
            spouseName,
            spouseCel,
            education,
            schoolGraduated,
            yearGraduated,
            yearsOfExperience,
            joiningDate,
            age: getAge 
        };

        try {
            const data = await axios.post(`${baseUrl()}/teachers`, teacherInformation);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                navigate(data.data.redirect);
            }, 2000);
        } catch (err) {
            console.log(err);
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
    };

    return (
        <main className="p-4 bg-gray-100">
            <form onSubmit={addTeacher} className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="font-bold text-start text-green-600 text-3xl mb-4">Add New Teacher</h1>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input label="First Name" type="text" name="firstName" value={firstName} onChange={setFirstName} />
                        <Input label="Middle Name" type="text" name="middleName" value={middleName} onChange={setMiddleName} />
                        <Input label="Last Name" type="text" name="lastName" value={lastName} onChange={setLastName} />
                        <Input label="Date of Birth" type="date" name="dateOfBirth" value={dateOfBirth} onChange={setDateOfBirth} />
                        <Input label="Age" type="text" name="age" value={isNaN(getAge) ? '' : getAge} disabled={true} />
                        <Select 
                            label="Gender" 
                            name="gender" 
                            value={gender} 
                            options={genders} 
                            onChange={setGender} 
                        />
                        <Select 
                            label="Religion" 
                            name="religion" 
                            value={religion} 
                            options={religions} 
                            onChange={setReligion} 
                        />
                        <Select 
                            label="Nationality" 
                            name="nationality" 
                            value={nationality} 
                            options={nationalities} 
                            onChange={setNationality} 
                        />

                        <Input label="Place of Birth" type="text" name="placeOfBirth" value={placeOfBirth} onChange={setPlaceOfBirth} />
                        <Input label="Spouse Name" type="text" name="spouseName" value={spouseName} onChange={setSpouseName} />
                        <Input label="Spouse Contact Number" type="text" name="spouseCel" value={spouseCel} onChange={setSpouseCel} />
                        <Input label="Address" type="text" name="address" value={address} onChange={setAddress} />
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Active Email" type="email" name="email" value={email} onChange={setEmail} />
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="contact-number">Contact Number</label>
                            <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className="p-2 flex-grow outline-none"
                                    type="text"
                                    id="contact-number"
                                    name="contactNumber"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Education" type="text" name="education" value={education} onChange={setEducation} />
                        <Input label="School Graduated" type="text" name="schoolGraduated" value={schoolGraduated} onChange={setSchoolGraduated} />
                        <Input label="Year Graduated" type="text" name="yearGraduated" value={yearGraduated} onChange={setYearGraduated} />
                        <Input label="Years of Experience" type="number" name="yearsOfExperience" value={yearsOfExperience} onChange={setYearsOfExperience} />
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">School Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Joining Date" type="date" name="joiningDate" value={joiningDate} onChange={setJoiningDate} />
                        {/* <Select label="Department" name="department" value={department} options={departments} onChange={handleChange} />
                        <Select label="Grade Level" name="gradeLevel" value={gradeLevel} options={gradeLevels} onChange={handleChange} />
                        <Select label="Section" name="section" value={section} options={sections} onChange={handleChange} /> */}
                    </div>
                </section>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-700 transition duration-200"
                    >
                        Add Teacher
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-red-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-red-700 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <ToastContainer />
        </main>
    );
};

export default NewTeacher;
