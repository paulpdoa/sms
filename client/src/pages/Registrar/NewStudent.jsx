import { useState,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { genders as genderSelections } from '../../data/genders.json';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';
const NewStudent = () => {

    const { records: religions } = useFetch(`${baseUrl()}/religions`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const { session,currentUserId,genericPath } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const suffixes = [
        { value: 'Jr',placeholder: 'Jr' },
        { value: 'Sr',placeholder: 'Sr' },
        { value: 'I',placeholder:'I', },
        { value: 'II',placeholder:'II' },
        { value: 'III',placeholder:'III' }
    ]

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
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [username,setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');
    const [error,setError] = useState({ firstName: '', lastName: '', suffix: '', dateOfBirth: '', sex: '', religion: '', nationality: '', placeOfBirth: '', email: '', contactNumber: '', address: '', password: '', confirmPassword: '', username: ''});

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

        if(!firstName) setError(prev => ({ ...prev, firstName: 'First name cannot be empty' }))
        if(!lastName) setError(prev => ({ ...prev, lastName: 'Last name cannot be empty' }))
        if(!suffix) setError(prev => ({ ...prev, suffix: 'Suffix cannot be empty' }))
        if(!dateOfBirth) setError(prev => ({ ...prev, dateOfBirth: 'Date of birth cannot be empty' }))
        if(!sex) setError(prev => ({ ...prev, sex: 'Gender cannot be empty' }))
        if(!religion) setError(prev => ({ ...prev, religion: 'Religion cannot be empty' }))
        if(!nationality) setError(prev => ({ ...prev, nationality: 'Nationality cannot be empty' }))
        if(!placeOfBirth) setError(prev => ({ ...prev, placeOfBirth: 'Place of birth cannot be empty' }))
        if(!email) setError(prev => ({ ...prev, email: 'Email cannot be empty' }))
        if(!contactNumber) setError(prev => ({ ...prev, contactNumber: 'Contact number cannot be empty' }))
        if(!address) setError(prev => ({ ...prev, address: 'Address cannot be empty' }))
        if(!password) setError(prev => ({ ...prev, password: 'Password cannot be empty' }))
        if(!confirmPassword) setError(prev => ({ ...prev, confirmPassword: 'Confirmation password cannot be empty' }))
        if(!username) setError(prev => ({ ...prev, username: 'Username cannot be empty' }))
        
        setTimeout(() => {
            setError({ firstName: '', lastName: '', suffix: '', dateOfBirth: '', sex: '', religion: '', nationality: '', placeOfBirth: '', email: '', contactNumber: '', address: '', password: '', confirmPassword: '', username: ''})
        },3000)

        if(!firstName || !lastName || !suffix || !dateOfBirth || !sex || !religion || !nationality || !placeOfBirth || !email || !contactNumber || !address || !password || !confirmPassword || !username) return

        // Create a new FormData instance
        const formData = new FormData();
        formData.append('firstName',firstName);
        formData.append('middleName', middleName);
        formData.append('lastName',lastName);
        formData.append('suffix',suffix);
        formData.append('dateOfBirth', dateOfBirth)
        formData.append('age',age)
        formData.append('sex', sex)
        formData.append('religion',religion);
        formData.append('nationality', nationality)
        formData.append('placeOfBirth',placeOfBirth)
        formData.append('email', email)
        formData.append('contactNumber', contactNumber)
        formData.append('address', address);
        formData.append('session',session);
        formData.append('currentUserId', currentUserId)
        formData.append('sessionId', session)
        formData.append('password',password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('username', username)
    
        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }
        try {
            const data = await axios.post(`${baseUrl()}/students`, formData, {
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
                    navigate(`/${genericPath}/students`);
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
        setProfilePicture(e.target.files[0]);
        setProfilePictureUrl(URL.createObjectURL(e.target.files[0]));
    };
    return (
        <main className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
            <form onSubmit={addStudent} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Add New Student</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("firstName", "First Name", firstName, setFirstName, "text", error)}
                        {renderInput("middleName", "Middle Name", middleName, setMiddleName, "text", error)}
                        {renderInput("lastName", "Last Name", lastName, setLastName, "text", error)}
                        {renderSelect("suffix", "Ext/Suffix", suffix, setSuffix, suffixes, "Suffix", error, false, true)}
                        {renderInput("dateOfBirth", "Date of Birth", dateOfBirth, handleDateOfBirthChange, "date", error)}
                        {renderInput("age", "Age", age, () => {}, "number", error, true)}
                        {renderSelect("sex", "Gender", sex, setSex, genderSelections, "Gender", error)}
                        {renderSelect("religion", "Religion", religion, setReligion, religions, "Religion", error)}
                        {renderSelect("nationality", "Nationality", nationality, setNationality, nationalities, "Nationality", error)}
                        {renderInput("placeOfBirth", "Place of Birth", placeOfBirth, setPlaceOfBirth, "text", error)}
                        {renderInput("address", "Address", address, setAddress, "text", error, false, true)}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("email", "Active Email", email, setEmail, "email",error)}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="contactNumber">Contact Number</label>
                            <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className={`outline-none p-2 flex-grow border ${error.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    type="text"
                                    id="contactNumber"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                   
                                />
                                
                            </div>
                            { error.contactNumber && <span className="text-red-500 text-xs">{error.contactNumber}</span> } 
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">User Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("username", "Username", username, setUsername, "text",error)}
                        {renderInput("password", "Password", password, setPassword, "password",error)}
                        {renderInput("confirmPassword", "Confirm Password", confirmPassword, setConfirmPassword, "password",error)}
                    </div>
                </section>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Profile Picture:</h2>
                    <div className="flex gap-2 items-center">
                        <div className="flex justify-center mb-4">
                            <img
                                src={profilePictureUrl || `${baseUrl()}${profilePictureUrl}` || '/avatar/avatar.png'}
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


                <button className="bg-blue-500 text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => {
                    navigate(`/${genericPath}/students`)
                    localStorage.removeItem('isStudentSignup')
                }} className="bg-red-500 text-white ml-2 text-sm p-3 mt-6 rounded-md">
                    Cancel
                </button>
            </form>
        </main>
    );
};

const renderInput = (id, label, value, onChange, type, error, disabled = false, fullSpan = false) => (
    <div className={`flex flex-col ${fullSpan ? "col-span-full sm:col-span-2 md:col-span-3" : ""}`}>
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <input
            className={`outline-none p-2 rounded-md border ${error[id] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            type={type}
            id={id}
            value={value}
            onChange={type === "date" ? onChange : (e) => onChange(e.target.value)}
            disabled={disabled}
            // required={!disabled}
        />
        { error[id] && <span className="text-red-500 text-xs">{error[id]}</span> }
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder, error, required = false, withNA = false) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className={`outline-none p-2 rounded-md border ${error[id] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            // required={required}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={id === 'sex' ? option.name : option._id}>{option[Object.keys(option)[1]]}</option>
            ))}
            { withNA && <option value="">N/A</option>}
        </select>
        { error[id] && <span className="text-red-500 text-xs">{error[id]}</span> }
    </div>
);


export default NewStudent;
