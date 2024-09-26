import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../baseUrl';
import { useFetch } from '../../../hooks/useFetch';
import { MainContext } from '../../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const SubmittedReq = ({ setEnableView }) => {
    const { records: requirements } = useFetch(`${baseUrl()}/requirements`);
    const { session: schoolYear,currStudRec,setCurrStudRec } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const id = currStudRec._id;
    const { records: admission } = useFetch(`${baseUrl()}/admission/${id}`);
    const { records: sy } = useFetch(`${baseUrl()}/school-year/${schoolYear}`);
    const isYearDone = sy.isYearDone;


    const [selectedRequirements, setSelectedRequirements] = useState([]);
    const [isAdmitted,setIsAdmitted] = useState(currStudRec?.academicId?.isAdmitted);

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

    // useEffect(() => {
    //     console.log('Updated selectedRequirements:', selectedRequirements);
    // }, [selectedRequirements]);

    const submitStudentRequirement = async (e) => {
        e.preventDefault();
        
        // console.log('Selected requirements:', selectedRequirements); // Log the selected requirements

        try {
            const response = await axios.post(`${baseUrl()}/admission`, {
                studentId: id,
                schoolYear,
                requirements: selectedRequirements
            });

            // console.log('Backend response:', response.data); // Log the backend response

            enqueueSnackbar(response.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err)
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while submitting student requirement', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    };

    return (
        <div className="mt-4 p-4 bg-white shadow-md rounded-md relative">
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


                <div className="flex items-center gap-2 absolute bottom-5 right-5">
                    <label className="mb-2 text-sm font-semibold text-gray-600" htmlFor="admitted">Admitted</label>
                    <input className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        type="checkbox"
                        checked={isAdmitted}
                        onChange={(e) => setIsAdmitted(e.target.checked)}
                        disabled
                    />
                </div>
            </div>

            
            
            <button 
                className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} bg-blue-500 text-white text-sm py-2 px-4 mt-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={submitStudentRequirement}
                disabled={isYearDone ? true : false}
            >
                Submit
            </button>
            <button onClick={() => {
                setCurrStudRec(null);
                setEnableView(false);
                }} className="bg-red-500 text-white text-sm py-2 px-4 hover:bg-red-600 rounded-md ml-2">
                Cancel
            </button>
        </div>
    );
};

export default SubmittedReq;
