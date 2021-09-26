import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XIcon } from '@heroicons/react/solid';
import * as React from 'react';
import { toast as toastify, ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = (): JSX.Element => (
    <ToastifyContainer
        autoClose={4000}
        bodyClassName={() => 'flex p-3 text-base font-medium text-white'}
        closeButton={({ closeToast }) => (
            <div className="flex items-center flex-shrink-0 ml-2 mr-1">
                <button
                    className="p-0.5 text-gray-300 hover:text-white"
                    onClick={closeToast}
                    aria-label="Dismiss"
                >
                    <XIcon className="h-6 w-6" />
                </button>
            </div>
        )}
        className={(o) => `${o?.defaultClassName} w-full max-w-full sm:max-w-xs`}
        closeOnClick={false}
        draggable={false}
        hideProgressBar
        icon={false}
        pauseOnHover={false}
        position="bottom-center"
        toastClassName={() => 'relative flex items-center justify-between overflow-hidden px-1.5 py-0.5 border rounded-xl bg-gray-800 shadow-lg'}
    />
);

const toast = (message: string) => {
    toastify(message, {
        icon: <InformationCircleIcon className="flex-shrink-0 h-6 w-6 -ml-1 rounded-full text-blue-400" />
    });
};

toast.error = (message: string) => {
    toastify.error(message, {
        icon: <ExclamationCircleIcon className="flex-shrink-0 h-6 w-6 -ml-1 rounded-full text-red-500" />
    });
};

toast.success = (message: string) => {
    toastify.success(message, {
        icon: <CheckCircleIcon className="flex-shrink-0 h-6 w-6 -ml-1 rounded-full text-green-400" />
    });
};

export default ToastContainer;
export { toast };
