import { useState,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';
import Dropdown from 'react-dropdown-select';

const NewParent = () => {
    // Fetch records for religions, genders, students, and nationalities
    const { records: religions, isLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const { session,currentUserId,genericPath,snackbarKey } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    // To be used in dropdown
    const studentOptions = students?.map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}` // Combine the name fields
    })).sort((a,b) => a.lastName.localeCompare(b.lastName)) || [];

    // Define state variables for form fields
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
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const [isEmployee,setIsEmployee] = useState(false);
    const [joiningDate,setJoiningDate] = useState('');
    const [resignedDate,setResignedDate] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl,setProfilePictureUrl] = useState('');
    // For storage of child added
    const [addedChildren,setAddedChildren] = useState([]);
    const [viewChildModal,setViewChildModal] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);  // Save the selected file to the state
            setProfilePictureUrl(URL.createObjectURL(file));  // Create a URL for the selected image
        }
    };

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

    // Function to handle form submission
    const addParent = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            return enqueueSnackbar('Password does not match', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
        }

        if(addedChildren.length < 1) {
            return enqueueSnackbar('You cannot add a parent without having a student/child in the premise', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
        }

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
        formData.append('session', session);
        formData.append('inputter', currentUserId);
        formData.append('sessionId', session);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('isEmployee', isEmployee);
        formData.append('joiningDate', joiningDate);
        formData.append('resignedDate', resignedDate);

        if(profilePicture) {
            formData.append('profilePicture', profilePicture)
        }

        try {
            const data = await axios.post(`${baseUrl()}/parent`, formData, {
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
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while adding parent record', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true,
            });
            
        }
    }

    return (
        <main className="p-4">
            <form onSubmit={addParent} className="space-y-8 bg-gray-100 shadow-md p-6 rounded-md">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-start text-gray-700 text-3xl">Add New Parent</h1>
                    {/* <button 
                        onClick={() => setViewChildModal(true)}
                        type="button" 
                        className="bg-blue-500 hover:bg-blue-600 rounded-md text-gray-100 p-2 text-sm"
                    >
                        View Child Added
                    </button> */}
                </div>
                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Mother's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherName">Mother's Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherName"
                                onChange={(e) => setMotherName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherOccupation">Mother's Occupation</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherOccupation"
                                onChange={(e) => setMotherOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherOffice">Mother's Office</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherOffice"
                                onChange={(e) => setMotherOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherContact">Mother's Contact #</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="motherContact"
                                onChange={(e) => setMotherContact(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="motherEmail">Mother's Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="motherEmail"
                                onChange={(e) => setMotherEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Father's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherName">Father's Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherName"
                                onChange={(e) => setFatherName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherOccupation">Father's Occupation</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherOccupation"
                                onChange={(e) => setFatherOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherOffice">Father's Office</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherOffice"
                                onChange={(e) => setFatherOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherContact">Father's Contact #</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="fatherContact"
                                onChange={(e) => setFatherContact(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="fatherEmail">Father's Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="fatherEmail"
                                onChange={(e) => setFatherEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Guardian's Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianName">Guardian's Name</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianName"
                                onChange={(e) => setGuardianName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianOccupation">Guardian's Occupation</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianOccupation"
                                onChange={(e) => setGuardianOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianOffice">Guardian's Office</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianOffice"
                                onChange={(e) => setGuardianOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianContact">Guardian's Contact #</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                id="guardianContact"
                                onChange={(e) => setGuardianContact(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianEmail">Guardian's Email</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="email"
                                id="guardianEmail"
                                onChange={(e) => setGuardianEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Employee Information */}
                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Employee Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardianName">Working Here</label>
                            <select
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
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="date"
                                onChange={(e) => setJoiningDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="resignedDate">Resigned Date</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="date"
                                onChange={(e) => setResignedDate(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">Children:</h2>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm" htmlFor="student">Student Name</label>
                        <Dropdown
                             onChange={(selectedItems) => {
                                const ids = selectedItems.map(item => item._id);  // Extract only the IDs
                                setAddedChildren(selectedItems);  // Store the array of IDs
                            }} 
                            options={studentOptions}
                            labelField="fullName"
                            valueField='_id'
                            multi={true}
                            searchable={true}
                            searchBy='fullName'
                            selectAll={true}
                            placeholder='Select children'
                        />
                        {/* <select
                            value={studentId}
                            className="outline-none p-2 rounded-md border border-gray-300"
                            id="student"
                            onChange={(e) => setStudentId(e.target.value)}
                        >
                            <option hidden>Select student</option>
                            {students?.map(student => (
                                <option key={student._id} value={student._id}>
                                    {student.firstName} {student.middleName} {student.lastName}
                                </option>
                            ))}
                        </select> */}
                    </div>

                    {/* { studentId && (
                        <button 
                            type="button"
                            onClick={handleAddingChild}
                            className="bg-customView hover:bg-blue-600 text-sm p-2 text-gray-100 rounded-md mt-2"
                        >
                            Add as child
                        </button>
                    ) } */}
                </section>

                {/* Grid for child */}
                <div>

                </div>

                <section>
                    <h2 className="text-gray-700 font-bold text-xl">User Information:</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col mt-4">
                            <label className="text-sm" htmlFor="username">Username</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm" htmlFor="password">Password</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm" htmlFor="password">Confirm Password</label>
                            <input
                                className="outline-none p-2 rounded-md border border-gray-300"
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
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

                <button 
                    className="bg-customHighlight hover:bg-blue-600 text-white text-sm p-3 mt-6 rounded-md">
                    Submit
                </button>
                <button 
                    onClick={() => navigate(`/${genericPath}/parents`)} 
                    className="bg-customCancel hover:bg-red-600 text-white ml-2 text-sm p-3 mt-6 rounded-md cursor-pointer"
                >
                    Cancel
                </button>
            </form>

            {/* { viewChildModal && (
                <ViewChildModal
                    setAddedChildren={setAddedChildren}
                    addedChildren={addedChildren}
                    onClose={setViewChildModal}
                />
            ) } */}
        </main>
    )
}

export default NewParent;
