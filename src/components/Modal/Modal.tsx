import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import * as React from 'react';

interface ModalProps {
    children?: React.ReactNode;
    onClose: (value: boolean) => void;
    open?: boolean;
    title: string;
}

interface SectionProps {
    children?: React.ReactNode;
}

interface FooterProps {
    children?: React.ReactNode;
}

const Modal = (props: ModalProps) => {
    const {
        children,
        onClose,
        open = false,
        title,
    } = props;

    return (
        <Transition.Root show={open} as={React.Fragment}>
            <Dialog
                as="div"
                onClose={onClose}
                className="fixed inset-0 z-40 overflow-y-auto"
            >
                <div className="min-h-screen text-center">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50" />
                    </Transition.Child>
                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="relative inline-block w-full max-w-md bg-white rounded-xl shadow-2xl text-left align-middle">
                            <div className="p-6">
                                <Dialog.Title as="h2" className="pb-6 text-base font-bold leading-8 text-gray-800">
                                    {title}
                                </Dialog.Title>
                                {children}
                            </div>
                            <button
                                onClick={() => onClose(false)}
                                className="absolute top-6 right-5 flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring focus:ring-gray-300 transition"
                                aria-label="Close"
                            >
                                <XIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

const Section = ({ children }: SectionProps): JSX.Element => (
    <div className="pb-6 text-gray-700">
        {children}
    </div>
);

const Footer = ({ children }: FooterProps): JSX.Element => (
    <div className="flex flex-row-reverse gap-2">
        {children}
    </div>
);

Modal.Section = Section;
Modal.Footer = Footer;

export default Modal;
