import * as React from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

interface ConfirmationModalProps {
    cancelButtonText?: string;
    confirmButtonText?: string;
    destructive?: boolean;
    message: string;
    onClose: (confirmed: boolean) => void;
    open: boolean;
    title: string;
}

const ConfirmationModal = (props: ConfirmationModalProps): JSX.Element => {
    const {
        cancelButtonText = 'Cancel',
        confirmButtonText = 'Confirm',
        destructive = false,
        message,
        onClose,
        open,
        title,
    } = props;

    return (
        <Modal
            onClose={onClose}
            open={open}
            title={title}
        >
            <Modal.Section>
                <p className="text-gray-500 text-base">
                    {message}
                </p>
            </Modal.Section>
            <Modal.Footer>
                <Button destructive={destructive} onClick={() => onClose(true)}>
                    {confirmButtonText}
                </Button>
                <Button onClick={() => onClose(false)}>
                    {cancelButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
