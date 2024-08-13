import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState,useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import AddTextbookBtn from "../../components/buttons/AddTextbookBtn";
import { useNavigate } from 'react-router-dom';

const Textbook = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/textbooks`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const navigate = useNavigate();

    const { role,currentUserId,setSearchQuery,searchQuery,session } = useContext(MainContext);

    const columns = [
       
        {
            accessorKey: 'bookCode',
            header: 'Book Code',
            editable: true
        },
        {
            accessorKey: 'bookTitle',
            header: 'Title',
            editable: true
        },
        {
            accessorKey: 'gradeLevel.gradeLevel',
            header: 'Grade Level',
            editable: true,
            selectOptions: gradeLevels?.map(gl => ({ value: gl._id, label: gl.gradeLevel }))
        },
        {
            accessorKey: 'strand.strand',
            header: 'Strand',
            editable: true,
            selectOptions: strands?.map(str => ({ value: str._id, label: str.strand }))
        },
        {
            accessorKey: 'bookAmount',
            header: 'Amount',
            editable: true,
            type: "number"
        }
    ]

    const deleteTextbook = async (id) => {
        try {
            const removeTextbook = await axios.put(`${baseUrl()}/textbook/${id}`,{ role,recordStatus: 'Deleted' });
            toast.success(removeTextbook.data.mssg, {
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
            console.log(err);
        }
    }


    const recordsWithoutInputter = records.map(record => ({
        ...record,
        gradeLevel: {
            _id: record?.gradeLevel?._id,
            gradeLevel:record?.gradeLevel?.gradeLevel || 'Not Assigned',
        },
        strand: {
            strand: record?.strand?.strand || 'Not Applicable',
            _id: record?.strand?._id
        }
    }));

    const goToEdit = (id) => navigate(`/edit-textbook/${id}`);

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex flex-col mx-4 my-2 gap-2">
                <h1 className="text-2xl text-gray-700 font-bold">Text book</h1>
                <div className="flex justify-between w-full gap-2">
                    <Searchbar onSearch={setSearchQuery} />
                    <AddTextbookBtn />
                </div>
            </div>

            <div className="gap-2 mt-5">
                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteTextbook}
                        // onUpdate={updateNewTextbook}
                        goToEdit={goToEdit}
                        isLoading={isLoading}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Textbook;