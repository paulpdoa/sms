import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../../baseUrl';
import { useFetch } from '../../../hooks/useFetch';

const SubmittedReq = ({ id }) => {
    const { records: requirements } = useFetch(`${baseUrl()}/requirements`);
    const { records: admission } = useFetch(`${baseUrl()}/admission/${id}`);
    const schoolYear = localStorage.getItem('session');
    
    const [selectedRequirements, setSelectedRequirements] = useState([]);

    useEffect(() => {
        if (admission) {
            setSelectedRequirements(admission.map(ad => ad.requirementId));
        }
    }, [admission]);

    const handleRequirementSelection = (recordId) => {
        if (selectedRequirements.includes(recordId)) {
            setSelectedRequirements(selectedRequirements.filter(id => id !== recordId));
        } else {
            setSelectedRequirements([...selectedRequirements, recordId]);
        }
    };

    const submitStudentRequirement = async (e) => {
        e.preventDefault();

        try {
            const data = await axios.post(`${baseUrl()}/admission`, {
                studentId: id,
                schoolYear,
                requirements: selectedRequirements
            });

            toast.success(data.data.mssg, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.mssg || 'An error occurred', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
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
            <h2 className="text-xl font-bold text-green-600 mb-4">Submitted Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {requirements?.map((record) => (
                    <div key={record._id} className="flex items-center justify-between gap-4 border-b border-gray-300 py-2">
                        <span className="text-sm text-green-600 font-semibold">{record.requirement}</span>
                        <input
                            className="cursor-pointer h-4 w-4 text-green-500 focus:ring-0"
                            type="checkbox"
                            checked={selectedRequirements.includes(record._id)}
                            onChange={() => handleRequirementSelection(record._id)}
                        />
                    </div>
                ))}
            </div>
            
            <button 
                className="bg-green-500 text-white text-sm py-2 px-4 mt-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={submitStudentRequirement}
            >
                Submit
            </button>
            <ToastContainer />
        </div>
    );
};

export default SubmittedReq;
