import DateTime from "../../components/DateTime";
import Searchbar from "../../components/Searchbar";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useState } from 'react';

const columns = [
    {
        accessorKey: 'sy',
        header: 'School Year',
    },
    {
        accessorKey: 'book code',
        header: 'Book Code',
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        header: 'Grade Level'
    },
    {
        header: 'Strand'
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'action',
        header: 'Action'
    }
]

const Textbook = () => {

    const { records, isLoading } = useFetch(`${baseUrl()}/textbooks`);
    const { records: schoolYears } = useFetch(`${baseUrl()}/school-years`);
    const { records: gradeLevels } = useFetch(`${baseUrl()}/grade-levels`);
    const { records: strands } = useFetch(`${baseUrl()}/strands`);

    
    const [updateTextbook,setUpdateTextbook] = useState(false);
    const [textbookId,setTextbookId] = useState('');

    const [newBookCode,setNewBookCode] = useState('');
    const [newBookTitle,setNewBookTitle] = useState('');
    const [newBookAmount,setNewBookAmount] = useState(0);
    const [newGradeLevel,setNewGradeLevel] = useState('');
    const [newStrand,setNewStrand] = useState('');
    const [newInputter,setNewInputter] = useState('');
    const [newSession,setNewSession] = useState('');
    const [newSchoolYear,setNewSchoolYear] = useState('');

    const [schoolYear,setSchoolYear] = useState(localStorage.getItem('session'));
    const [bookCode,setBookCode] = useState('');
    const [bookTitle,setBookTitle] = useState('');
    const [bookAmount,setBookAmount] = useState('');
    const [gradeLevel,setGradeLevel] = useState('');
    const [strand,setStrand] = useState('');
  
    const enableEditTextbook = (record) => {
        setUpdateTextbook(!updateTextbook);
        setTextbookId(record._id);
        setNewBookCode(record.bookCode);
        setNewBookTitle(record.bookTitle);
        setNewBookAmount(record.bookAmount);
        setNewGradeLevel(record?.gradeLevel?._id);
        setNewStrand(record.strand?._id);
        // Get the id of current user
        setNewInputter(localStorage.getItem('id'));
        setNewSession(record.session?._id);
        setNewSchoolYear(record.schoolYear?._id);
    }

    const updateNewTextbook = async (id) => {

        const newBookInfo = { newBookCode,newBookTitle,newBookAmount,newGradeLevel,newStrand,newInputter,newSession,newSchoolYear }

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
            const removeTextbook = await axios.put(`${baseUrl()}/textbook/${id}`);
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
            session: schoolYear
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

    return (
        <main className="p-2">
            <DateTime />
            <div className="flex justify-between mx-4 my-2 items-center">
                <h1 className="text-xl text-green-500 font-bold">Text book</h1>
                <Searchbar />
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

                <div className="relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg h-fit">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                { columns?.map((column,key) => (
                                    <th key={key} scope="col" className="px-6 py-3">
                                        { column.header }
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            { records?.map(record => (
                                <tr key={record._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    { updateTextbook && (textbookId === record._id) ?
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.schoolYear.startYear.split('-')[0] }-{record.schoolYear.endYear.split('-')[0]} 
                                        </th>
                                        <td className="px-6 py-4 font-medium text-gray-400">
                                            <input value={newBookCode} onChange={(e) => setNewBookCode(e.target.value)} type="text" className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-400">
                                            <input value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} type="text" className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewGradeLevel(e.target.value)}>
                                                <option hidden>{record.gradeLevel?.gradeLevel ?? 'Select Grade Level'}</option>
                                                { gradeLevels?.map(gradeLevel => (
                                                    <option key={gradeLevel._id} value={gradeLevel._id}>{ gradeLevel.gradeLevel }</option>
                                                )) }
                                            </select>
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <select className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" onChange={(e) => setNewStrand(e.target.value)}>
                                                <option hidden>{record.strand.strand}</option>
                                                { strands?.map(strand => (
                                                    <option key={strand._id} value={strand._id}>{ strand.strand }</option>
                                                )) }
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-400">
                                            <input value={newBookAmount} onChange={(e) => setNewBookAmount(e.target.value)} type="text" className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                                        </td>

                                        </>
                                        :
                                        <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { record.schoolYear.startYear.split('-')[0] }-{record.schoolYear.endYear.split('-')[0]} 
                                        </th>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-400">
                                            { record.bookCode } 
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-400">
                                            { record.bookTitle } 
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-400">
                                            { record.gradeLevel?.gradeLevel ?? 'Not Assigned' } 
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-400">
                                            { record.strand?.strand ? record.strand?.strand : 'Not Assigned' } 
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-400">
                                            { record.bookAmount } 
                                        </td>
                                        </>
                                    }
                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        { updateTextbook && (textbookId === record._id) ? 
                                        <>
                                        <button onClick={() => updateNewTextbook(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                                        <button onClick={() => enableEditTextbook(!updateTextbook)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                                        </>
                                        :
                                        <>
                                        <button onClick={() => enableEditTextbook(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteTextbook(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </>
                                        }
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>    
            </div> 
            <ToastContainer />          
        </main>
    )
}

export default Textbook;