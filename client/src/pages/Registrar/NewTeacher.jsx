import { useReducer } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const initialState = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    religion: '',
    nationality: '',
    placeOfBirth: '',
    email: '',
    contactNumber: '',
    address: '',
    spouseName: '',
    spouseCel: '',
    education: '',
    schoolGraduated: '',
    yearGraduated: '',
    yearsOfExperience: '',
    joiningDate: '',
    department: '',
    gradeLevel: '',
    section: '',
    username: '',
    password: '',
    confirmPassword: ''
};

const reducer = (state, action) => {
    return { ...state, [action.name]: action.value };
};

const Input = ({ label, type, name, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor={name}>{label}</label>
        <input
            className="p-2 rounded-md border border-gray-300"
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required
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
            onChange={onChange}
            required
        >
            <option hidden>{label}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>{option.name}</option>
            ))}
        </select>
    </div>
);

const NewTeacher = () => {
    const { records: religions, isLoading: religionsLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders, isLoading: gendersLoading } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities, isLoading: nationalitiesLoading } = useFetch(`${baseUrl()}/nationalities`);
    const { records: departments, isLoading: departmentsLoading } = useFetch(`${baseUrl()}/departments`);
    const { records: gradeLevels, isLoading: gradeLevelsLoading } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: sections, isLoading: sectionsLoading } = useFetch(`${baseUrl()}/sections`);

    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = (e) => {
        dispatch({ name: e.target.name, value: e.target.value });
    };

    const getAge = Math.floor((new Date() - new Date(state.dateOfBirth).getTime()) / 3.15576e+10);

    const addTeacher = async (e) => {
        e.preventDefault();

        const teacherInformation = { ...state, age: getAge };

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
                        <Input label="First Name" type="text" name="firstName" value={state.firstName} onChange={handleChange} />
                        <Input label="Middle Name" type="text" name="middleName" value={state.middleName} onChange={handleChange} />
                        <Input label="Last Name" type="text" name="lastName" value={state.lastName} onChange={handleChange} />
                        <Input label="Date of Birth" type="date" name="dateOfBirth" value={state.dateOfBirth} onChange={handleChange} />
                        <Input label="Age" type="text" name="age" value={isNaN(getAge) ? '' : getAge} disabled />
                        <Select label="Sex" name="sex" value={state.sex} options={genders} onChange={handleChange} />
                        <Select label="Religion" name="religion" value={state.religion} options={religions} onChange={handleChange} />
                        <Select label="Nationality" name="nationality" value={state.nationality} options={nationalities} onChange={handleChange} />
                        <Input label="Place of Birth" type="text" name="placeOfBirth" value={state.placeOfBirth} onChange={handleChange} />
                        <Input label="Spouse Name" type="text" name="spouseName" value={state.spouseName} onChange={handleChange} />
                        <Input label="Spouse Contact Number" type="text" name="spouseCel" value={state.spouseCel} onChange={handleChange} />
                        <Input label="Address" type="text" name="address" value={state.address} onChange={handleChange} />
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Active Email" type="email" name="email" value={state.email} onChange={handleChange} />
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="contact-number">Contact Number</label>
                            <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className="p-2 flex-grow outline-none"
                                    type="text"
                                    id="contact-number"
                                    name="contactNumber"
                                    value={state.contactNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Education" type="text" name="education" value={state.education} onChange={handleChange} />
                        <Input label="School Graduated" type="text" name="schoolGraduated" value={state.schoolGraduated} onChange={handleChange} />
                        <Input label="Year Graduated" type="text" name="yearGraduated" value={state.yearGraduated} onChange={handleChange} />
                        <Input label="Years of Experience" type="number" name="yearsOfExperience" value={state.yearsOfExperience} onChange={handleChange} />
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">School Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Joining Date" type="date" name="joiningDate" value={state.joiningDate} onChange={handleChange} />
                        <Select label="Department" name="department" value={state.department} options={departments} onChange={handleChange} />
                        <Select label="Grade Level" name="gradeLevel" value={state.gradeLevel} options={gradeLevels} onChange={handleChange} />
                        <Select label="Section" name="section" value={state.section} options={sections} onChange={handleChange} />
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input label="Username" type="text" name="username" value={state.username} onChange={handleChange} />
                        <Input label="Password" type="password" name="password" value={state.password} onChange={handleChange} />
                        <Input label="Confirm Password" type="password" name="confirmPassword" value={state.confirmPassword} onChange={handleChange} />
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
