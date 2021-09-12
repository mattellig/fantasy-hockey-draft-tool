import { UploadIcon } from '@heroicons/react/solid';
import Papa from 'papaparse';
import * as React from 'react';
import Button from './components/Button/Button';
import DataSelectModal from './components/DataSelectModal/DataSelectModal';
import DataTable from './components/DataTable/DataTable';
import Spinner from './components/Spinner/Spinner';
import sampleDataUrl from './sample.csv?url';

const headings = [
    { title: 'Name' },
    { title: 'Team', align: 'center' },
    { title: 'Pos', align: 'center' },
    { title: 'ADP', align: 'right' },
    { title: 'GP', align: 'right' },
    { title: 'TOI', align: 'right' },
    { title: 'G', align: 'right' },
    { title: 'A', align: 'right' },
    { title: 'PTS', align: 'right' },
    { title: '+/-', align: 'right' },
    { title: 'PIM', align: 'right' },
    { title: 'PPG', align: 'right' },
    { title: 'PPP', align: 'right' },
    { title: 'GWG', align: 'right' },
    { title: 'SOG', align: 'right' },
    { title: 'FOW', align: 'right' },
    { title: 'FOL', align: 'right' },
    { title: 'FO%', align: 'right' },
    { title: 'HIT', align: 'right' },
    { title: 'BLK', align: 'right' },
    { title: 'W', align: 'right' },
    { title: 'L', align: 'right' },
    { title: 'OTL', align: 'right' },
    { title: 'GA', align: 'right' },
    { title: 'GAA', align: 'right' },
    { title: 'SV', align: 'right' },
    { title: 'SV%', align: 'right' },
    { title: 'SO', align: 'right' },
];

const App = () => {
    const [data, setData] = React.useState();
    const [dataSource, setDataSource] = React.useState(`${window.location.href}${sampleDataUrl}`);
    const [errors, setErrors] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showDataSelector, setShowDataSelector] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);

        Papa.parse(dataSource, {
            complete: (results) => {
                setErrors(results.errors);

                if (results.errors.length) {
                    setData([]);
                } else {
                    setData(results.data);
                }

                setLoading(false);
            },
            download: typeof dataSource === 'string',
            dynamicTyping: true,
            header: true,
            worker: true,
        });
    }, [dataSource]);

    const handleDataSourceSelected = (dataSource) => {
        setDataSource(dataSource);
        setShowDataSelector(false);
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-end p-6">
                <Button icon={<UploadIcon />} onClick={() => setShowDataSelector(true)}>
                    Upload
                </Button>
            </div>
            {/* {errors.length > 0 ? (
                    <div role="status" className="p-4 bg-red-50 rounded-xl text-sm text-red-600">
                        <p>
                            Sorry, there was an error processing your data. Please make sure your data file
                            matches the structure of the sample file provided.
                        </p>
                    </div>
                ) : null} */}
            <DataTable headings={headings}>
                {loading ? (
                    <DataTable.Row>
                        <DataTable.Cell align="center" colSpan={headings.length}>
                            <div className="flex items-center justify-center gap-2">
                                <div className="text-blue-500">
                                    <Spinner />
                                </div>
                                <div className="text-sm text-gray-500 animate-pulse">
                                    Loading sample data...
                                </div>
                            </div>
                        </DataTable.Cell>
                    </DataTable.Row>
                ) : data?.length ? data.map((row) => (
                    <DataTable.Row key={`${row.Name}-${row.Pos}`}>
                        <DataTable.Cell>
                            {row.Name}
                        </DataTable.Cell>
                        <DataTable.Cell align="center">
                            {row.Team}
                        </DataTable.Cell>
                        <DataTable.Cell align="center">
                            {row.Pos}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.ADP}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.GP}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.TOI}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.G}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.A}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.PTS}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row['+/-']}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.PIM}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.PPG}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.PPP}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.GWG}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.SOG}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.FOW}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.FOL}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row['FO%']}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.HIT}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.BLK}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.W}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.L}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.OTL}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.GA}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.GAA}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.SV}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row['SV%']}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.SO}
                        </DataTable.Cell>
                    </DataTable.Row>
                )) : (
                    <DataTable.Row>
                        <DataTable.Cell align="center" colSpan={headings.length}>
                            <p className="text-sm text-gray-500">
                                No results found.
                            </p>
                        </DataTable.Cell>
                    </DataTable.Row>
                )}
            </DataTable>
            <DataSelectModal
                onCancel={setShowDataSelector}
                onSelect={handleDataSourceSelected}
                open={showDataSelector}
            />
        </div >
    );
};

export default App;
