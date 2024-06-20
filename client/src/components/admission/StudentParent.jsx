import { baseUrl } from "../../baseUrl";
import { useFetch } from "../../hooks/useFetch";

const StudentParent = ({ id }) => {

    const { records: parents } = useFetch(`${baseUrl()}/parents`);

    return (
        <div>
            { parents?.filter(parent => parent.studentId?._id === id).map(parent => (
                <div key={parent._id} className="flex flex-col text-sm text-gray-600">
                    <span className="rounded-md border-b-2 border-gray-300 p-2">Mother Name: {parent.motherName}</span>
                    <span className="rounded-md border-b-2 border-gray-300 p-2">Father Name: {parent.fatherName}</span>
                    <span className="rounded-md border-b-2 border-gray-300 p-2">Guardian Name: {parent.guardianName}</span>
                </div>
            )) }
        </div>
    )
}

export default StudentParent;