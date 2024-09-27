import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';
import ViewChildModal from '../../components/parent/ViewChildModal';
import Dropdown from 'react-dropdown-select';

const EditParent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { records, isLoading } = useFetch(`${baseUrl()}/parent/${id}`);
    const { records: students } = useFetch(`${baseUrl()}/students`);

    const { currentUserId,session,genericPath } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const [motherName, setMotherName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [motherOccupation, setMotherOccupation] = useState('');
    const [fatherOccupation, setFatherOccupation] = useState('');
    const [guardianOccupation, setGuardianOccupation] = useState('');
    const [motherContact, setMotherContact] = useState('');
    const [fatherContact, setFatherContact] = useState('');
    const [guardianContact, setGuardianContact] = useState('');
    const [motherEmail, setMotherEmail] = useState('');
    const [fatherEmail, setFatherEmail] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [motherOffice, setMotherOffice] = useState('');
    const [fatherOffice, setFatherOffice] = useState('');
    const [guardianOffice, setGuardianOffice] = useState('');
    const [studentId, setStudentId] = useState('');

    const [isEmployee,setIsEmployee] = useState(false);
    const [joiningDate,setJoiningDate] = useState('');
    const [resignedDate,setResignedDate] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');

    // To be used in dropdown
    const studentOptions = students?.map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}` // Combine the name fields
    })).sort((a,b) => a.lastName.localeCompare(b.lastName)) || [];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };

    // For storage of child added
    const [addedChildren,setAddedChildren] = useState([]);
    const [viewChildModal,setViewChildModal] = useState(false);

    useEffect(() => {
        if (records) {
            setMotherName(records.motherName || '');
            setFatherName(records.fatherName || '');
            setGuardianName(records.guardianName || '');
            setMotherOccupation(records.motherOccupation || '');
            setFatherOccupation(records.fatherOccupation || '');
            setGuardianOccupation(records.guardianOccupation || '');
            setMotherContact(records.motherContact || '');
            setFatherContact(records.fatherContact || '');
            setGuardianContact(records.guardianContact || '');
            setMotherEmail(records.motherEmail || '');
            setFatherEmail(records.fatherEmail || '');
            setGuardianEmail(records.guardianEmail || '');
            setMotherOffice(records.motherOffice || '');
            setFatherOffice(records.fatherOffice || '');
            setGuardianOffice(records.guardianOffice || '');
            setAddedChildren(records?.studentId);
            setIsEmployee(records?.isEmployee || '');
            setJoiningDate(records.joiningDate || '');
            setResignedDate(records?.resignedDate || '')
            setProfilePictureUrl(`${baseUrl()}${records?.profilePictureUrl}`);
            setAddedChildren(records?.studentId || '');
        }
    }, [records]);


    const handleAddingChild = () => {
        setAddedChildren(prev => {
            const student = students.find(student => student._id === studentId);
            // Check if the student's _id already exists in addedChildren
            const alreadyExists = prev.some(child => child._id === student._id);

            if(alreadyExists) {
                enqueueSnackbar(`${student.firstName} is already in the record`, { 
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    autoHideDuration: 2000,
                    preventDuplicate: true
                });
                return [...prev]
            } else {
                enqueueSnackbar(`${student.firstName} has been added, please select view on top right`, { 
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    autoHideDuration: 2000,
                    preventDuplicate: true
                });
                return [...prev, student]
            }
        })

        setStudentId('');
    }


    const editParent = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('motherName', motherName);
        formData.append('fatherName', fatherName);
        formData.append('guardianName', guardianName);
        formData.append('motherOccupation', motherOccupation);
        formData.append('fatherOccupation', fatherOccupation);
        formData.append('guardianOccupation', guardianOccupation);
        formData.append('motherContact', motherContact);
        formData.append('fatherContact', fatherContact);
        formData.append('guardianContact', guardianContact);
        formData.append('motherEmail', motherEmail);
        formData.append('fatherEmail', fatherEmail);
        formData.append('guardianEmail', guardianEmail);
        formData.append('motherOffice', motherOffice);
        formData.append('fatherOffice', fatherOffice);
        formData.append('guardianOffice', guardianOffice);
        formData.append('studentId', JSON.stringify(addedChildren));
        formData.append('inputter', currentUserId);
        formData.append('sessionId', session);
        
        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }


        try {
            const data = await axios.patch(`${baseUrl()}/parent/${id}`, formData, {
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
                onClose: () =>{
                    navigate(`/${genericPath}/parents`);
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
                preventDuplicate: true,
            });
        }
    };

    const renderInput = (id, label, value, onChange, type = 'text') => (
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

    const renderSelect = (id, label, value, onChange, options, placeholder) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
                <option hidden>{ value ? `${value.firstName} ${value.middleName} ${value.lastName}` : placeholder}</option>
                {options?.map((option) => (
                    <option key={option._id} value={option._id}>
                        {option.firstName} {option.middleName} {option.lastName}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <main className="p-4">
            <form onSubmit={editParent} className="space-y-8 bg-gray-100 shadow-md p-6 rounded-md">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-start text-gray-700 text-3xl">Edit Parent</h1>
                    {/* <button 
                        onClick={() => setViewChildModal(true)}
                        type="button" 
                        className="bg-customView hover:bg-blue-600 rounded-md text-gray-100 p-2 text-sm"
                    >
                        View Child Added
                    </button> */}
                </div>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Mother's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {renderInput('motherName', "Mother's Name", motherName, setMotherName)}
                        {renderInput('motherOccupation', "Mother's Occupation", motherOccupation, setMotherOccupation)}
                        {renderInput('motherOffice', "Mother's Office", motherOffice, setMotherOffice)}
                        {renderInput('motherContact', "Mother's Contact #", motherContact, setMotherContact)}
                        {renderInput('motherEmail', "Mother's Email", motherEmail, setMotherEmail, 'email')}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Father's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {renderInput('fatherName', "Father's Name", fatherName, setFatherName)}
                        {renderInput('fatherOccupation', "Father's Occupation", fatherOccupation, setFatherOccupation)}
                        {renderInput('fatherOffice', "Father's Office", fatherOffice, setFatherOffice)}
                        {renderInput('fatherContact', "Father's Contact #", fatherContact, setFatherContact)}
                        {renderInput('fatherEmail', "Father's Email", fatherEmail, setFatherEmail, 'email')}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Guardian's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {renderInput('guardianName', "Guardian's Name", guardianName, setGuardianName)}
                        {renderInput('guardianOccupation', "Guardian's Occupation", guardianOccupation, setGuardianOccupation)}
                        {renderInput('guardianOffice', "Guardian's Office", guardianOffice, setGuardianOffice)}
                        {renderInput('guardianContact', "Guardian's Contact #", guardianContact, setGuardianContact)}
                        {renderInput('guardianEmail', "Guardian's Email", guardianEmail, setGuardianEmail, 'email')}
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Employee Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianName">Working Here</label>
                            <select
                                value={isEmployee}
                                className="outline-none p-2 rounded-md border border-gray-300"
                                onChange={(e) => setIsEmployee(e.target.value)}
                            >
                                <option hidden>Select here</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="joiningDate">Joining Date</label>
                            <input
                                value={joiningDate}
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="date"
                                onChange={(e) => setJoiningDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="resignedDate">Resigned Date</label>
                            <input
                                value={resignedDate}
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="date"
                                onChange={(e) => setResignedDate(e.target.value)}
                            />
                        </div>
                    </div>
                </section>
            {/* {
                console.log(addedChildren)
            } */}
                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Children:</h2>
                    <Dropdown
                        onChange={(selectedItems) => {
                            setAddedChildren(selectedItems);  // Store the array of selected student objects
                        }} 
                        options={studentOptions}
                        labelField="fullName"
                        valueField="_id"
                        multi={true}
                        searchable={true}
                        searchBy="firstName"  // Search by first name
                        selectAll={true}
                        placeholder="Select children"
                        values={studentOptions.filter(student => addedChildren.some(child => child._id === student._id))}  // Sync selected values with options                    
                    />
                    {/* {renderSelect('student', 'Student Name', studentId, setStudentId, students, 'Select student')}
                    { studentId && (
                        <button 
                            type="button"
                            onClick={handleAddingChild}
                            className="bg-customView hover:bg-blue-600 text-sm p-2 text-gray-100 rounded-md mt-2"
                        >
                            Add as child
                        </button>
                    ) } */}
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

                <button className="bg-customView hover:bg-blue-600 text-white text-sm p-3 mt-6 rounded-md">
                    Submit
                </button>
                <button onClick={() => navigate(`/${genericPath}/parents`)} className="bg-red-500 hover:bg-red-600 ml-2 text-white text-sm p-3 mt-6 rounded-md">
                    Cancel
                </button>
            </form>
            {/* { viewChildModal && (
                <ViewChildModal
                    addedChildren={addedChildren}
                    onClose={setViewChildModal}
                    setAddedChildren={setAddedChildren}
                />
            ) } */}
        </main>
    );
};

export default EditParent;


