import * as React from 'react';
import DataTable, { DataTableHeading } from '../../../../components/DataTable/DataTable';
import { PlayerData } from '../../../../hooks/usePlayerData/usePlayerData';

interface PickPredictorProps {
    allPlayers: PlayerData[];
    draftedPlayers: PlayerData[];
    turnsUntilNextPick: number;
}

const adpStrictness = 0.85;

const miniTableHeadings: DataTableHeading[] = [
    { title: 'Name' },
    { title: 'Pos', align: 'center' },
    { title: 'FP', align: 'right' },
    { title: 'VORP', align: 'right' },
];

const PickPredictor = ({ allPlayers, draftedPlayers, turnsUntilNextPick }: PickPredictorProps): JSX.Element => {
    const expectedPicks = React.useMemo(() => {
        return [...allPlayers]
            .filter((pd) => !draftedPlayers.includes(pd))
            .sort((a, b) => (a.averageDraftPosition || 0) - (b.averageDraftPosition || 0))
            .slice(0, Math.round(turnsUntilNextPick * (1 + (1 - adpStrictness))))
            .sort((a, b) => b.valueOverReplacement - a.valueOverReplacement);
    }, [allPlayers, draftedPlayers]);

    return (
        <section className="h-2/5 overflow-y-auto py-4">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                    Expected picks
                </h2>
                <p className="text-xs text-gray-500 italic">
                    by your next turn
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
                    </DataTable.Row>
                ))}
            </DataTable>
        </section>
    );
};

export default PickPredictor;
