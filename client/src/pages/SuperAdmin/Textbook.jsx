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

const Textbook = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/textbooks`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);

    const { role,currentUserId,setSearchQuery,searchQuery,session } = useContext(MainContext);

    const [schoolYear,setSchoolYear] = useState(session);
    const [bookCode,setBookCode] = useState('');
    const [bookTitle,setBookTitle] = useState('');
    const [bookAmount,setBookAmount] = useState('');
    const [gradeLevel,setGradeLevel] = useState('');
    const [strand,setStrand] = useState('');

    const columns = [
        {
            accessorKey: 'schoolYear.schoolYear',
            header: 'School Year',
        },
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
  
    const updateNewTextbook = async (id,updatedData) => {

        const newBookInfo = { 
            newBookCode: updatedData.bookCode,
            newBookTitle:updatedData.bookTitle,
            newBookAmount:updatedData.bookAmount,
            newGradeLevel: updatedData.gradeLevel._id,
            newStrand:updatedData.strand._id,
            newInputter: currentUserId,
            newSchoolYear: updatedData.schoolYear._id,
            session: session,
            role
        }

        try {
            const newData = await axios.patch(`${baseUrl()}/textbook/${id}`,newBookInfo);
            toast.success(newData.data.mssg, {
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

            setTimeout(() => {
                window.location.reload();
            },2000)
        }
    }


    const deleteTextbook = async (id) => {
        try {
            const removeTextbook = await axios.put(`${baseUrl()}/textbook/${id}`,{ data: { role } });
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

    const addTextbook = async (e) => {
        e.preventDefault();

        const bookInfo = {
            schoolYear,
            bookCode,
            bookTitle,
            bookAmount,
            gradeLevel,
            strand,
            inputter: localStorage.getItem('id'),
            session: schoolYear,
            role
        }
        try {
            const newtextbook = await axios.post(`${baseUrl()}/textbook`,bookInfo);
            toast.success(newtextbook.data.mssg, {
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
            strand: record?.strand?.strand,
            _id: record?.strand?._id
        },
        schoolYear: {
            schoolYear: `${ record?.schoolYear.startYear?.split('-')[0]}-${record?.schoolYear.endYear?.split('-')[0]}`,
            _id: record?.schoolYear?._id
        }
    }));

    return (
        <main className="p-2">
            {/* <DateTime /> */}
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Text book</h1>
                <Searchbar onSearch={setSearchQuery} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <form onSubmit={addTextbook} className="p-4 col-span-1 h-fit rounded-lg border border-gray-300">
                    <h1 className="font-semibold text-xl text-green-500">Add New Text book</h1>

                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="session">Session</label>
                        { schoolYears?.filter(sy => sy._id === localStorage.getItem('session')).map(sy => (
                            <input key={sy._id} disabled className="outline-none p-1 rounded-md border border-gray-300" type="text" defaultValue={`${sy.startYear.split('-')[0]}-${sy.endYear.split('-')[0]}`} />
                        )) }
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="grade level">Grade Level</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setGradeLevel(e.target.value)}>
                            <option hidden>Select grade level</option>
                            { gradeLevels?.map(gradeLevel => (
                                <option key={gradeLevel._id} value={gradeLevel._id}>{gradeLevel.gradeLevel}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="strand">Strand</label>
                        <select className="outline-none p-1 rounded-md border border-gray-300" onChange={(e) => setStrand(e.target.value)}>
                            <option hidden>Select strand</option>
                            { strands?.map(strand => (
                                <option key={strand._id} value={strand._id}>{strand.strand}</option>
                            )) }
                        </select>
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="book code">Book Code</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setBookCode(e.target.value)} />
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="title">Title</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="text" onChange={(e) => setBookTitle(e.target.value)} />
                    </div>
                    <div className="flex flex-col mt-1">
                        <label className="text-sm" htmlFor="amount">Amount</label>
                        <input className="outline-none p-1 rounded-md border border-gray-300" type="number" onChange={(e) => setBookAmount(e.target.value)} />
                    </div>

                    <button className="bg-green-500 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
                </form>

                <div className="relative col-span-2 overflow-x-auto sm:rounded-lg h-fit">
                    <MasterTable 
                        columns={columns}
                        data={recordsWithoutInputter}
                        searchQuery={searchQuery}
                        onDelete={deleteTextbook}
                        onUpdate={updateNewTextbook}
                    />
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Textbook;