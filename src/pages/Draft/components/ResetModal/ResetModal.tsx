import * as React from 'react';
import Button from '../../../../components/Button/Button';
import Modal from '../../../../components/Modal/Modal';

interface ResetModalProps {
    onClose: (resetConfirmed: boolean) => void;
    open: boolean;
}

const ResetModal = ({ onClose, open }: ResetModalProps): JSX.Element => (
    <Modal
        onClose={onClose}
        open={open}
        title="Reset draft?"
    >
        <Modal.Section>
            <p className="text-gray-500 text-base">
                Are you sure you want to start over? The draft order and all current picks will be reset.
            </p>
        </Modal.Section>
        <Modal.Footer>
            <Button onClick={() => onClose(true)} primary>
                Reset
            </Button>
            <Button onClick={() => onClose(false)}>
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ResetModal;
