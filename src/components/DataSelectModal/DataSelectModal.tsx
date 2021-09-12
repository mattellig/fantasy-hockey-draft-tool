import * as React from 'react';
import Button from '../Button/Button';
import Link from '../Link/Link';
import Modal from '../Modal/Modal';

interface DataSelectModalProps {
    onCancel: (value: boolean) => void;
    onSelect: (dataSource: File | string) => void;
    open: boolean;
}

const DataSelectModal = ({ onCancel, onSelect, open }: DataSelectModalProps): JSX.Element => {
    const fileInput = React.useRef<HTMLInputElement>(null);

    const handleInput = () => {
        if (!fileInput.current) return;

        fileInput.current.setCustomValidity('');

        const file = fileInput.current.files?.[0];
        if (!file) {
            return;
        }

        const extension = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) || file.name;
        if (extension !== 'csv') {
            fileInput.current.setCustomValidity('Please select a .csv file.');
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (fileInput.current && fileInput.current.files) {
            onSelect(fileInput.current.files[0]);
        }
    };

    return (
        <Modal
            onClose={onCancel}
            open={open}
            title="Upload projection data"
        >
            <form onSubmit={handleSubmit}>
                <Modal.Section>
                    <ol className="list-decimal list-inside">
                        <li>
                            <Link url="/sample.csv">
                                Download the sample.csv file
                            </Link>
                        </li>
                        <li>
                            Get projection data from your favorite source (e.g. ESPN, Yahoo, etc.)
                        </li>
                        <li>
                            Replace the sample data with your projections
                        </li>
                        <li>
                            Upload the file here
                        </li>
                    </ol>
                </Modal.Section>
                <Modal.Section>
                    <div>
                        <label htmlFor="file-input" className="sr-only">
                            Projection data
                        </label>
                        <input
                            accept="text/csv"
                            id="file-input"
                            onInput={handleInput}
                            ref={fileInput}
                            required
                            type="file"
                            className="w-full rounded-sm focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                </Modal.Section>
                <Modal.Footer>
                    <Button primary submit>
                        Load data
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default DataSelectModal;
