import { baseUrl } from "../../baseUrl";
import { useFetch } from "../../hooks/useFetch";

const StudentInfo = ({ id }) => {

    const { records: student } = useFetch(`${baseUrl()}/student/${id}`);

    if(!student.isAdmitted) {
        return (
            <div className="mt-3">
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="lastname">Last Name:</label>
                    <span className="text-sm">{ student.lastName }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="firstname">First Name:</label>
                    <span className="text-sm">{ student.firstName }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="middlename">Middle Name:</label>
                    <span className="text-sm">{ student.middleName }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="gender">Gender:</label>
                    <span className="text-sm">{ student.sex?.gender ? student.sex?.gender : 'Not Assigned' }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="date of birth">Date Of Birth:</label>
                    <span className="text-sm">{ student.dateOfBirth?.replace(/-/g,'/') }</span>
                </div>
            
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="place of birth">Place of birth:</label>
                    <span className="text-sm">{ student.placeOfBirth }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="address">Address:</label>
                    <span className="text-sm">{ student.address }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="nationality">Nationality:</label>
                    <span className="text-sm">{ student.nationality?.nationality ? student.nationality?.nationality : 'Not Assigned' }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="religion">Religion:</label>
                    <span className="text-sm">{ student.religion?.religion ? student.religion?.religion : 'Not Assigned' }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="contact">Contact:</label>
                    <span className="text-sm">+63{ student.contactNumber }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="email">Email:</label>
                    <span className="text-sm">{ student.email }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="status">Status:</label>
                    <span className="text-sm">{ student.status ? student.status : 'Not Assigned' }</span>
                </div>
                <div className="flex gap-2">
                    <label className="font-semibold text-sm" htmlFor="lrn">LRN:</label>
                    <span className="text-sm">{ student.lrn ? student.lrn : 'Not Assigned' }</span>
                </div>

                
            </div>
        )
        
    }

    return (
        <h1 className="mt-3 text-sm text-red-500">{ student.firstName } { student.lastName } is still not admitted yet, please complete requirements first.</h1>
    )

    
}

export default StudentInfo;