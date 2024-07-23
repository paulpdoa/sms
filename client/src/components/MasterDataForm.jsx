

const MasterDataForm = (form,onAdd,onClose) => (
    <div className="absolute w-full top-0 z-50 left-0 flex justify-center">
        <form onSubmit={onAdd} className="p-4 col-span-1 h-fit rounded-lg border my-10  border-gray-300 bg-gray-100 w-1/2">
            { form() }
            <button className="bg-blue-500 hover:bg-blue-600 text-gray-100 text-sm p-2 mt-5 rounded-md">Submit</button>
            <button type="button" onClick={() => onClose(false)} className="bg-red-500 hover:bg-red-600 ml-2 text-gray-100 text-sm p-2 mt-5 rounded-md">Cancel</button>
        </form>
    </div>
)

export default MasterDataForm