import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const NewTeacher = () => {
    const { records: religions, isLoading: religionsLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders, isLoading: gendersLoading } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities, isLoading: nationalitiesLoading } = useFetch(`${baseUrl()}/nationalities`);
    const { records: departments, isLoading: departmentsLoading } = useFetch(`${baseUrl()}/departments`);
    const { records: gradeLevels, isLoading: gradeLevelsLoading } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: sections, isLoading: sectionsLoading } = useFetch(`${baseUrl()}/sections`);

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [sex, setSex] = useState('');
    const [religion, setReligion] = useState('');
    const [nationality, setNationality] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [spouseName, setSpouseName] = useState('');
    const [spouseCel, setSpouseCel] = useState('');
    const [education, setEducation] = useState('');
    const [schoolGraduated, setSchoolGraduated] = useState('');
    const [yearGraduated, setYearGraduated] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [department, setDepartment] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [section, setSection] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const getAge = Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10);

    const addTeacher = async (e) => {
        e.preventDefault();

        const teacherInformation = {
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            age: getAge,
            sex,
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
            department,
            gradeLevel,
            section,
            username,
            password,
            confirmPassword
        };

        try {
            const data = await axios.post(`${baseUrl()}/teachers`, teacherInformation);
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
        <main className="p-4 bg-gray-100">
            <form onSubmit={addTeacher} className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="font-bold text-start text-green-600 text-3xl mb-4">Add New Teacher</h1>
                <section>
                    <h2 className="text-green-600 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="first-name">First Name</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="first-name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="middle-name">Middle Name</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="middle-name"
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="last-name">Last Name</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="last-name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="date-of-birth">Date of Birth</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="date"
                                id="date-of-birth"
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="age">Age</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="age"
                                value={isNaN(getAge) ? '' : getAge}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="sex">Sex</label>
                            <select
                                className="p-2 rounded-md border border-gray-300"
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
                            <label className="text-sm mb-1" htmlFor="religion">Religion</label>
                            <select
                                className="p-2 rounded-md border border-gray-300"
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
                            <label className="text-sm mb-1" htmlFor="nationality">Nationality</label>
                            <select
                                className="p-2 rounded-md border border-gray-300"
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
                            <label className="text-sm mb-1" htmlFor="place-of-birth">Place of Birth</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="place-of-birth"
                                onChange={(e) => setPlaceOfBirth(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="spouse-name">Spouse Name</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="spouse-name"
                                onChange={(e) => setSpouseName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="spouse-cel">Spouse Contact Number</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="spouse-cel"
                                onChange={(e) => setSpouseCel(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="address">Address</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="address"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="email">Active Email</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="contact-number">Contact Number</label>
                            <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className="p-2 flex-grow outline-none"
                                    type="text"
                                    id="contact-number"
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="education">Education</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="education"
                                onChange={(e) => setEducation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="school-graduated">School Graduated</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="school-graduated"
                                onChange={(e) => setSchoolGraduated(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="year-graduated">Year Graduated</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="year-graduated"
                                onChange={(e) => setYearGraduated(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="years-of-experience">Years of Experience</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="number"
                                id="years-of-experience"
                                onChange={(e) => setYearsOfExperience(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">School Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="joining-date">Joining Date</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="date"
                                id="joining-date"
                                onChange={(e) => setJoiningDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="department">Department</label>
                            <select
                                className="p-2 rounded-md border border-gray-300"
                                id="department"
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option hidden>Department</option>
                                {departments?.map(department => (
                                    <option key={department._id} value={department._id}>{department.department}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="grade-level">Grade Level</label>
                            <select
                                className="p-2 rounded-md border border-gray-300"
                                id="grade-level"
                                onChange={(e) => setGradeLevel(e.target.value)}
                            >
                                <option hidden>Grade Level</option>
                                {gradeLevels?.map(gradeLevel => (
                                    <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="section">Section</label>
                            <select
                                className="p-2 rounded-md border border-gray-300"
                                id="section"
                                onChange={(e) => setSection(e.target.value)}
                            >
                                <option hidden>Section</option>
                                {sections?.map(section => (
                                    <option key={section._id} value={section._id}>{section.section}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Credentials</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="username">Username</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="text"
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="password">Password</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="confirm-password">Confirm Password</label>
                            <input
                                className="p-2 rounded-md border border-gray-300"
                                type="password"
                                id="confirm-password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <button className="bg-green-500 text-white p-2 mt-6 rounded-md w-full">Submit</button>
            </form>
            <ToastContainer />
        </main>
    );
};

export default NewTeacher;
