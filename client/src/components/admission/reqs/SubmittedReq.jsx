import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../../baseUrl';
import { useFetch } from '../../../hooks/useFetch';
import { MainContext } from '../../../helpers/MainContext';

const SubmittedReq = ({ id }) => {
    const { records: requirements } = useFetch(`${baseUrl()}/requirements`);
    const { records: admission } = useFetch(`${baseUrl()}/admission/${id}`);
    const { session: schoolYear } = useContext(MainContext);
    const { records: sy } = useFetch(`${baseUrl()}/school-year/${schoolYear}`);
    const isYearDone = sy.isYearDone;

    const [selectedRequirements, setSelectedRequirements] = useState([]);

    useEffect(() => {
        if (admission) {
            setSelectedRequirements(admission.map(ad => ad.requirementId));
        }
    }, [admission]);

    const handleRequirementSelection = (recordId) => {
        setSelectedRequirements(prevSelectedRequirements => {
            if (prevSelectedRequirements.includes(recordId)) {
                return prevSelectedRequirements.filter(id => id !== recordId);
            } else {
                return [...prevSelectedRequirements, recordId];
            }
        });
    };

    useEffect(() => {
        console.log('Updated selectedRequirements:', selectedRequirements);
    }, [selectedRequirements]);

    const submitStudentRequirement = async (e) => {
        e.preventDefault();
        
        console.log('Selected requirements:', selectedRequirements); // Log the selected requirements

        try {
            const response = await axios.post(`${baseUrl()}/admission`, {
                studentId: id,
                schoolYear,
                requirements: selectedRequirements
            });

            console.log('Backend response:', response.data); // Log the backend response

            toast.success(response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.mssg || 'An error occurred', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };

    return (
        <div className="mt-4 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Submitted Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {requirements?.map((record) => (
                    <div key={record._id} className="flex items-center justify-between gap-4 border-b border-gray-300 py-2">
                        <span className="text-sm text-gray-700 font-semibold">{record.requirement} { !record.isRequired && '(Optional)' } </span>
                        <input
                            className="cursor-pointer h-4 w-4 text-green-500 focus:ring-0"
                            type="checkbox"
                            checked={selectedRequirements.includes(record._id)}
                            onChange={() => handleRequirementSelection(record._id)}
                            disabled={isYearDone ? true : false}
                        />
                    </div>
                ))}
            </div>
            
            <button 
                className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} bg-blue-500 text-white text-sm py-2 px-4 mt-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={submitStudentRequirement}
                disabled={isYearDone ? true : false}
            >
                Submit
            </button>
            <ToastContainer />
        </div>
    );
};

export default SubmittedReq;
