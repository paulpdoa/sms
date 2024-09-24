import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';
import { genders as genderSelections } from '../../data/genders.json';
import { useSnackbar } from 'notistack';

const EditStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/student/${id}`);
    const { enqueueSnackbar } = useSnackbar();

    const { records: religions } = useFetch(`${baseUrl()}/religions`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const { session,currentUserId,role,genericPath } = useContext(MainContext);

    const suffixes = [
        { _id: 'Jr',suffix: 'Jr' },
        { _id: 'Sr',suffix: 'Sr' },
        { _id: 'I',suffix:'I', },
        {  _id: 'II',suffix:'II' },
        { _id: 'III',suffix:'III' }
    ]

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
    const [error,setError] = useState({
        firstName: '',
        lastName: '',
        suffix: '',
        dateOfBirth: '',
        sex: '',
        religin: '',
        nationality: '',
        placeOfBirth: '',
        email: '',
        contactNumber: '',
        address: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };

    useEffect(() => {
        if(records) {
            setFirstName(records.firstName || '');
            setMiddleName(records.middleName || '');
            setLastName(records.lastName || '');
            setSuffix(records.suffix || '');
            setDateOfBirth(records.dateOfBirth || '');
            setAge(calculateAge(records.dateOfBirth));
            setSex(records.sex || '');
            setReligion(records.religion?._id || '');
            setNationality(records.nationality?._id || '');
            setPlaceOfBirth(records.placeOfBirth || '');
            setEmail(records.email || '');
            setContactNumber(records.contactNumber || '');
            setAddress(records.address || '');
            setProfilePictureUrl(`${baseUrl()}${records?.profilePictureUrl}` || '')
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


        if(!firstName) setError(prev => ({ ...prev, firstName: 'First name cannot be empty' }));
        if(!lastName) setError(prev => ({ ...prev, lastName: 'Last name cannot be empty' }));
        if(!suffix) setError(prev => ({ ...prev,suffix: 'Suffix cannot be empty' }));
        if(!dateOfBirth) setError(prev => ({ ...prev, dateOfBirth: 'Date of birth cannot be empty' }));
        if(!sex) setError(prev => ({ ...prev, sex: 'Gender cannot be empty' }));
        if(!religion) setError(prev => ({ ...prev, religion: 'Religion cannot be empty' }));
        if(!nationality) setError(prev => ({ ...prev, nationality: 'Nationality cannot be empty' }));
        if(!placeOfBirth) setError(prev => ({ ...prev, placeOfBirth: 'Place of birth cannot be empty' }));
        if(!email) setError(prev => ({ ...prev, email: 'Email cannot be empty' }));
        if(!contactNumber) setError(prev => ({ ...prev, contactNumber: 'Contact number cannot be empty' }));
        if(!address) setError(prev => ({ ...prev, address: 'Address cannot be empty' }));

        setTimeout(() => {
            setError({
                firstName: '',
                lastName: '',
                suffix: '',
                dateOfBirth: '',
                sex: '',
                religin: '',
                nationality: '',
                placeOfBirth: '',
                email: '',
                contactNumber: '',
                address: ''
            })
        },3000)

        if(!firstName || !lastName || !suffix || !dateOfBirth || !sex || !religion || !nationality || !placeOfBirth || !email || !contactNumber || !address) return
        // Create a new FormData instance
        const formData = new FormData();
        formData.append('firstName',firstName);
        formData.append('middleName', middleName);
        formData.append('lastName',lastName);
        formData.append('suffix',suffix);
        formData.append('dateOfBirth', dateOfBirth)
        formData.append('age',age)
        formData.append('gender', sex)
        formData.append('religion',religion);
        formData.append('nationality', nationality)
        formData.append('placeOfBirth',placeOfBirth)
        formData.append('email', email)
        formData.append('contactNumber', contactNumber)
        formData.append('address', address);
        formData.append('session',session);
        formData.append('currentUserId', currentUserId)
        formData.append('role',role);
        formData.append('sessionId', session)
        formData.append('session', session);
        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }

        try {
            const data = await axios.patch(`${baseUrl()}/student/${id}`, formData, {
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

    return (
        <main className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
            <form onSubmit={editStudent} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Edit Student</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("firstName", "First Name", firstName, setFirstName, "text",false,false,error)}
                        {renderInput("middleName", "Middle Name", middleName, setMiddleName, "text",false,false)}
                        {renderInput("lastName", "Last Name", lastName, setLastName, "text",false,false,error)}
                        {renderSelect("suffix", "Ext/Suffix", suffix, setSuffix, suffixes, "Suffix",false,true,error) }
                        {renderInput("dateOfBirth", "Date of Birth", dateOfBirth, handleDateOfBirthChange, "date",false,false,error)}
                        {renderInput("age", "Age", age, () => {}, "number", true,error)}
                        {renderSelect("sex", "Sex", sex, setSex, genderSelections, "Gender",false,false,error)}
                        {renderSelect("religion", "Religion", religion, setReligion, religions, "Religion",false,false,error)}
                        {renderSelect("nationality", "Nationality", nationality, setNationality, nationalities, "Nationality",false,false,error)}
                        {renderInput("placeOfBirth", "Place of Birth", placeOfBirth, setPlaceOfBirth, "text",false,false,error)}
                        {renderInput("address", "Address", address, setAddress, "text", false, true,error)}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {renderInput("email", "Active Email", email, setEmail, "email",false,false,error)}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="contactNumber">Contact Number</label>
                            <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-green-500">
                                <span className="bg-gray-500 p-2 text-gray-100">+63</span>
                                <input
                                    className={`outline-none p-2 flex-grow ${error.contactNumber ? 'border-red-500' : 'border-gray-300'} border`}
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

                <button className="bg-blue-500 text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(`/${genericPath}/students`)} className="bg-red-600 text-white text-sm p-3 mt-5 ml-2 rounded-md hover:bg-red-700 transition duration-300">
                    Cancel
                </button>
            </form>
        </main>
    );
};

const renderInput = (id, label, value, onChange, type, disabled = false, fullSpan = false,error = {}) => (
    <div className={`flex flex-col ${fullSpan ? "col-span-full sm:col-span-2 md:col-span-3" : ""}`}>
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <input
            className={`outline-none p-2 rounded-md border ${error[id] ? 'border-red-500' : 'border-gray-300'}`}
            type={type}
            id={id}
            value={value}
            onChange={type === "date" ? onChange : (e) => onChange(e.target.value)}
            disabled={disabled}
        />
        { error[id] && <span className="text-red-500 text-xs">{error[id]}</span> }
    </div>
);

const renderSelect = (id, label, value, onChange, options, placeholder,required = false, withNA = false,error = {}) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className={`outline-none p-2 rounded-md border ${error[id] ? 'border-red-500' : 'border-gray-300'}`}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" hidden>{value ?? placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={label === 'Sex' ? option.name : option._id}>
                    { label === 'Religion' && option.religion }
                    { label === 'Nationality' && option.nationality }
                    { label === 'Sex' && option.name }
                    { id === 'suffix' && option.suffix }
                </option>
            ))}
            { withNA && <option value="">N/A</option> }
        </select>
        { error[id] && <span className="text-red-500 text-xs">{error[id]}</span> }
    </div>
);

export default EditStudent;
