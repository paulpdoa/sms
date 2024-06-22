import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAcademic = ({ id }) => {

    const { records: student } = useFetch(`${baseUrl()}/student/${id}`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: departments } = useFetch(`${baseUrl()}/departments`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const { records: academic } = useFetch(`${baseUrl()}/academics`);

    const [gradeLevel,setGradeLevel] = useState('');
    const [department,setDepartment] = useState('');
    const [strand,setStrand] = useState('');
    const [session,setSession] = useState('');
    const [lastSchool,setLastSchool] = useState('');

    const addAcademic = async (e) => {
        e.preventDefault();

        const academicInfo = {
            gradeLevelId: gradeLevel,
            departmentId: department,
            strandId: strand,
            sessionId: session,
            lastSchoolAttended: lastSchool,
            studentId: id
        }

        try {
            const data = await axios.post(`${baseUrl()}/academic`,{ academicInfo });
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
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="mt-3 text-sm">
            <form onSubmit={addAcademic} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="grade level">Grade Level</label>
                    <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setGradeLevel(e.target.value)}>
                        <option hidden>{student?.gradeLevel?.gradeLevel ? student?.gradeLevel?.gradeLevel : 'Not Assigned' }</option>
                        { gradeLevels?.map(gradeLevel => (
                            <option key={gradeLevel._id} value={gradeLevel._id}>{ gradeLevel.gradeLevel }</option>
                        )) } 
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="department">Department</label>
                    <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setDepartment(e.target.value)}>
                        <option hidden>{student?.department?.department ? student?.department?.department : 'Not Assigned' }</option>
                        { departments?.map(department => (
                            <option key={department._id} value={department._id}>{ department.department }</option>
                        )) } 
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="strand">Strand</label>
                    <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setStrand(e.target.value)}>
                        <option hidden>{ academic.strandId?.strand ? academic.strandId?.strand : 'Not Assigned' }</option>
                        { strands?.map(strand => (
                            <option key={strand._id} value={strand._id}>{ strand.strand }</option>
                        )) } 
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="session">Session</label>
                    <select className="p-2 rounded-md outline-none border border-gray-400" onChange={(e) => setSession(e.target.value)}>
                        <option hidden>{academic.sessionId ? `${academic.sessionId?.startYear.split('-')[0]}-${academic.sessionId?.endYear.split('-')[0]}` : 'Not Assigned' }</option>
                        { schoolYears?.map(schoolYear => (
                            <option key={schoolYear._id} value={schoolYear._id}>{ schoolYear.startYear.split('-')[0] }-{ schoolYear.endYear.split('-')[0] }</option>
                        )) } 
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold" htmlFor="school last attended">School Last Attended</label>
                    <input className="p-2 rounded-md outline-none border border-gray-400" type="text" onChange={(e) => setLastSchool(e.target.value)} />
                </div>

                <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md w-1/4">Submit</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default StudentAcademic;