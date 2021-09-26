import { DownloadIcon } from '@heroicons/react/solid';
import { ParseError } from 'papaparse';
import * as React from 'react';
import Button from '../../../../components/Button/Button';
import Link from '../../../../components/Link/Link';
import RadioButton from '../../../../components/RadioButton/RadioButton';
import Select from '../../../../components/Select/Select';
import { toast } from '../../../../components/Toast/Toast';
import { useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import { RawPlayerData } from '../../../../hooks/usePlayerData/usePlayerData';
import parseDataFile from '../../../../utils/parseDataFile/parseDataFile';

const customData = 'custom';
const formatOptions = ['Totals', 'Per-game'];
const sampleDataPath = '/sample.csv';

const Data = (): JSX.Element => {
    const [settings, setSettings] = useSettings();

    const savedSourceIsFile = typeof settings.data.source !== 'string';

    const [dataFile, setDataFile] = React.useState<File | undefined>(savedSourceIsFile ? (settings.data.source as File) : undefined);
    const [dataSource, setDataSource] = React.useState(savedSourceIsFile ? customData : sampleDataPath);
    const [format, setFormat] = React.useState(settings.data.isTotal ? 'Total' : 'Per-game');
    const [isParsing, setIsParsing] = React.useState(false);
    const [parseError, setParseError] = React.useState(false);
    const [showFileInput, setShowFileInput] = React.useState(false);

    const fileInput = React.useRef<HTMLInputElement>(null);

    const saveForm = () => {
        setSettings({
            ...settings,
            data: {
                isTotal: format === 'Total',
                source: dataSource === customData
                    ? dataFile!
                    : sampleDataPath,
            },
        });

        setShowFileInput(false);

        toast.success('Data source updated');
    };

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

    const handleParse = (_data: RawPlayerData[], errors: ParseError[]) => {
        setIsParsing(false);

        if (errors.length > 0) {
            setParseError(true);
        } else {
            setParseError(false);
            saveForm();
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (dataSource === customData) {
            setIsParsing(true);
            parseDataFile<RawPlayerData>(dataFile!, handleParse);
        } else {
            saveForm();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h1 className="text-2xl font-medium text-gray-800">
                    Data
                </h1>
                <p className="mt-1 text-base text-gray-500">
                    Upload custom projections to replace the sample data.
                </p>
            </div>
            {parseError ? (
                <div role="status" className="p-4 mb-4 bg-red-50 rounded-xl text-sm text-red-600">
                    <p>
                        Sorry, there was an error processing your data. Please make sure your data file
                        matches the structure of the sample file provided.
                    </p>
                </div>
            ) : null}
            <div className="mb-6">
                <div className="flex items-center space-x-2">
                    <DownloadIcon className="h-5 w-5 text-blue-600" />
                    <Link href={sampleDataPath}>
                        Download sample.csv
                    </Link>
                </div>
            </div>
            <fieldset className="mb-6">
                <legend className="block mb-1 text-sm font-medium text-gray-700">
                    Source
                </legend>
                <ul className="space-y-2">
                    <li>
                        <RadioButton
                            checked={dataSource === sampleDataPath}
                            helpText="The sample data is intended for previewing the tool only."
                            id="sample-data-radio"
                            label="Use sample data"
                            name="data-source"
                            onChange={() => setDataSource(sampleDataPath)}
                        />
                    </li>
                    <li>
                        <RadioButton
                            checked={dataSource === customData}
                            helpText="Use your own projection data from your favorite source (e.g. ESPN, Yahoo, etc.)."
                            id="custom-data-radio"
                            label="Upload custom data (Recommended)"
                            name="data-source"
                            onChange={() => setDataSource(customData)}
                        />
                    </li>
                </ul>
            </fieldset>
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-6">
                    {savedSourceIsFile && !showFileInput ? (
                        <>
                            <div className="block mb-1 text-sm font-medium text-gray-700">
                                Data file
                            </div>
                            <div className="flex space-x-2 mt-3">
                                <div className="truncate">
                                    {dataFile!.name}
                                </div>
                                <div className="flex-shrink-0">
                                    <Button link onClick={() => setShowFileInput(true)}>
                                        Change
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <label htmlFor="data-file-input" className="block mb-1 text-sm font-medium text-gray-700">
                                Data file
                            </label>
                            <input
                                ref={fileInput}
                                accept="text/csv"
                                className="mt-1 disabled:opacity-50"
                                disabled={dataSource === sampleDataPath}
                                id="data-file-input"
                                onChange={(e) => setDataFile(e.target.files?.[0])}
                                onInput={handleInput}
                                required
                                type="file"
                            />
                        </>
                    )}
                </div>
                <div className="col-span-2">
                    <Select
                        disabled={dataSource === sampleDataPath}
                        id="format-select"
                        label="Format"
                        onChange={(value) => setFormat(value)}
                        options={formatOptions}
                        value={format}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button loading={isParsing} primary submit>
                    Save changes
                </Button>
            </div>
        </form>
    );
};

export default Data;
