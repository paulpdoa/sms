import { baseUrl } from "../../../baseUrl";
import { useFetch } from "../../../hooks/useFetch";
import { MainContext } from '../../../helpers/MainContext';
import { useContext } from 'react';

const StudentParent = () => {

    const { currStudRec } = useContext(MainContext);
    const id = currStudRec._id;

    const { records: parent } = useFetch(`${baseUrl()}/student/parent/${id}`);

    if(parent) {
        return (
            <div className="mt-3 p-6 bg-white shadow-md rounded-md overflow-hidden">
                { renderInformation('Mother',parent.motherName,parent.motherOccupation,parent.motherOffice,parent.motherContact,parent.motherEmail) }
                { renderInformation('Father',parent.fatherName,parent.fatherOccupation,parent.fatherOffice,parent.fatherContact,parent.fatherEmail) }
                { renderInformation('Guardian',parent.guardianName,parent.guardianOccupation,parent.guardianOffice,parent.guardianContact,parent.guardianEmail) }
            </div>
        )
    }

    return (
        <h1 className="mt-3 text-sm text-red-500">No parent records yet</h1>
    )
}

const renderInformation = (label,name,occupation,office,contact,email) => (
        <>
        <h2 className="text-xl text-gray-700 font-bold mt-3">{label}'s Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700">Name:</label>
                <span className="text-sm truncate">{name ? name : 'Not Assigned'}</span>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700">Occupation:</label>
                <span className="text-sm truncate">{occupation ? occupation : 'Not Assigned'}</span>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700">Office:</label>
                <span className="text-sm truncate">{office ? office : 'Not Assigned'}</span>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700">Contact:</label>
                <span className="text-sm truncate">{contact ? contact : 'Not Assigned'}</span>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700">Email:</label>
                <span className="text-sm truncate">{email ? email : 'Not Assigned'}</span>
            </div>
        </div>
        </>
)


export default StudentParent;