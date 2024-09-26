import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext } from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';
import Dropdown from "react-dropdown-select";

const NewManageFee = () => {

    const { records: feeCodes } = useFetch(`${baseUrl()}/fee-codes`);
    const { session, currentUserId, genericPath,snackbarKey } = useContext(MainContext);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${session}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const [feeDescription, setFeeDescription] = useState('');
    const [selectedGradeLevels, setSelectedGradeLevels] = useState([]);
    const [showGradeLevels, setShowGradeLevels] = useState(false);
    const [amount, setAmount] = useState(0);
    const [strandId, setStrandId] = useState([]);
    const [nationality, setNationality] = useState([]);
    const [showStrand, setShowStrand] = useState(false);
    const [nationalityOptions] = useState([
        { label: 'Foreigner', value: 'Foreigner' },
        { label: 'Local', value: 'Local' }
    ]);

    const [errors,setErrors] = useState({ amount: '', nationality: '', feeDescription: '', gradeLevel: '' });

    // This will check if the tuition fee is selected
    const isTuitionFee = feeCodes?.filter(feeCode => feeCode._id === feeDescription && feeCode.description === 'Tuition Fee').length > 0 ? true : false;

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
            // nationality,
            inputter: currentUserId
        };

        if(!isTuitionFee) {
            feeInformation.nationality = ['Foreigner', 'Local'] // Define here the nationality for both if Tuition fee is not selected
        } else {
            feeInformation.nationality = nationality // Set the selected in the nationality if Tuition Fee is selected
        }

        console.log(feeInformation);

        if(amount === 0) {
            enqueueSnackbar("Error adding fee. amount cannot be zero", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
            return;
        }
      
        if(selectedGradeLevels.length < 1) {
            enqueueSnackbar("Error adding fee. grade level cannot be empty", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
            return;
        }
        const loading = snackbarKey('Please wait while creating some fees');

        try {
            const { data } = await axios.post(`${baseUrl()}/manage-fee`, feeInformation);
            closeSnackbar(loading)
            enqueueSnackbar(data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    navigate(`/${genericPath}/manage-fees`)
                }
            });
        } catch (err) {
            console.log(err);
            closeSnackbar(loading);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while creating fee', {
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
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Add New Fees</h1>

                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                        {/* <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1" htmlFor="sy">S.Y</label>
                            {schoolYear &&
                                <span className="outline-none p-2 rounded-md border border-gray-300 bg-gray-200 focus:border-blue-500 w-fit">
                                    {schoolYear.startYear?.split('-')[0]}-{schoolYear.endYear?.split('-')[0]}
                                </span>
                            }
                        </div> */}
                        {renderSelect("feeDescription", "Fee Description", feeDescription, setFeeDescription, feeCodes, "Fee Description",true)}

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Grade Level</label>
                            <Dropdown
                                className="w-full outline-none p-2 rounded-md border border-gray-300 focus:ring-customView focus:ring-2 bg-white"
                                options={gradeLevels || []}  // Ensure gradeLevels is defined or provide an empty array
                                onChange={(selectedItems) => {
                                    const ids = selectedItems.map(item => item._id);  // Extract only the IDs
                                    setSelectedGradeLevels(ids);  // Store the array of IDs
                                }}
                                values={gradeLevels?.filter(gradeLevel => selectedGradeLevels.includes(gradeLevel._id))}  // Match selected objects based on IDs
                                multi={true}  // Allow multi-select
                                labelField="gradeLevel"  // Ensure the labelField is correct (adjust as needed)
                                valueField="_id"  // Ensure the valueField matches your data structure
                                placeholder="Select Grade Levels"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {renderInput('amount', 'Fee Amount', amount, setAmount, 'number')}
                            {showStrand && (
                                // renderSelect("strand", "Strand", strandId, setStrandId, strands, "Select Strand")
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Strand</label>
                                    <Dropdown
                                        className="w-full outline-none p-2 rounded-md border border-gray-300 focus:ring-customView focus:ring-2 bg-white"
                                        options={strands || []}  // Ensure strands is an array or empty array
                                        multi={true}  // Allow multi-selection
                                        onChange={(selectedItems) => {
                                            const ids = selectedItems.map(item => item._id);  // Extract only the IDs
                                            setStrandId(ids);  // Store the array of IDs
                                        }}
                                        values={strands && strandId.length > 0 ? strands.filter(strand => strandId.includes(strand._id)) : []}  // Check if both strands and strandId exist
                                        labelField="strand"  // Define the correct label field based on your data
                                        valueField="_id"  // Define the correct value field based on your data
                                        placeholder="Select Strands"
                                    />
                                </div>
                            )}
                            { isTuitionFee && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Nationality</label>
                                <Dropdown
                                    className="w-full outline-none p-2 rounded-md border border-gray-300 focus:ring-customView focus:ring-2 bg-white"
                                    options={nationalityOptions}  // Properly structured nationality options
                                    multi={true}  // Allow multi-selection
                                    onChange={(selectedItems) => {
                                        const selectedNatl = selectedItems.map(item => item.value);  // Extract the values (Foreigner, Local)
                                        setNationality(selectedNatl);  // Store the array of selected values
                                    }}
                                    values={nationalityOptions.filter(option => nationality.includes(option.value))}  // Match the selected objects based on values
                                    labelField="label"  // Define the correct label field (the displayed value)
                                    valueField="value"  // Define the correct value field
                                    placeholder="Select Nationality"
                                />
                                { !nationality && <span>{}</span> }
                            </div>
                        ) }
                        </div>

                        {/* Nationality must be shown if Tuition Fee is selected, else the fee must be for both local and foreign */}
                        
                        {/* {renderInput('nationality', 'Nationality', nationality, setNationality, 'text')}                     */}
                    </div>
                </section>

                <button className="bg-customView text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300">
                    Submit
                </button>
                <button type="button" onClick={() => navigate(`/${genericPath}/manage-fees`)} className="bg-customCancel ml-2 text-white text-sm p-3 mt-5 rounded-md hover:bg-red-600 transition duration-300">
                    Cancel
                </button>
            </form>
        </main>
    );
};

const renderSelect = (id, label, value, onChange, options, placeholder,required = false) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className="outline-none p-2 rounded-md border border-gray-300 focus:ring-customView focus:ring-2"
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
            className="outline-none p-2 rounded-md border border-gray-300 focus:ring-customView focus:ring-2"
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


{/* <span
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
            className="text-gray-700 text-sm p-2 mb-2 rounded-md hover:underline transition duration-300"
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
)} */}