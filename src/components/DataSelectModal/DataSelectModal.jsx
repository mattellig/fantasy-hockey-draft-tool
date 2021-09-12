import PropTypes from 'prop-types';
import * as React from 'react';
import Button from '../Button/Button';
import Link from '../Link/Link';
import Modal from '../Modal/Modal';

const DataSelectModal = ({ onCancel, onSelect, open }) => {
    const fileInput = React.useRef(null);

    const handleInput = () => {
        fileInput.current.setCustomValidity('');

        const file = fileInput.current.files[0];
        if (!file) {
            return;
        }

        const extension = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) || file.name;
        if (extension !== 'csv') {
            fileInput.current.setCustomValidity('Please select a .csv file.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSelect(fileInput.current.files[0]);
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

DataSelectModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    open: PropTypes.bool,
};

export default DataSelectModal;
