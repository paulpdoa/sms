import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext, useState } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const TeacherDashboard = () => {


    const { session,currentUserId } = useContext(MainContext);
    const { records } = useFetch(`${baseUrl()}/teacher-dashboard/${currentUserId}`);
    
    console.log(records);

    return (
        <main>
        
        </main>
    )
}

export default TeacherDashboard;