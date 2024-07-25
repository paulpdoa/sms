const ConfirmationPopup = ({ onConfirm,onClose,message }) =>{

    console.log(onConfirm)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-base font-semibold mb-4">{message}</h3>
                <div className="flex justify-center space-x-4">
                <button
                    onClick={() => onConfirm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    Yes
                </button>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    No
                </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup;