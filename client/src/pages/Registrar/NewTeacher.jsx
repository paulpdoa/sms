import { useState,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { genders as genderSelections } from '../../data/genders.json';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const Input = ({ label, type, name, value, onChange,disabled = false, required,errors = {} }) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor={name}>{label}</label>
        <input
            className={`p-2 rounded-md border ${errors[name] ? 'border-red-500' : 'border-gray-300'} outline-none focus:ring-2 focus:ring-customView`}
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            // required={required}
            // disabled={disabled}
        />
        { errors[name] && <span className="text-xs text-red-500">{errors[name]}</span> }
    </div>
);

const Select = ({ label, name, value, options, onChange, errors }) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor={name}>{label}</label>
        <select
            className={`p-2 rounded-md border ${errors[name] ? 'border-red-500' : 'border-gray-300'} outline-none focus:ring-2 focus:ring-customView`}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >   
            <option value="" hidden>{label}</option>
            {options && options.length > 0 ? (
                options.map(option => (
                    <option key={option._id} value={label === 'Gender' ? option.name : option._id}>
                        { label === 'Gender' ? option.name : option[name] }
                    </option>
                ))
            ) : (
                <option disabled>Loading...</option>
            )}
        </select>
        { errors[name] && <span className="text-xs text-red-500">{errors[name]}</span> }
    </div>
);


