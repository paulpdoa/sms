import { useState,useContext } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { baseUrl } from '../../../baseUrl';
import axios from 'axios';
import { MainContext } from '../../../helpers/MainContext';
import { academicStatus as academicStatuses } from '../../../data/academicStatus.json';
import { genders } from '../../../data/genders.json';
import { useSnackbar } from 'notistack';

const StudentInfoPopup = ({ id, closeModal }) => {

    const [lastName, setLastName] = useState(id?.lastName);
    const [firstName, setFirstName] = useState(id?.firstName);
    const [middleName, setMiddleName] = useState(id?.middleName);
    const [gender, setGender] = useState(id?.sex?._id);
    const [dateOfBirth, setDateOfBirth] = useState(id?.dateOfBirth);
    const [placeOfBirth, setPlaceOfBirth] = useState(id?.placeOfBirth);
    const [address, setAddress] = useState(id?.address);
    const [nationality, setNationality] = useState(id?.nationality?._id);
    const [religion, setReligion] = useState(id?.religion?._id);
    const [contactNumber, setContactNumber] = useState(id?.contactNumber);
    const [email, setEmail] = useState(id?.email);
    const [status, setStatus] = useState(id?.status);
    const [lrn, setLrn] = useState(id?.lrn);
    const [passedReportCard, setPassedReportCard] = useState(id?.academicId?.passedReportCard);
    const [settledArrears, setSettledArrears] = useState(id?.academicId?.settledArrears);
    const [completedClearance, setCompletedClearance] = useState(id?.academicId?.completedClearance);
    const [isRegistered,setIsRegistered] = useState(id?.academicId?.isRegistered);
    const [academicStatus,setAcademicStatus] = useState(id?.academicId?.academicStatus);
    
    const { enqueueSnackbar } = useSnackbar();

    // const { records: genders } = useFetch(`${baseUrl()}/genders`);
    const { records: nationalities } = useFetch(`${baseUrl()}/nationalities`);
    const { records: religions } = useFetch(`${baseUrl()}/religions`);

    const { session,role } = useContext(MainContext);

    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone ? true : false;


    const submitInfo = async (e) => {
        e.preventDefault();

        const studentInfo = {
            firstName,
            lastName,
            middleName,
            gender,
            dateOfBirth,
            placeOfBirth,
            address,
            nationality,
            religion,
            contactNumber,
            email,
            status,
            lrn,
            // passedReportCard,
            // settledArrears,
            // completedClearance,
            academicStatus,
            session,
            role
            // isRegistered
        }

        try {
            const data = await axios.patch(`${baseUrl()}/student/info/${id?._id}`,studentInfo);
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                // onClose: () => {
                //     window.location.reload();
                // }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating student information', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    return (
        <div>
            <div>
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
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option hidden>{id.sex ? id.sex : 'Select gender'}</option>
                            { genders?.map(gender => (
                                <option key={gender._id} value={gender.name}>{gender.name}</option>
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
                            onChange={(e) => setNationality(e.target.value)}
                        >
                            <option hidden>{id?.nationality?.nationality ? id?.nationality?.nationality : 'Select nationality'}</option>
                            { nationalities?.map(nationality => (
                                <option key={nationality._id} value={nationality._id}>{nationality.nationality}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="religion">Religion</label>
                        <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setReligion(e.target.value)}
                        >
                            <option hidden>{id?.religion?.religion ? id?.religion?.religion : 'Select religion'}</option>
                            { religions?.map(religion => (
                                <option key={religion._id} value={religion._id}>{religion.religion}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="mobileNo">Mobile Number</label>
                        <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
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
                        <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setAcademicStatus(e.target.value)}
                        >
                            <option hidden>{id?.academicId?.academicStatus ? id?.academicId?.academicStatus : 'Select academic status'}</option>
                            { academicStatuses?.map(acad => (
                               <>
                                <option key={acad._id} value={acad.name}>
                                    { acad.name}
                                </option>
                               </>
                            )) }
                        </select>
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

                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
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

                <div className="flex flex-col items-start">
                    <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="registered">Registered</label>
                    <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        type="checkbox"
                        checked={isRegistered}
                        onChange={(e) => setIsRegistered(e.target.checked)}
                        disabled
                    />
                </div> */}

                <div className="flex gap-2 items-center justify-end mt-4">
                    <button onClick={!isYearDone && submitInfo} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-opacity-50`}>
                        Submit
                    </button>
                    <button className="px-6 py-3 bg-customCancel text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={() => closeModal(false)}>
                        Close
                    </button>
                    
                </div>
                   
            </div>
        </div>
    );
}

export default StudentInfoPopup;
