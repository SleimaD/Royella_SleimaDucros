import React from 'react';

const Modal = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
            <div className="absolute inset-0 bg-black opacity-50 "></div>
            <div className="bg-white rounded-lg p-10 z-10 flex flex-col justify-center items-center">
                <p className='text-xl'>{message}</p>
                <button
                    className="mt-8 bg-khaki  text-white py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
