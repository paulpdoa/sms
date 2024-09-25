import { useState } from 'react';

const ConfirmationPopup = ({ onConfirm, onClose, message }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    const handleConfirm = () => {
        setIsDisabled(true);
        onConfirm(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-base font-semibold mb-4">{message}</h3>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 bg-customSubmit text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isDisabled}
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-customCancel text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
