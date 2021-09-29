import * as React from 'react';
import DataTable, { DataTableHeading } from '../../../../components/DataTable/DataTable';
import { useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import { PlayerData } from '../../../../hooks/usePlayerData/usePlayerData';
import sortByStatistic from '../../../../utils/sortByStatistic/sortByStatistic';

interface PickPredictorProps {
    allPlayers: PlayerData[];
    draftedPlayers: PlayerData[];
}

const miniTableHeadings: DataTableHeading[] = [
    { title: 'Name' },
    { title: 'Pos', align: 'center' },
    { title: 'FP', align: 'right' },
    { title: 'VORP', align: 'right' },
    { title: 'ADP', align: 'right' },
];

const PickPredictor = ({ allPlayers, draftedPlayers }: PickPredictorProps): JSX.Element => {
    const [settings] = useSettings();

    const numberOfPicksToShow = Math.round(settings.teams.length * 2.5);

    const expectedPicks = React.useMemo(() => {
        return [...allPlayers]
            .filter((pd) => !draftedPlayers.includes(pd))
            .sort((a, b) => sortByStatistic(a.averageDraftPosition, b.averageDraftPosition, true))
            .slice(0, numberOfPicksToShow)
            .sort((a, b) => b.valueOverReplacement - a.valueOverReplacement);
    }, [allPlayers, draftedPlayers, settings]);

    return (
        <section className="h-2/5 overflow-y-auto py-4">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                    Expected picks
                </h2>
                <p className="text-xs text-gray-500 italic">
                    in the next {numberOfPicksToShow} turns, ordered by VORP
                </p>
            </div>
            <DataTable
                headings={miniTableHeadings}
                initialSortColumnIndex={3}
                initialSortDirection="descending"
            >
                {expectedPicks.map((pd, index) => (
                    <DataTable.Row key={`${pd.name}-${index}`}>
                        <DataTable.Cell>
                            {pd.name}
                        </DataTable.Cell>
                        <DataTable.Cell align="center">
                            {pd.position}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {pd.fantasyPoints.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {pd.valueOverReplacement.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {pd.averageDraftPosition?.toFixed(1)}
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </section>
    );
};

export default PickPredictor;
