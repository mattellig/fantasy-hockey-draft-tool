import { CogIcon, UploadIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Button from './components/Button/Button';
import DataSelectModal from './components/DataSelectModal/DataSelectModal';
import PlayersTable from './components/PlayersTable/PlayersTable';
import SettingsModal from './components/SettingsModal/SettingsModal';
import usePlayerData from './hooks/usePlayerData/usePlayerData';

const App = (): JSX.Element => {
    const [showDataSelector, setShowDataSelector] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);

    const {
        data,
        errors,
        loadingMessage,
        setDataSource,
    } = usePlayerData();

    const handleDataSourceSelected = (dataSource: File | string) => {
        setDataSource(dataSource);
        setShowDataSelector(false);
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-end p-6 space-x-2">
                <Button icon={<UploadIcon />} onClick={() => setShowDataSelector(true)}>
                    Upload
                </Button>
                <Button icon={<CogIcon />} onClick={() => setShowSettings(true)}>
                    Settings
                </Button>
            </div>
            {errors.length > 0 ? (
                <div role="status" className="p-4 bg-red-50 rounded-xl text-sm text-red-600">
                    <p>
                        Sorry, there was an error processing your data. Please make sure your data file
                        matches the structure of the sample file provided.
                    </p>
                </div>
            ) : null}
            <PlayersTable data={data} loadingMessage={loadingMessage} />
            <DataSelectModal
                onCancel={setShowDataSelector}
                onSelect={handleDataSourceSelected}
                open={showDataSelector}
            />
            <SettingsModal onClose={setShowSettings} open={showSettings} />
        </div >
    );
};

export default App;
