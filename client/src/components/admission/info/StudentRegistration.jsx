import { useState,useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useFetch } from '../../../hooks/useFetch';
import { baseUrl } from '../../../baseUrl';
import axios from 'axios';
import { MainContext } from '../../../helpers/MainContext';
import 'react-toastify/dist/ReactToastify.css';

const StudentRegistration = ({ id }) => {

    const [passedReportCard, setPassedReportCard] = useState(id?.academicId?.passedReportCard);
    const [settledArrears, setSettledArrears] = useState(id?.academicId?.settledArrears);
    const [completedClearance, setCompletedClearance] = useState(id?.academicId?.completedClearance);
    const [isRegistered,setIsRegistered] = useState(id?.academicId?.isRegistered);
    
    const { session,role } = useContext(MainContext);
    
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const isYearDone = schoolYear.isYearDone ? true : false;
    
    const submitInfo = async (e) => {
        e.preventDefault();

        const studentInfo = {
            passedReportCard,
            settledArrears,
            completedClearance,
            isRegistered,
            role,
            session
        }


        try {
            const data = await axios.patch(`${baseUrl()}/student/info/${id?._id}`,studentInfo);
            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch(err) {
            console.log(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    }

    return (
        <>
        <div className="grid grid-cols-1 mb-4">
            <div className="flex items-center gap-5 w-[25%] justify-between">
                <label className="text-sm font-semibold text-gray-600" htmlFor="passedReportCard">Passed Report Card</label>
                <input className="p-2 cursor-pointer border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="checkbox"
                    checked={passedReportCard}
                    onChange={(e) => setPassedReportCard(e.target.checked)}
                />
            </div>
            <div className="flex items-center gap-5 w-[25%] justify-between">
                <label className="text-sm font-semibold text-gray-600" htmlFor="settledArrears">Settled Arrears</label>
                <input className="p-2 border cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="checkbox"
                    checked={settledArrears}
                    onChange={(e) => setSettledArrears(e.target.checked)}
                />
            </div>
            <div className="flex items-center gap-5 w-[25%] justify-between">
                <label className="text-sm font-semibold text-gray-600" htmlFor="completedClearance">Completed Clearance</label>
                <input className="p-2 border cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="checkbox"
                    checked={completedClearance}
                    onChange={(e) => setCompletedClearance(e.target.checked)}
                />
            </div>

            <div className="flex items-center gap-5 mt-10">
                <label className="text-sm font-semibold text-gray-600" htmlFor="registered">Registered</label>
                <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="checkbox"
                    checked={isRegistered}
                    onChange={(e) => setIsRegistered(e.target.checked)}
                    disabled
                />
            </div>

            
        </div>
        <div className="flex gap-2 items-center justify-start mt-4">
            <button onClick={!isYearDone && submitInfo} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm`}>
                Submit
            </button>
        </div>
        <ToastContainer />
        </>
    )
}

export default StudentRegistration;