import { useFetch } from "../../../hooks/useFetch";
import { baseUrl } from "../../../baseUrl";
import AdmissionTable from "../AdmissionTable";
import MasterTable from "../../MasterTable";
import { useContext } from 'react';
import { MainContext } from "../../../helpers/MainContext";

const StudentReqTable = ({ setViewRecord,formattedStudents,columns }) => {

    const { searchQuery } = useContext(MainContext);

    return (
        <MasterTable 
            columns={columns} 
            data={formattedStudents || []} 
            viewRecord={setViewRecord} 
            searchQuery={searchQuery} 
        /> 
    )
}

export default StudentReqTable;