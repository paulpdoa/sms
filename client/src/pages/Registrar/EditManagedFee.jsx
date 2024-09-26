import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { MainContext} from '../../helpers/MainContext';
import { useSnackbar } from 'notistack';

const EditManageFee = () => {
    const { id } = useParams();
    const { session:sessionId,currentUserId,genericPath } = useContext(MainContext);
    const { records: feeCodes } = useFetch(`${baseUrl()}/fee-codes`);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${sessionId}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { records: nationalityCodes } = useFetch(`${baseUrl()}/nationality-codes`);
    const { records: manageFee } = useFetch(`${baseUrl()}/manage-fee/${id}`);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [feeDescription, setFeeDescription] = useState('');
    const [showGradeLevels, setShowGradeLevels] = useState(false);
    const [gradeLevelId,setGradeLevelId] = useState('');
    const [amount, setAmount] = useState('');
    const [strandId, setStrandId] = useState('');
    const [nationality, setNationality] = useState('');
    const [showStrand, setShowStrand] = useState(false);

    useEffect(() => {   
        if (manageFee) {
            setFeeDescription(manageFee?.feeDescription?._id || undefined);
            setGradeLevelId(manageFee?.gradeLevelId?._id || undefined);
            setAmount(manageFee?.amount || '');
            setStrandId(manageFee?.strandId?._id || undefined);
            setNationality(manageFee?.nationality || undefined);
        }
    }, [manageFee]);

    const editManagedFees = async (e) => {
        e.preventDefault();

        const feeInformation = {
            sessionId: sessionId,
            feeDescription,
            gradeLevelId,
            strandId,
            amount,
            nationality,
            inputter: currentUserId
        };

        setIsLoading(true);
       
        try {
            const { data } = await axios.patch(`${baseUrl()}/manage-fee/${id}`, feeInformation);
            setIsLoading(false);
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
            setIsLoading(false);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while updating managed fee', {
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
        <main className="p-8 bg-gray-100 flex items-center justify-center">
            <form onSubmit={editManagedFees} className="space-y-8 bg-white p-10 rounded-md shadow-lg w-full max-w-3xl">
                <h1 className="font-bold text-start text-gray-700 text-3xl mb-6">Edit Fee</h1>

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
                                className="outline-none p-2 rounded-md border border-gray-300 bg-gray-200"
                            >
                                { manageFee?.gradeLevelId ? manageFee?.gradeLevelId?.gradeLevel : (showGradeLevels ? 'Hide Grade Levels' : 'Show Grade Levels')  }
                            </span>
                        </div>
                        {renderInput('amount', 'Fee Amount', amount, setAmount, 'number')}
                        {showStrand && renderSelect("strand", "Strand", strandId, setStrandId, strands, "Select Strand")}
                        {renderInput('nationality', 'Nationality', nationality, setNationality, 'text',true)}                    
                    </div>
                </section>

                <button className="bg-customView text-white text-sm p-3 mt-5 rounded-md hover:bg-blue-600 transition duration-300" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
                <button type="button" onClick={() => navigate(`/${genericPath}/manage-fees`)} className="ml-2 bg-customCancel text-white text-sm p-3 mt-5 rounded-md hover:bg-red-600 transition duration-300" disabled={isLoading}>
                    Cancel
                </button>
            </form>
        </main>
    );
};

const renderSelect = (id, label, value, onChange, options, placeholder,disabled = false) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" htmlFor={id}>{label}</label>
        <select
            className="outline-none p-2 rounded-md border border-gray-300 focus:border-green-500"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
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

export default EditManageFee;
