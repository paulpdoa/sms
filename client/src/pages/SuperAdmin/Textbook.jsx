import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import MasterTable from '../../components/MasterTable';
import { useNavigate } from 'react-router-dom';
import TabActions from "../../components/TabActions";
import { useSnackbar } from 'notistack';

const Textbook = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/textbooks`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);
    const navigate = useNavigate();

    const { role,currentUserId,genericPath,setSearchQuery,searchQuery,session,showError } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

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
            enqueueSnackbar(removeTextbook.data.mssg, { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch(err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg  || 'An error occurred while deleting text book records', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
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

    const goToEdit = (id) => navigate(`/${genericPath}/edit-textbook/${id}`);

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <TabActions title="Textbooks" redirect={'new-textbook'} />

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
        </main>
    )
}

export default Textbook;