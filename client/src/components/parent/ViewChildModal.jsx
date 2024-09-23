const ViewChildModal = ({ addedChildren, onClose, setAddedChildren }) => {

    const handleRemoveChild = (id) => {
        setAddedChildren((prev) => prev.filter(child => child._id !== id))
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[50%] relative p-8 shadow-lg overflow-y-auto h-auto min-h-fit">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-semibold text-gray-800">Children List</h1>
                        <p className="text-gray-500 text-sm">
                            Below are the children associated with the parent being added.
                        </p>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="bg-customCancel text-white p-2 rounded-md shadow-md hover:bg-red-600 transition-all text-sm"
                    >
                        Close
                    </button>
                </div>

                {/* Children List Section */}
                <div className="space-y-4">
                    {addedChildren.length > 0 ? (
                        addedChildren.map((child) => (
                            <div
                                key={child._id}
                                className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                            >
                                <h2 className="text-lg font-semibold text-gray-700">
                                    {`${child.lastName}, ${child.firstName} ${child.middleName}`}
                                </h2>
                                <button
                                    onClick={() => handleRemoveChild(child._id)}
                                    className="text-sm bg-customCancel hover:bg-red-600 text-white rounded-md p-1"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No children added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewChildModal