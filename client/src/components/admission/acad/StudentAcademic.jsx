import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAcademic = ({ id }) => {
    const { records: student } = useFetch(`${baseUrl()}/student/${id}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    // const { records: departments } = useFetch(`${baseUrl()}/departments`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { records: academic } = useFetch(`${baseUrl()}/academics`);

    const [gradeLevel, setGradeLevel] = useState('');
    const [strand, setStrand] = useState('');
    const [session, setSession] = useState('');
    const [lastSchool, setLastSchool] = useState('');

    const [grade11Id, setGrade11Id] = useState('');
    const [grade12Id, setGrade12Id] = useState('');

    useEffect(() => {
        if (student) {
            setGradeLevel(student?.academicId?.gradeLevelId?._id);
            setStrand(student?.academicId?.strandId?._id);
            setSession(student?.academicId?.sessionId?._id);
            setLastSchool(student?.academicId?.lastSchoolAttended);
        }
    }, [student]);

    useEffect(() => {
        if (gradeLevels && gradeLevels.length > 0) {
            const grade11 = gradeLevels.find(gl => gl.gradeLevel === 'Grade 11');
            const grade12 = gradeLevels.find(gl => gl.gradeLevel === 'Grade 12');
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
            studentId: id
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
                        <span className="p-2 rounded-md outline-none border border-gray-400 bg-gray-100">{student?.studentNo}</span>
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
                        <label className="font-semibold" htmlFor="session">Session</label>
                        <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setSession(e.target.value)}>
                            <option hidden>{student?.academicId?.sessionId ? `${student?.academicId?.sessionId?.startYear.split('-')[0]}-${student?.academicId?.sessionId?.endYear.split('-')[0]}` : 'Not Assigned'}</option>
                            {schoolYears?.map(schoolYear => (
                                <option key={schoolYear._id} value={schoolYear._id}>{schoolYear.startYear.split('-')[0]}-{schoolYear.endYear.split('-')[0]}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="school last attended">School Last Attended</label>
                        <input className="p-2 rounded-md outline-none border border-gray-400" type="text" onChange={(e) => setLastSchool(e.target.value)} value={lastSchool ? lastSchool : ''} />
                    </div>
                </div>

                <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md w-1/4">Submit</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default StudentAcademic;
