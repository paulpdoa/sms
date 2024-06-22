import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";

const StudentParent = ({ id }) => {

    const { records: parent } = useFetch(`${baseUrl()}/student/parent/${id}`);

    if(parent) {
        return (
            <div className="mt-3">  
                <div className="flex flex-col text-sm">
                    <div className="p-2 flex flex-col border-b-2 border-gray-300 rounded-md">
                        <p className="font-semibold">Mother Name: <span className="font-normal">{parent?.motherName}</span></p>
                        <p className="font-semibold">Company: <span className="font-normal">{parent?.motherOffice}</span></p>
                        <p className="font-semibold">Mobile No: <span className="font-normal">{parent?.motherContact}</span></p>
                        <p className="font-semibold">Occupation: <span className="font-normal">{parent?.motherOccupation}</span></p>
                        <p className="font-semibold">Email: <span className="font-normal">{parent?.motherEmail}</span></p>
                    </div>
    
                    <div className="p-2 flex flex-col border-b-2 border-gray-300 rounded-md">
                        <p className="font-semibold">Father Name: <span className="font-normal">{parent?.fatherName}</span></p>
                        <p className="font-semibold">Company: <span className="font-normal">{parent?.fatherOffice}</span></p>
                        <p className="font-semibold">Mobile No: <span className="font-normal">{parent?.fatherContact}</span></p>
                        <p className="font-semibold">Occupation: <span className="font-normal">{parent?.fatherOccupation}</span></p>
                        <p className="font-semibold">Email: <span className="font-normal">{parent?.fatherEmail}</span></p>
                    </div>
    
                    <div className="p-2 flex flex-col border-b-2 border-gray-300 rounded-md">
                        <p className="font-semibold">Guardian Name: <span className="font-normal">{parent?.guardianName}</span></p>
                        <p className="font-semibold">Company: <span className="font-normal">{parent?.guardianOffice}</span></p>
                        <p className="font-semibold">Mobile No: <span className="font-normal">{parent?.guardianContact}</span></p>
                        <p className="font-semibold">Occupation: <span className="font-normal">{parent?.guardianOccupation}</span></p>
                        <p className="font-semibold">Email: <span className="font-normal">{parent?.guardianEmail}</span></p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <h1 className="mt-3 text-sm text-red-500">No parent records yet</h1>
    )
}

export default StudentParent;