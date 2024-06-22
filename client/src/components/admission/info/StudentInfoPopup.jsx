import { useState } from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useFetch } from '../../../hooks/useFetch';
import { baseUrl } from '../../../baseUrl';

const StudentInfoPopup = ({ id, closeModal }) => {
    const [lastName, setLastName] = useState(id?.lastName);
    const [firstName, setFirstName] = useState(id?.firstName);
    const [middleName, setMiddleName] = useState(id?.middleName);
    const [gender, setGender] = useState(id?.sex?.sex);
    const [dateOfBirth, setDateOfBirth] = useState(id?.dateOfBirth);
    const [placeOfBirth, setPlaceOfBirth] = useState(id?.placeOfBirth);
    const [address, setAddress] = useState(id?.address);
    const [nationality, setNationality] = useState(id?.nationality?.nationality);
    const [religion, setReligion] = useState(id?.religion?.religion);
    const [mobileNo, setMobileNo] = useState(id?.contactNumber);
    const [email, setEmail] = useState(id?.email);
    const [status, setStatus] = useState(id?.status);
    const [lrn, setLrn] = useState(id?.lrn);
    const [passedReportCard, setPassedReportCard] = useState(id?.passedReportCard);
    const [settledArrears, setSettledArrears] = useState(id?.settledArrears);
    const [completedClearance, setCompletedClearance] = useState(id?.completedClearance);

    const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);

    const submitInfo = async (e) => {
        e.preventDefault();

        const studentInfo = {

        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="relative bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg h-[90%] overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-700">{id?.firstName} {id?.lastName} Information</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="lastname">Last Name</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="firstname">First Name</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="middlename">Middle Name</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            type="text" 
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="gender">Gender</label>
                        <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option hidden>Select gender</option>
                            { genders?.map(gender => (
                                <option key={gender._id} value={gender._id}>{gender.gender}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="dateOfBirth">Date Of Birth</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            type="date" 
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="placeOfBirth">Place Of Birth</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="text"
                            value={placeOfBirth}
                            onChange={(e) => setPlaceOfBirth(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="address">Address</label>
                    <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="nationality">Nationality</label>
                        <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                        >
                            <option hidden>Select nationality</option>
                            { nationalities?.map(nationality => (
                                <option key={nationality._id} value={nationality._id}>{nationality.nationality}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="religion">Religion</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="text"
                            value={religion}
                            onChange={(e) => setReligion(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="mobileNo">Mobile Number</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="text"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="email">Email</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="status">Status</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="lrn">LRN</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="text"
                            value={lrn}
                            onChange={(e) => setLrn(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="passedReportCard">Passed Report Card</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="checkbox"
                            checked={passedReportCard}
                            onChange={(e) => setPassedReportCard(e.target.checked)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="settledArrears">Settled Arrears</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="checkbox"
                            checked={settledArrears}
                            onChange={(e) => setSettledArrears(e.target.checked)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="completedClearance">Completed Clearance</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="checkbox"
                            checked={completedClearance}
                            onChange={(e) => setCompletedClearance(e.target.checked)}
                        />
                    </div>
                </div>

                <div className="flex gap-2 items-center justify-end mt-4">
                    <button onClick={submitInfo} className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-opacity-50">
                        Submit
                    </button>
                    <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={() => closeModal(false)}>
                        Close
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default StudentInfoPopup;
