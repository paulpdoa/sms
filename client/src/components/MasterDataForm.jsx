
const MasterDataForm = (form, onAdd, onClose,formTitle) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-full max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg">
      <form onSubmit={onAdd} className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{formTitle}</h2>
          <p className="text-gray-600">Please fill out the form below</p>
        </div>
        {form()}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default MasterDataForm;
