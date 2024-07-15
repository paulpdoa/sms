import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const EditTeacher = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/teacher/${id}`);
    const { records: departments, isLoading: departmentsLoading } = useFetch(`${baseUrl()}/departments`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);

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

    useEffect(() => {
        if(records) {
            setFirstName(records.firstName);
            setMiddleName(records.middleName);
            setLastName(records.lastName);
            setDateOfBirth(records.dateOfBirth);
            setSex(records.sex?._id);
            setReligion(records.religion?._id);
            setNationality(records.nationality?._id);
            setPlaceOfBirth(records.placeOfBirth);
            setEmail(records.email);
            setContactNumber(records.contactNumber);
            setAddress(records.address);
            setSpouseName(records.spouseName);
            setSpouseCel(records.spouseCel);
            setEducation(records.education);
            setSchoolGraduated(records.schoolGraduated);
            setYearGraduated(records.yearGraduated);
            setYearsOfExperience(records.yearsOfExperience);
            setJoiningDate(records.joiningDate);
            setDepartment(records.department?._id);
            setGradeLevel(records.gradeLevel?._id);
            setSection(records.section?._id);
            setUsername(records.username);
        }
    }, [records]);

    const handleDateOfBirthChange = (e) => {
        const dob = e.target.value;
        setDateOfBirth(dob);
    };

    const editTeacher = async (e) => {
        e.preventDefault();

        const teacherInformation = {
            firstName,
            middleName,
            lastName,
            dateOfBirth,
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
            const data = await axios.patch(`${baseUrl()}/teacher/${id}`, teacherInformation);
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
                navigate(-1); // Redirect to the teachers list page or wherever you need
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error("Error editing teacher. Please try again.", {
                position: "top-center",
                autoClose: 2000,
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
            <form onSubmit={editTeacher} className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="font-bold text-start text-green-600 text-3xl mb-4">Edit Teacher</h1>
                <section>
                    <h2 className="text-green-600 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderInput("first-name", "First Name", firstName, setFirstName, "text")}
                        {renderInput("middle-name", "Middle Name", middleName, setMiddleName, "text")}
                        {renderInput("last-name", "Last Name", lastName, setLastName, "text")}
                        {renderInput("date-of-birth", "Date of Birth", dateOfBirth, handleDateOfBirthChange, "date")}
                        {renderInput("place-of-birth", "Place of Birth", placeOfBirth, setPlaceOfBirth, "text")}
                        {renderInput("spouse-name", "Spouse Name", spouseName, setSpouseName, "text")}
                        {renderInput("spouse-cel", "Spouse Contact Number", spouseCel, setSpouseCel, "text")}
                        {renderInput("address", "Address", address, setAddress, "text")}
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderInput("email", "Active Email", email, setEmail, "email")}
                        {renderInput("contact-number", "Contact Number", contactNumber, setContactNumber, "text")}
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderInput("education", "Education", education, setEducation, "text")}
                        {renderInput("school-graduated", "School Graduated", schoolGraduated, setSchoolGraduated, "text")}
                        {renderInput("year-graduated", "Year Graduated", yearGraduated, setYearGraduated, "text")}
                        {renderInput("years-of-experience", "Years of Experience", yearsOfExperience, setYearsOfExperience, "number")}
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">School Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderInput("joining-date", "Joining Date", joiningDate, setJoiningDate, "date")}
                        {renderSelect("department", "Department", department, setDepartment, departments, "Department")}
                        {renderSelect("grade-level", "Grade Level", gradeLevel, setGradeLevel, gradeLevels, "Grade Level")}
                        {renderSelect("section", "Section", section, setSection, sections, "Section")}
                    </div>
                </section>

                <section>
                    <h2 className="text-green-600 font-bold text-xl mt-6 mb-4">Credentials</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderInput("username", "Username", username, setUsername, "text")}
                        {renderInput("password", "Password", password, setPassword, "password")}
                        {renderInput("confirm-password", "Confirm Password", confirmPassword, setConfirmPassword, "password")}
                    </div>
                </section>

                <div className="flex items-center justify-end gap-2">
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-2 mt-6 rounded-md">Submit</button>
                    <button type="button" onClick={() => navigate('/teachers')} className="bg-red-500 hover:bg-red-600 text-white p-2 mt-6 rounded-md">Cancel</button>
                </div>
            </form>
            <ToastContainer />
        </main>
    );
};

const renderInput = (id, label, value, onChange, type) => (
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

const renderSelect = (id, label, value, onChange, options, optionLabel) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
            <option value="">{`Select ${optionLabel}`}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>{option.name}</option>
            ))}
        </select>
    </div>
);

export default EditTeacher;
