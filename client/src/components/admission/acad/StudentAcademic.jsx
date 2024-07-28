import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainContext } from '../../../helpers/MainContext';

const StudentAcademic = () => {
    
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    // const { records: departments } = useFetch(`${baseUrl()}/departments`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { records: academic } = useFetch(`${baseUrl()}/academics`);
    const { records: paymentTerms } = useFetch(`${baseUrl()}/payment-terms`);
    
    const { session: syId,currStudRec } = useContext(MainContext);
    const id = currStudRec._id;
    const { records: student } = useFetch(`${baseUrl()}/student/${id}`);

    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${syId}`);
    const isYearDone = schoolYear.isYearDone ? true : false;

    const [gradeLevel, setGradeLevel] = useState('');
    const [strand, setStrand] = useState('');
    const [session, setSession] = useState('');
    const [lastSchool, setLastSchool] = useState('');
    const [paymentTermId,setPaymentTermId] = useState('');

    const [grade11Id, setGrade11Id] = useState('');
    const [grade12Id, setGrade12Id] = useState('');

    useEffect(() => {
        if (student) {
            setGradeLevel(student?.academicId?.gradeLevelId?._id);
            setStrand(student?.academicId?.strandId?._id);
            setSession(student?.academicId?.sessionId?._id);
            setLastSchool(student?.academicId?.lastSchoolAttended);
            setPaymentTermId(student?.academicId?.paymentTermId?._id);
        }
    }, [student]);

    useEffect(() => {
        if (gradeLevels && gradeLevels.length > 0) {
            const grade11 = gradeLevels.find(gl => gl.gradeLevel.toLowerCase() === 'grade 11');
            const grade12 = gradeLevels.find(gl => gl.gradeLevel.toLowerCase() === 'grade 12');
            setGrade11Id(grade11?._id || '');
            setGrade12Id(grade12?._id || '');
        }
    }, [gradeLevels]);

    const handleGradeLevelChange = (e) => {
        const selectedGradeLevel = e.target.value;
        setGradeLevel(selectedGradeLevel);


        if (selectedGradeLevel !== grade11Id && selectedGradeLevel !== grade12Id) {
            setStrand('');
        }
    };

    const addAcademic = async (e) => {
        e.preventDefault();

        const academicInfo = {
            gradeLevelId: gradeLevel,
            strandId: strand,
            sessionId: session,
            lastSchoolAttended: lastSchool,
            studentId: id,
            paymentTermId
        }


        try {
            const { data } = await axios.post(`${baseUrl()}/academic`, academicInfo);
            toast.success(data.mssg, {
                position: "top-center",
                autoClose: 1000,
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
            toast.error(err.response.data.mssg, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            console.error(err);
        }
    }

    return (
        <div className="mt-3 text-sm">
            <form onSubmit={addAcademic}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="studentNo">Student Number:</label>
                        <span className="p-2 rounded-md outline-none border border-gray-400 bg-gray-100">{student?.studentNo ?? 'No student number yet'}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="grade level">Grade Level</label>
                        <select className="p-2 rounded-md outline-none border border-gray-400" onChange={handleGradeLevelChange}>
                            <option hidden>{student?.academicId?.gradeLevelId?.gradeLevel ? student?.academicId?.gradeLevelId?.gradeLevel : 'Not Assigned'}</option>
                            {gradeLevels?.map(gradeLevel => (
                                <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                            ))}
                        </select>
                    </div>

                    {/* <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="department">Department</label>
                        <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setDepartment(e.target.value)}>
                            <option hidden>{student?.academicId?.departmentId?.department ? student?.academicId?.departmentId?.department : 'Not Assigned' }</option>
                            { departments?.map(department => (
                                <option key={department._id} value={department._id}>{ department.department }</option>
                            )) }
                        </select>
                    </div> */}

                    {(gradeLevel === grade11Id || gradeLevel === grade12Id) && (
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="strand">Strand</label>
                            <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setStrand(e.target.value)}>
                                <option hidden>{student?.academicId?.strandId?.strand ? student?.academicId?.strandId?.strand : 'Not Assigned'}</option>
                                {strands?.map(strand => (
                                    <option key={strand._id} value={strand._id}>{strand.strand}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="session">Academic Year</label>
                        <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setSession(e.target.value)}>
                            <option hidden>{student?.academicId?.sessionId ? `${student?.academicId?.sessionId?.startYear.split('-')[0]}-${student?.academicId?.sessionId?.endYear.split('-')[0]}` : 'Not Assigned'}</option>
                            {schoolYears?.map(schoolYear => (
                                <option key={schoolYear._id} value={schoolYear._id}>{schoolYear.startYear.split('-')[0]}-{schoolYear.endYear.split('-')[0]}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="payment term">Payment Term</label>
                        <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setPaymentTermId(e.target.value)}>
                            <option hidden>{ student?.academicId?.paymentTermId?.term ?? 'Not Assigned'}</option>
                            {paymentTerms?.map(paymentTerm => (
                                <option key={paymentTerm._id} value={paymentTerm._id}>{paymentTerm?.term}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="school last attended">School Last Attended</label>
                        <input className="p-2 rounded-md outline-none border border-gray-400" type="text" onChange={(e) => setLastSchool(e.target.value)} value={lastSchool ? lastSchool : ''} />
                    </div>
                </div>

                <button disabled={isYearDone} className={`${isYearDone ? 'cursor-not-allowed' : 'cursor-pointer'} bg-blue-500 hover:bg-blue-600 text-gray-100 text-sm p-2 mt-5 rounded-md w-1/4`}>Submit</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default StudentAcademic;
