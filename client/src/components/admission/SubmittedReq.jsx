import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';

const SubmittedReq = ({ id }) => {
    const { records: requirements } = useFetch(`${baseUrl()}/requirements`);
    const { records: admission } = useFetch(`${baseUrl()}/admission/${id}`);
    const schoolYear = localStorage.getItem('session');
    
    const [selectedRequirements, setSelectedRequirements] = useState([]);

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
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    };

    return (
        <div className="mt-3">
            {requirements?.map((record) => (
                <div key={record._id} className="flex items-center justify-between gap-5 rounded-md border-b-2 border-gray-300 p-2">
                    <span className="text-sm text-green-500">{record.requirement}</span>
                    {admission?.some(ad => ad.requirementId === record._id) ? (
                        <span className="text-xs text-blue-500">Submitted</span>
                    ) : (
                        <input
                            className="cursor-pointer"
                            type="checkbox"
                            checked={selectedRequirements.includes(record._id)}
                            onChange={() => handleRequirementSelection(record._id)}
                        />
                    )}
                </div>
            ))}
            
            <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md" onClick={submitStudentRequirement}>
                Submit
            </button>
            <ToastContainer />
        </div>
    );
};

export default SubmittedReq;
