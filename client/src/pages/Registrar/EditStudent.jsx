import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const EditStudent = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    
    const { records, isLoading } = useFetch(`${baseUrl()}/student/${id}`);

    const [firstName,setFirstName] = useState('');
    const [middleName,setMiddleName] = useState('');
    const [lastName,setLastName] = useState('');
    const [suffix,setSuffix] = useState('');
    const [dateOfBirth,setDateOfBirth] = useState('');
    const [age,setAge] = useState(0);
    const [sex,setSex] = useState('');
    const [religion,setReligion] = useState('');
    const [nationality,setNationality] = useState('');
    const [placeOfBirth,setPlaceOfBirth] = useState('');
    const [email,setEmail] = useState('');
    const [contactNumber,setContactNumber] = useState('');
    const [address,setAddress] = useState('');

    const getAge = Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10)

    const addStudent = async (e) => {
        e.preventDefault();

        const studentInformation = {
            firstName,
            middleName,
            lastName,
            suffix,
            dateOfBirth,
            age: getAge,
            sex,
            religion,
            nationality,
            placeOfBirth,
            email,
            contactNumber,
            address
        }
    
        try {
            const data = await axios.post(`${baseUrl()}/students`,studentInformation);
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
            <h1 className="font-semibold text-center text-gray-800 text-xl">Add New Student</h1>
            <form onSubmit={addStudent}>
                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Basic Information</h2>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="first name">First Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="middle name">Middle Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="last name">Last Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="suffix">Ext/Suffix</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setSuffix(e.target.value)}
                            />
                        </div>                    
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-3">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="date of birth">Date of birth</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="date" 
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="age">Age</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text"
                            defaultValue={isNaN(getAge) ? '' : getAge}
                            // onChange={() => setAge(getAge)}
                            disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="sex">Sex</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setSex(e.target.value)}
                            >
                                <option hidden>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="religion">Religion</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setReligion(e.target.value)}
                            >
                                <option hidden>Religion</option>
                                <option value="Catholic">Catholic</option>
                            </select>
                        </div>      
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="suffix">Nationality</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setNationality(e.target.value)}
                            >
                                <option hidden>Nationality</option>
                                <option value="Filipino">Filipino</option>
                            </select>
                        </div>       
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="place of birth">Place of birth</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setPlaceOfBirth(e.target.value)}
                            />
                        </div>              
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-3">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="address">Address</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>                   
                    </div>
                </div>

                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Contact Details</h2>
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="email">Active Email</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="contact number">Contact Number</label>
                            <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
                                <span className="bg-gray-500 p-1 font-semibold text-gray-100">+63</span>
                                <input className="outline-none p-1" type="text" 
                                onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                        </div>             
                    </div>
                </div>

                <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
            </form>         
            <ToastContainer />
        </main>
    )
}

export default EditStudent;