import { useState, useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { genders as genderSelections } from '../../data/genders.json';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const Input = ({ label, type, name, value, onChange, disabled = false, required }) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor={name}>{label}</label>
        <input
            className="p-2 rounded-md border border-gray-300"
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
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
                    <option key={option._id} value={label === 'Gender' ? option.name : option._id}>
                        {label === 'Gender' ? option.name : option[name]}
                    </option>
                ))
            ) : (
                <option disabled>Loading...</option>
            )}
            <option value="">N/A</option>
        </select>
    </div>
);

const NewFinance = () => {

    const { records: religions, isLoading: religionsLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: nationalities, isLoading: nationalitiesLoading } = useFetch(`${baseUrl()}/nationalities`);

    const { session, currentUserId, role,genericPath } = useContext(MainContext);

    const { enqueueSnackbar } = useSnackbar();

    // State variables
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [religion, setReligion] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setProfilePictureUrl(URL.createObjectURL(e.target.files[0]));
    };
    const navigate = useNavigate();

    // Age calculation
    const getAge = dateOfBirth ? Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10) : '';

    const addFinance = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('firstName',firstName);
        formData.append('lastName', lastName);
        formData.append('middleName', middleName);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('gender',gender);
        formData.append('religion',religion);
        formData.append('nationality',nationality);
        formData.append('placeOfBirth',placeOfBirth);
        formData.append('email', email);
        formData.append('contactNumber', contactNumber);
        formData.append('address',address);
        formData.append('age', getAge);
        formData.append('session',session);
        formData.append('currentUserId', currentUserId);
        formData.append('password', password);
        formData.append('username', username);
        formData.append('role', role);
        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }

        if (password !== confirmPassword) {
            return enqueueSnackbar('Passwords do not match', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            }); 
        }

        if (password.length < 8) {
            return enqueueSnackbar('Password must be at least 8 characters long', { 
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
            const { data } = await axios.post(`${baseUrl()}/finance`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            enqueueSnackbar(data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate(`/${genericPath}/finance`);
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
            <form onSubmit={addFinance} className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="font-bold text-gray-700 text-3xl mb-4">Add New Finance</h1>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input label="First Name" type="text" name="firstName" value={firstName} onChange={setFirstName} />
                        <Input label="Middle Name" type="text" name="middleName" value={middleName} onChange={setMiddleName} />
                        <Input label="Last Name" type="text" name="lastName" value={lastName} onChange={setLastName} />
                        <Input label="Date of Birth" type="date" name="dateOfBirth" value={dateOfBirth} onChange={setDateOfBirth} />
                        <Input label="Age" type="text" name="age" value={isNaN(getAge) ? '' : getAge} disabled />
                        <Select label="Gender" name="gender" value={gender} options={genderSelections} onChange={setGender} />
                        <Select label="Religion" name="religion" value={religion} options={religions} onChange={setReligion} />
                        <Select label="Nationality" name="nationality" value={nationality} options={nationalities} onChange={setNationality} />
                        <Input label="Place of Birth" type="text" name="placeOfBirth" value={placeOfBirth} onChange={setPlaceOfBirth} />
                        <Input label="Address" type="text" name="address" value={address} onChange={setAddress} />
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Contact Details</h2>
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
                    <h2 className="text-gray-700 font-bold text-xl mt-6 mb-4">Finance User Account</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Username" type="text" name="username" value={username} onChange={setUsername} />
                        <Input label="Password" type="password" name="password" value={password} onChange={setPassword} />
                        <Input label="Confirm Password" type="password" name="confirmPassword" value={confirmPassword} onChange={setConfirmPassword} />
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

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                    >
                        Add Finance
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
        </main>
    );
};

export default NewFinance;
