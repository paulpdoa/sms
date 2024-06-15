import { baseUrl } from '../../baseUrl';
import { useFetch } from '../../hooks/useFetch';
import { useState } from 'react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubmittedReq = ({id}) => {

    const { records } = useFetch(`${baseUrl()}/requirements`);
    const { records: student } = useFetch(`${baseUrl()}/student/${id}`)
    const [requirements,setRequirements] = useState([]);
    
    const submitStudentRequirement = async () => {
        try {
            const data = await axios.put(`${baseUrl()}/submit-student-requirement/${id}`,{ requirements });
            console.log(data);
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
            },2000)
        } catch(err) {
            console.log(err.response.data.mssg);
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
    }

    // 1. show all list of requirements 
    // 2. show a checkbox where students already submitted a requirement
    // 3. loop inside students table, if student requirement is in requirements table then put a check in checkbox

    return (
        <div className="mt-3">
            { records?.map(record => (
                <div key={record._id} className="flex items-center justify-between gap-5 rounded-md border-gray-300 border-2 p-2">
                    <span className="text-sm">{record.requirement}</span>
                    <input type="checkbox" onChange={() => setRequirements([...requirements,record._id])} />
                </div>
            )) }

            <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md" onClick={submitStudentRequirement}>Submit</button>
            <ToastContainer />
        </div>
    )
}

export default SubmittedReq;