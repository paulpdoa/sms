import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const NewTeacher = () => {

    //Get religion records
    const { records: religions, isLoading } = useFetch(`${baseUrl()}/religions`);
    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`)
    const { records: departments } = useFetch(`${baseUrl()}/departments`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);

    const navigate = useNavigate();

    const [firstName,setFirstName] = useState('');
    const [middleName,setMiddleName] = useState('');
    const [lastName,setLastName] = useState('');
    
    const [dateOfBirth,setDateOfBirth] = useState('');
    const [age,setAge] = useState(0);
    const [sex,setSex] = useState('');
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
    const [department,setDepartment] = useState('');
    const [gradeLevel,setGradeLevel] = useState('');
    const [section,setSection] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const getAge = Math.floor((new Date() - new Date(dateOfBirth).getTime()) / 3.15576e+10)

    const addTeacher = async (e) => {
        e.preventDefault();

        const teacherInformation = {
            firstName,
            middleName,
            lastName,
           
            dateOfBirth,
            age: getAge,
            sex,
            religion,
            nationality,
            placeOfBirth,
            email,
            contactNumber,
            address,
            spouseName,
            spouseCel,
            education,
            schoolGraduated,
            yearGraduated,
            yearsOfExperience,
            joiningDate,
            department,
            gradeLevel,
            section,
            username,
            password,
            confirmPassword
        }
    
        try {
            const data = await axios.post(`${baseUrl()}/teachers`,teacherInformation);
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
            <h1 className="font-semibold text-center text-gray-800 text-xl">Add New Teacher</h1>
            <form onSubmit={addTeacher}>
                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Basic Information</h2>
                    <div className="flex items-center justify-start gap-4">
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
                        {/* <div className="flex flex-col">
                            <label className="text-sm" htmlFor="suffix">Ext/Suffix</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setSuffix(e.target.value)}
                            />
                        </div>                     */}
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
                            disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="sex">Sex</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setSex(e.target.value)}
                            >
                                <option hidden>Gender</option>
                                { genders?.map(gender => (
                                    <option key={gender._id} value={gender._id}>{gender.gender}</option>
                                )) }
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="religion">Religion</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setReligion(e.target.value)}
                            >
                                <option hidden>Religion</option>
                                { religions?.map(religion => (
                                    <option key={religion._id} value={religion._id}>{religion.religion}</option>
                                )) }
                            </select>
                        </div>      
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="suffix">Nationality</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setNationality(e.target.value)}
                            >
                                <option hidden>Nationality</option>
                                { nationalities?.map(nationality => (
                                    <option value={nationality._id}>{nationality.nationality    }</option>
                                )) }
                            </select>
                        </div>       
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="place of birth">Place of birth</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setPlaceOfBirth(e.target.value)}
                            />
                        </div>              
                    </div>
                    <div className="flex items-center justify-start gap-4 mt-3">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="spouse name">Spouse Name</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setSpouseName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="spouse cel">Spouse Contact Number</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setSpouseCel(e.target.value)}
                            />
                        </div>     
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

                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Academic Information</h2>
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="education">Education</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setEducation(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="school graduated">School Graduated</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setSchoolGraduated(e.target.value)} 
                            />
                        </div>      
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="year graduated">Year Graduated</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setYearGraduated(e.target.value)} 
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="years of experience">Years of Experience</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="number" 
                            onChange={(e) => setYearsOfExperience(e.target.value)} 
                            />
                        </div>              
                    </div>
                </div>

                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">School Information</h2>
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="joining date">Joining Date</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="date" 
                            onChange={(e) => setJoiningDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="department">Department</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option hidden>Department</option>
                                { departments?.map(department => (
                                    <option key={department._id} value={department._id}>{department.department}</option>
                                )) }
                            </select>
                        </div>      
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="grade level">Grade Level</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setGradeLevel(e.target.value)}
                            >
                                <option hidden>Grade Level</option>
                                { gradeLevels?.map(gradeLevel => (
                                    <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                                )) }
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="section">Section</label>
                            <select className="outline-none p-1 rounded-md border border-gray-300"
                            onChange={(e) => setSection(e.target.value)}
                            >
                                <option hidden>Section</option>
                                { sections?.map(section => (
                                    <option key={section._id} value={section._id}>{section.section}</option>
                                )) }
                            </select>
                        </div>              
                    </div>
                </div>

                <div>
                    <h2 className="text-green-500 font-bold text-xl py-4">Credentials</h2>
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="username">Username</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" 
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="password">Password</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="password" 
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm" htmlFor="confirm password">Confirm Password</label>
                            <input className="outline-none p-1 rounded-md border border-gray-300" type="password" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>                         
                    </div>
                </div>

                <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
            </form>         
            <ToastContainer />
        </main>
    )
}

export default NewTeacher;