import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const NewParent = () => {

    //Get religion records
    const { records: religions, isLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: students } = useFetch(`${baseUrl()}/students`); 
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`)

    const navigate = useNavigate();

    const [motherName,setMotherName] = useState('');
    const [fatherName,setFatherName] = useState('');
    const [guardianName,setGuardianName] = useState('');
    const [motherOccupation,setMotherOccupation] = useState('');
    const [fatherOccupation,setFatherOccupation] = useState('');
    const [guardianOccupation,setGuardianOccupation] = useState('');
    const [motherContact,setMotherContact] = useState('');
    const [fatherContact,setFatherContact] = useState('');
    const [guardianContact,setGuardianContact] = useState('');
    const [motherEmail,setMotherEmail] = useState('');
    const [fatherEmail,setFatherEmail] = useState('');
    const [guardianEmail,setGuardianEmail] = useState('');
    const [motherOffice,setMotherOffice] = useState('');
    const [fatherOffice,setFatherOffice] = useState('');
    const [guardianOffice,setGuardianOffice] = useState('');
    const [studentId,setStudentId] = useState('');

    const addParent = async (e) => {
        e.preventDefault();

        const parentInformation = {
            motherName,
            fatherName,
            guardianName,
            motherOccupation,
            fatherOccupation,
            guardianOccupation,
            motherContact,
            fatherContact,
            guardianContact,
            motherEmail,
            fatherEmail,
            guardianEmail,
            motherOffice,
            fatherOffice,
            guardianOffice,
            studentId
        }
    
        try {
            const data = await axios.post(`${baseUrl()}/parent`,parentInformation);
            // navigate(data.data.redirect);
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
            },2000);
        } catch(err) {
            console.log(err);
        }

    }

    return (
        <main className="p-2">
            <h1 className="font-semibold text-center text-gray-800 text-xl">Add New Parent</h1>
            <form onSubmit={addParent}>
                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Mother's Information</h2>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="mother's name">Mother's Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setMotherName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="mother's occupation">Mother's Occupation</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setMotherOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="mother's office">Mother's Office</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setMotherOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="mother's contact number">Mother's Contact #</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setMotherContact(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="mother's email">Mother's Email</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="email" 
                            onChange={(e) => setMotherEmail(e.target.value)}
                            />
                        </div>                    
                    </div>
                    
                    <h2 className="text-green-500 font-bold text-xl py-4">Father's Information</h2>
                    <div className="flex items-center justify-between gap-4 mt-3">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="father's name">Father's Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setFatherName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="father's occupation">Father's Occupation</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setFatherOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="father's office">Father's Office</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setFatherOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="father's contact number">Father's Contact #</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setFatherContact(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="father's email">Father's Email</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="email" 
                            onChange={(e) => setFatherEmail(e.target.value)}
                            />
                        </div>                    
                    </div>

                    <h2 className="text-green-500 font-bold text-xl py-4">Guardian's Information</h2>
                    <div className="flex items-center justify-between gap-4 mt-3">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardian's name">Guardian's Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setGuardianName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardian's occupation">Guardian's Occupation</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setGuardianOccupation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardian's office">Guardian's Office</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setGuardianOffice(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardian's contact number">Guardian's Contact #</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setGuardianContact(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="guardian's email">Guardian's Email</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="email" 
                            onChange={(e) => setGuardianEmail(e.target.value)}
                            />
                        </div>                   
                    </div>
                </div>

                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Parent Of:</h2>
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="student">Student Name</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setStudentId(e.target.value)}
                            >
                                <option hidden>Select student</option>
                                { students?.map(student => (
                                    <option key={student._id} value={student._id}>{student.firstName} { student.middleName } { student.lastName }</option>
                                )) } 
                            </select>
                        </div>
                          
                    </div>
                </div>

                <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
            </form>         
            <ToastContainer />
        </main>
    )
}

export default NewParent;