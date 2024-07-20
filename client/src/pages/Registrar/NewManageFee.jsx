import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';

const NewManageFee = () => {

    const { records: feeCodes } = useFetch(`${baseUrl()}/fee-codes`);
    const { session } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { records: nationalityCodes } = useFetch(`${baseUrl()}/nationality-codes`);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [feeDescription, setFeeDescription] = useState('');
    const [selectedGradeLevels, setSelectedGradeLevels] = useState([]);
    const [showGradeLevels, setShowGradeLevels] = useState(false);
    const [amount, setAmount] = useState(0);
    const [strandId, setStrandId] = useState('');
    const [nationality, setNationality] = useState('Foreigner');
    const [showStrand, setShowStrand] = useState(false);

    useEffect(() => {
        const gradeLevelNames = gradeLevels
            .filter(gradeLevel => selectedGradeLevels.includes(gradeLevel._id))
            .map(gradeLevel => gradeLevel.gradeLevel.toLowerCase());

        setShowStrand(gradeLevelNames.includes('grade 11') || gradeLevelNames.includes('grade 12'));
    }, [selectedGradeLevels, gradeLevels]);

    const addManagedFees = async (e) => {
        e.preventDefault();

        const feeInformation = {
            sessionId: session,
            feeDescription,
            gradeLevelIds: selectedGradeLevels,
            strandId,
            amount,
            nationality,
        };

        if(amount === 0) {
            toast.error("Error adding fee. amount cannot be zero", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            return;
        }
      
        if(selectedGradeLevels.length < 1) {
           
            toast.error("Error adding fee. grade level cannot be empty", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });

            return;
        }
        const toastId = toast.loading('Please wait while creating some fees');

        try {
            const { data } = await axios.post(`${baseUrl()}/manage-fee`, feeInformation);
            toast.update(toastId, {
                render: data.mssg,
                type: "success",
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            setTimeout(() => {
                navigate('/master/manage-fees')
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.update(toastId, {
                render: 'An error occurred while creating fee',
                type: "error",
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };

    const handleGradeLevelChange = (gradeLevelId) => {
        setSelectedGradeLevels((prev) =>
            prev.includes(gradeLevelId)
                ? prev.filter((id) => id !== gradeLevelId)
                : [...prev, gradeLevelId]
        );
    };

    const handleSelectAll = () => {
        if (gradeLevels) {
            if (selectedGradeLevels.length === gradeLevels.length) {
                // Deselect all
                setSelectedGradeLevels([]);
            } else {
                // Select all
                const allGradeLevelIds = gradeLevels.map(gradeLevel => gradeLevel._id);
                setSelectedGradeLevels(allGradeLevelIds);
            }
        }
    };

    return (
        <main className="p-8 bg-gray-100 flex items-center justify-center">
            <form onSubmit={addManagedFees} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-green-600 text-3xl mb-6">Add New Fees</h1>

                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="sy">S.Y</label>
                            {schoolYear &&
                                <span className="outline-none p-2 rounded-md border border-gray-300 bg-gray-200 focus:border-green-500">
                                    {schoolYear.startYear?.split('-')[0]}-{schoolYear.endYear?.split('-')[0]}
                                </span>
                            }
                        </div>
                        {renderSelect("feeDescription", "Fee Description", feeDescription, setFeeDescription, feeCodes, "Fee Description",true)}

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="gradelevel">Grade Level</label>
                            <span
                                role="button"
                                className="outline-none p-2 rounded-md border border-gray-300 bg-white cursor-pointer"
                                onClick={() => setShowGradeLevels(!showGradeLevels)}
                            >
                                {showGradeLevels ? "Hide Grade Levels" : "Select Grade Levels"}
                            </span>
                            {showGradeLevels && (
                                <div className="border border-gray-300 rounded-md p-2 mt-2 bg-white relative">
                                    <button
                                        type="button"
                                        className="text-green-600 text-sm p-2 mb-2 rounded-md hover:underline transition duration-300"
                                        onClick={handleSelectAll}
                                    >
                                        {selectedGradeLevels.length === gradeLevels.length ? "Deselect All" : "Select All"}
                                    </button>
                                    {gradeLevels?.map(gradeLevel => (
                                        <div key={gradeLevel._id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={gradeLevel._id}
                                                checked={selectedGradeLevels.includes(gradeLevel._id)}
                                                onChange={() => handleGradeLevelChange(gradeLevel._id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={gradeLevel._id}>{gradeLevel.gradeLevel}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {renderInput('amount', 'Fee Amount', amount, setAmount, 'number')}
                        {showStrand && renderSelect("strand", "Strand", strandId, setStrandId, strands, "Select Strand")}
                        {renderInput('nationality', 'Nationality', nationality, setNationality, 'text',true)}                    
                    </div>
                </section>

                <button className="bg-green-600 text-white text-sm p-3 mt-5 rounded-md hover:bg-green-700 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(-1)} className="bg-red-600 ml-2 text-white text-sm p-3 mt-5 rounded-md hover:bg-red-700 transition duration-300">
                    Cancel
                </button>
            </form>
            <ToastContainer />
        </main>
    );
};

const renderSelect = (id, label, value, onChange, options, placeholder,required = false) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        >
            <option value="" hidden>{placeholder}</option>
            {options?.map(option => (
                <option key={option._id} value={option._id}>{option[Object.keys(option)[1]]}</option>
            ))}
        </select>
    </div>
);

const renderInput = (id, label, value, onChange, type, disabled = false, fullSpan = false) => (
    <div className={`flex flex-col ${fullSpan ? "col-span-full sm:col-span-2 md:col-span-3" : ""}`}>
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <input
            className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
            type={type}
            id={id}
            value={value}
            onChange={type === "date" ? onChange : (e) => onChange(e.target.value)}
            disabled={disabled}
            required={!disabled}
        />
    </div>
);

export default NewManageFee;
