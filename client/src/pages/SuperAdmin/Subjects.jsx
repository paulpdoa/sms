import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState, useContext } from 'react';
import MasterTable from "../../components/MasterTable";
import { MainContext } from '../../helpers/MainContext';
import TabActions from '../../components/TabActions';
import MasterDataForm from "../../components/MasterDataForm";

const Subjects = () => {

    const form = () => (
        <>
        <h1 className="font-semibold text-xl text-gray-700">Add New Requirement</h1>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="requirement">Requirement</label>
            <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setRequirement(e.target.value)} />
        </div>

        <div className="flex flex-col mt-1">
            <label className="text-sm" htmlFor="isRequired">Required</label>
            <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setIsRequired(e.target.value)}>
                <option hidden>Choose if strongly required</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
        </div>
        </>
    )

    return (
        <main className="p-2 relative">
            <TabActions title="Subjects" />
            <div className={`gap-2 mt-5`}>
                { showForm && MasterDataForm(form,addRequirement,setShowForm) }

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onUpdate={updateNewRequirement}
                        onDelete={deleteRequirement}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Subjects;