import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { genders as genderSelections } from '../data/genders.json';
import { MainContext } from '../helpers/MainContext';
import { useSnackbar } from 'notistack';

const EditFinance = () => {
    
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/finance/${id}`);
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
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');
    const [errors,setErrors] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        religion: '',
        sex: '',
        nationality: '',
        username: '',
        password: '',
        confirmPassword:'',
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };

    const { session,currentUserId,genericPath,showError } = useContext(MainContext);


    useEffect(() => {
        if(records) {
            setFirstName(records.firstName);
            setMiddleName(records.middleName);
            setLastName(records.lastName);
            setDateOfBirth(records.dateOfBirth);
            setSex(records?.sex);
            setReligion(records?.religionId?._id);
            setNationality(records?.nationalityId?._id);
            setPlaceOfBirth(records.placeOfBirth);
            setEmail(records.email);
            setContactNumber(records.contactNumber);
            setAddress(records.address);
            setProfilePictureUrl(`${baseUrl()}${records?.profilePictureUrl}`);
        }
    }, [records]);


    const handleDateOfBirthChange = (e) => {
        const dob = e.target.value;
        setDateOfBirth(dob);
    };

    const editFinance = async (e) => {
        e.preventDefault();

        if(!firstName) return showError('firstName','First name cannot be empty','First name is a required field',setErrors);
        if(!lastName) return showError('lastName','Last name cannot be empty', 'Last name is a required field', setErrors);
        if(!dateOfBirth) return showError('dateOfBirth', 'Date of birth cannot be empty', 'Date of birth is a required field', setErrors);
        if(!placeOfBirth) return showError('placeOfBirth','Place of birth cannot be empty', 'Place of birth is a required field', setErrors);
        if(!address) return showError('address', 'Address cannot be empty', 'Address is a required field', setErrors);
        if(!religion) return showError('religion','Religion cannot be empty', 'Religion is a required field', setErrors);
        if(!sex) return showError('sex', 'Gender cannot be empty', 'Gender is a required field', setErrors);
        if(!nationality) return showError('nationality','Nationality cannot be empty', 'Nationality is a required field',setErrors);

        const formData = new FormData();
        formData.append('firstName',firstName);
        formData.append('lastName', lastName);
        formData.append('middleName', middleName);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('sex',sex);
        formData.append('religion',religion);
        formData.append('nationality',nationality);
        formData.append('placeOfBirth',placeOfBirth);
        formData.append('email', email);
        formData.append('contactNumber', contactNumber);
        formData.append('address',address);
        formData.append('session',session);
        formData.append('inputter', currentUserId);
        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }

        try {
            const data = await axios.patch(`${baseUrl()}/finance/${id}`, formData, {
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
                    navigate(`/${genericPath}${data.data.redirect}`); // Redirect to the teachers list page or wherever you need
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating finance record', {
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
            <form onSubmit={editFinance} className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-4">Edit Finance</h1>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderInput("firstName", "First Name", firstName, setFirstName, "text",errors)}
                        {renderInput("middle-name", "Middle Name", middleName, setMiddleName, "text")}
                        {renderInput("lastName", "Last Name", lastName, setLastName, "text",errors)}
                        {renderInput("dateOfBirth", "Date of Birth", dateOfBirth, handleDateOfBirthChange, "date",errors)}
                        {renderInput("placeOfBirth", "Place of Birth", placeOfBirth, setPlaceOfBirth, "text",errors)}
                        {renderInput("address", "Address", address, setAddress, "text",errors)}
                        
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
                            { errors.sex && <span className="text-red-500 text-xs">{errors.sex}</span>}
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
                            { errors.nationality && <span className="text-red-500 text-xs">{errors.nationality}</span>}
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
                            { errors.religion && <span className="text-red-500 text-xs">{errors.religion}</span>}
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
                    <button type="submit" className="bg-customView hover:bg-blue-600 text-white p-2 mt-6 rounded-md">Update Finance</button>
                    <button type="button" onClick={() => navigate(`/${genericPath}/finance`)} className="bg-customCancel hover:bg-red-600 text-white p-2 mt-6 rounded-md">Cancel</button>
                </div>
            </form>
        </main>
    );
};

const renderInput = (id, label, value, onChange, type,errors = {}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        { errors[id] && <span className="text-red-500 text-xs">{errors[id]}</span> }
    </div>
);

const renderSelect = (id, label, value, onChange, options, optionLabel) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
        >
            <option value="" hidden>{`Select ${optionLabel}` ?? value}</option>
            {options?.map((option) => (
                <option key={option._id} value={option._id}>{option[id]}</option>
            ))}
        </select>
    </div>
);

export default EditFinance;
