const Table = ({ columns,records,updateDataRecord,recordId,newRecord,setNewRecord,inputter }) => {

    return (
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
                        { updateGradeLevel && (gradeLevelId === record._id) ?
                            <>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <input type="text" value={newGradeLevel} onChange={(e) => setNewGradeLevel(e.target.value)} className="outline-none p-1 rounded-md border border-gray-700 bg-gray-900" />
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium">
                                { record.inputter?.username }
                            </td>
                            </>
                            :
                            <>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                { isNaN(record.gradeLevel) ? record.gradeLevel : `Grade ${record.gradeLevel}` }
                            </th>
                            <td scope="row" className="px-6 py-4 font-medium">
                                { record.inputter?.username }
                            </td>
                            </>
                        }

                        <td className="px-6 py-4 flex gap-2 items-center">
                            { updateGradeLevel && (gradeLevelId === record._id) ? 
                            <>
                            <button onClick={() => updateNewGradeLevel(record._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                            <button onClick={() => enableEditGradeLevel(!updateGradeLevel)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Close</button>
                            </>
                            :
                            <>
                            <button onClick={() => enableEditGradeLevel(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                            <button onClick={() => deleteGradeLevel(record._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                            </>
                            }
                            
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    )
}

export default Table;