const NewTeacher = () => {
    const { records: religions } = useFetch(`${baseUrl()}/religions`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const { session,currentUserId,genericPath,showError } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

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
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');

    const [errors,setErrors] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        religion: '',
        nationality: '',
        placeOfBirth: '',
        email: '',
        contactNumber: '',
        address: '',
        education: '',
        schoolGraduated: '',
        yearGraduated: '',
        yearsOfExperience: '',
        joiningDate: '',
        username: '',
        password: '',
        confirmPassword: ''
    })

    const navigate = useNavigate();

    const getAge = Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10);

    const addTeacher = async (e) => {
        e.preventDefault();

        // Validate all required fields
        if (!firstName) return showError('firstName', 'First name cannot be empty', 'First name is a required field', setErrors);
        if (!lastName) return showError('lastName', 'Last name cannot be empty', 'Last name is a required field', setErrors);
        if (!dateOfBirth) return showError('dateOfBirth', 'Date of Birth cannot be empty', 'Date of Birth is a required field', setErrors);
        if (!gender) return showError('gender', 'Gender cannot be empty', 'Gender is a required field', setErrors);
        if (!religion) return showError('religion', 'Religion cannot be empty', 'Religion is a required field', setErrors);
        if (!nationality) return showError('nationality', 'Nationality cannot be empty', 'Nationality is a required field', setErrors);
        if (!placeOfBirth) return showError('placeOfBirth', 'Place of Birth cannot be empty', 'Place of Birth is a required field', setErrors);
        if (!email) return showError('email', 'Email cannot be empty', 'Email is a required field', setErrors);
        if (!contactNumber) return showError('contactNumber', 'Contact Number cannot be empty', 'Contact Number is a required field', setErrors);
        if (!address) return showError('address', 'Address cannot be empty', 'Address is a required field', setErrors);
        if (!education) return showError('education', 'Education cannot be empty', 'Education is a required field', setErrors);
        if (!schoolGraduated) return showError('schoolGraduated', 'School Graduated cannot be empty', 'School Graduated is a required field', setErrors);
        if (!yearGraduated) return showError('yearGraduated', 'Year Graduated cannot be empty', 'Year Graduated is a required field', setErrors);
        if (!yearsOfExperience) return showError('yearsOfExperience', 'Years of Experience cannot be empty', 'Years of Experience is a required field', setErrors);
        if (!joiningDate) return showError('joiningDate', 'Joining Date cannot be empty', 'Joining Date is a required field', setErrors);
        if (!username) return showError('username', 'Username cannot be empty', 'Username is a required field', setErrors);
        if (!password) return showError('password', 'Password cannot be empty', 'Password is a required field', setErrors);
        if (!confirmPassword) return showError('confirmPassword', 'Confirm Password cannot be empty', 'Confirm Password is a required field', setErrors);
    
        // Create a new FormData instance
        const formData = new FormData();
    
        // Append each teacher information field to the form data
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('middleName', middleName);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('gender', gender);
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
        formData.append('age', getAge);  // Assuming getAge is a value, not a function
        formData.append('session', session);
        formData.append('currentUserId', currentUserId);
        formData.append('password', password);
        formData.append('username', username);

        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }
    
        if (password !== confirmPassword) {
            return enqueueSnackbar('Password does not match, please try again', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    
        try {
            // Send the FormData using axios
            const data = await axios.post(`${baseUrl()}/teachers`, formData, {
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
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };

    return (
        <main className="p-4 bg-gray-100">
            <form onSubmit={addTeacher} className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-4">Add New Teacher</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input label="First Name" type="text" name="firstName" value={firstName} onChange={setFirstName} errors={errors} />
                        <Input label="Middle Name" type="text" name="middleName" value={middleName} onChange={setMiddleName} />
                        <Input label="Last Name" type="text" name="lastName" value={lastName} onChange={setLastName} errors={errors} />
                        <Input label="Date of Birth" type="date" name="dateOfBirth" value={dateOfBirth} onChange={setDateOfBirth} errors={errors} />
                        <Input label="Age" type="text" name="age" value={isNaN(getAge) ? '' : getAge} disabled={true} />
                        <Select 
                            label="Gender" 
                            name="gender" 
                            value={gender} 
                            options={genderSelections} 
                            onChange={setGender} 
                            errors={errors}
                        />
                        <Select 
                            label="Religion" 
                            name="religion"     
                            value={religion} 
                            options={religions} 
                            onChange={setReligion}
                            errors={errors} 
                        />
                        <Select 
                            label="Nationality" 
                            name="nationality" 
                            value={nationality} 
                            options={nationalities} 
                            onChange={setNationality}
                            errors={errors}
                        />

                        <Input label="Place of Birth" type="text" name="placeOfBirth" value={placeOfBirth} onChange={setPlaceOfBirth} errors={errors} />
                        <Input label="Spouse Name" type="text" name="spouseName" value={spouseName} onChange={setSpouseName} required={false} />
                        <Input label="Spouse Contact Number" type="text" name="spouseCel" value={spouseCel} onChange={setSpouseCel} required={false} />
                        <Input label="Address" type="text" name="address" value={address} onChange={setAddress} errors={errors} />
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Active Email" type="email" name="email" value={email} onChange={setEmail} errors={errors} />
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="contact-number">Contact Number</label>
                            <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className={`p-2 flex-grow outline-none ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} border`}
                                    type="text"
                                    id="contact-number"
                                    name="contactNumber"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                                { errors.contactNumber && <span className="text-red-500 text-xs">{errors.contactNumber}</span> } 
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Education" type="text" name="education" value={education} onChange={setEducation} errors={errors} />
                        <Input label="School Graduated" type="text" name="schoolGraduated" value={schoolGraduated} onChange={setSchoolGraduated} errors={errors} />
                        <Input label="Year Graduated" type="text" name="yearGraduated" value={yearGraduated} onChange={setYearGraduated} errors={errors} />
                        <Input label="Years of Experience" type="number" name="yearsOfExperience" value={yearsOfExperience} onChange={setYearsOfExperience} errors={errors} />
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">School Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Joining Date" type="date" name="joiningDate" value={joiningDate} onChange={setJoiningDate} />
                        {/* <Select label="Department" name="department" value={department} options={departments} onChange={handleChange} />
                        <Select label="Grade Level" name="gradeLevel" value={gradeLevel} options={gradeLevels} onChange={handleChange} />
                        <Select label="Section" name="section" value={section} options={sections} onChange={handleChange} /> */}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Teacher User Account</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Username" type="text" name="username" value={username} onChange={setUsername} errors={errors} />
                        <Input label="Password" type="password" name="password" value={password} onChange={setPassword} errors={errors} />
                        <Input label="Confirm Password" type="password" name="confirmPassword" value={confirmPassword} onChange={setConfirmPassword} errors={errors} />
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


                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                    >
                        Add Teacher
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/${genericPath}/teachers`)}
                        className="bg-red-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-red-700 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
};

export default NewTeacher;
