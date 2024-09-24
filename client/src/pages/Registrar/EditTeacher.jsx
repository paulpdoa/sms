import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { genders as genderSelections } from '../../data/genders.json';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const EditTeacher = () => {
    
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/teacher/${id}`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);
    const { records: religions } = useFetch(`${baseUrl()}/religions`);
    const { enqueueSnackbar } = useSnackbar();

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
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');
    const { session,currentUserId,genericPath } = useContext(MainContext);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };

    useEffect(() => {
        if(records) {
            setFirstName(records.firstName);
            setMiddleName(records.middleName);
            setLastName(records.lastName);
            setDateOfBirth(records.dateOfBirth);
            setSex(records?.sex);
            setReligion(records?.religion?._id);
            setNationality(records?.nationality?._id);
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
            setUsername(records.username);
            setProfilePictureUrl(`${baseUrl()}${records?.profilePictureUrl}`);
        }
    }, [records]);


    const handleDateOfBirthChange = (e) => {
        const dob = e.target.value;
        setDateOfBirth(dob);
    };

    const editTeacher = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('middleName', middleName);
        formData.append('sex', sex);
        formData.append('religion', religion);
        formData.append('nationality', nationality);
        formData.append('placeOfBirth', placeOfBirth);
        formData.append('email', email);
        formData.append('contactNumber', contactNumber);
        formData.append('address', address);
        formData.append('spouseName', spouseName);
        formData.append('spouseCel', spouseCel);
        formData.append('education', education);
        formData.append('schoolGraduated', schoolGraduated);
        formData.append('yearGraduated', yearGraduated);
        formData.append('yearsOfExperience', yearsOfExperience);
        formData.append('joiningDate', joiningDate);
        formData.append('session', session);
        formData.append('inputter', currentUserId);
        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }

        try {
            const data = await axios.patch(`${baseUrl()}/teacher/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate(`/${genericPath}/teachers`);
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };


    return (
        <main className="p-4 bg-gray-100">
            <form onSubmit={editTeacher} className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-4">Edit Teacher</h1>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderInput("first-name", "First Name", firstName, setFirstName, "text")}
                        {renderInput("middle-name", "Middle Name", middleName, setMiddleName, "text")}
                        {renderInput("last-name", "Last Name", lastName, setLastName, "text")}
                        {renderInput("date-of-birth", "Date of Birth", dateOfBirth, handleDateOfBirthChange, "date")}
                        {renderInput("place-of-birth", "Place of Birth", placeOfBirth, setPlaceOfBirth, "text")}
                        {renderInput("spouse-name", "Spouse Name", spouseName, setSpouseName, "text")}
                        {renderInput("spouse-cel", "Spouse Contact Number", spouseCel, setSpouseCel, "text")}
                        {renderInput("address", "Address", address, setAddress, "text")}
                        
                        {/* For Gender Selection */}
                        <div className="mb-4">
                            <label  className="block text-gray-700 mb-2">Gender</label>
                            <select
                                value={sex}
                                onChange={(e) => setSex(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="" hidden>{`Select gender` ?? sex}</option>
                                {genderSelections?.map((option) => (
                                    <option key={option._id} value={option.name}>{option.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* For Nationality */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Nationality</label>
                            <select
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value={nationality || ''} hidden>{nationality ? nationalities?.find(natl => natl._id === nationality)?.nationality : `Select nationality`}</option>
                                {nationalities?.map((option) => (
                                    <option key={option._id} value={option._id}>{option.nationality}</option>
                                ))}
                            </select>
                        </div>

                        {/* For Religions*/}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Religion</label>
                            <select
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value={religion || ''} hidden>{ religion ? religions?.find(rel => rel._id === religion)?.religion : 'Select religion'}</option>
                                {religions?.map((option) => (
                                    <option key={option._id} value={option._id}>{option.religion}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderInput("email", "Active Email", email, setEmail, "email")}
                        {renderInput("contact-number", "Contact Number", contactNumber, setContactNumber, "text")}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderInput("education", "Education", education, setEducation, "text")}
                        {renderInput("school-graduated", "School Graduated", schoolGraduated, setSchoolGraduated, "text")}
                        {renderInput("year-graduated", "Year Graduated", yearGraduated, setYearGraduated, "text")}
                        {renderInput("years-of-experience", "Years of Experience", yearsOfExperience, setYearsOfExperience, "number")}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">School Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderInput("joining-date", "Joining Date", joiningDate, setJoiningDate, "date")}
                        {/* {renderSelect("department", "Department", department, setDepartment, departments, "Department")}
                        {renderSelect("grade-level", "Grade Level", gradeLevel, setGradeLevel, gradeLevels, "Grade Level")}
                        {renderSelect("section", "Section", section, setSection, sections, "Section")} */}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Profile Picture:</h2>
                    <div className="flex gap-2 items-center">
                        <div className="flex justify-center mb-4">
                            <img
                                src={profilePictureUrl ? profilePictureUrl : '/avatar/avatar.png'}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="py-2"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-2">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 mt-6 rounded-md">Update Teacher</button>
                    <button type="button" onClick={() => navigate(`/${genericPath}/teachers`)} className="bg-red-500 hover:bg-red-600 text-white p-2 mt-6 rounded-md">Cancel</button>
                </div>
            </form>
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
            required
        >
            <option value="" hidden>{`Select ${optionLabel}` ?? value}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>{option[id]}</option>
            ))}
        </select>
    </div>
);

export default EditTeacher;
