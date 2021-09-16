import * as React from 'react';
import { ScoringSettings, useSettings } from '../../contexts/SettingsContext/SettingsContext';
import { PlayerData, PlayerStats } from '../../hooks/usePlayerData/usePlayerData';
import DataTable, { DataTableHeading } from '../DataTable/DataTable';
import Spinner from '../Spinner/Spinner';

interface PlayersTableProps {
    data: PlayerData[] | undefined;
    loadingMessage: string | undefined;
}

const settingsToAcronymMap: Record<keyof ScoringSettings, string> = {
    goals: 'G',
    assists: 'A',
    points: 'PTS',
    plusMinus: '+/-',
    penaltyMinutes: 'PIM',
    powerplayGoals: 'PPG',
    powerplayAssists: 'PPA',
    powerplayPoints: 'PPP',
    gameWinningGoals: 'GWG',
    shotsOnGoal: 'SOG',
    faceoffsWon: 'FOW',
    faceoffsLost: 'FOL',
    hits: 'HIT',
    blocks: 'BLK',
    wins: 'W',
    losses: 'L',
    goalsAgainst: 'GA',
    goalsAgainstAverage: 'GAA',
    saves: 'SV',
    savePercentage: 'SV%',
    shutouts: 'SO',
};

const fixedHeadings: DataTableHeading[] = [
    { title: 'Name' },
    { title: 'Team', align: 'center' },
    { title: 'Pos', align: 'center' },
    { title: 'FP', align: 'right' },
    { title: 'ADP', align: 'right' },
    { title: 'GP', align: 'right' },
];

const formatStat = (value: number | null, key: keyof ScoringSettings) => {
    if (value === null) {
        return null;
    }

    switch (key) {
        case 'goalsAgainstAverage':
            return value.toFixed(2);
        case 'savePercentage':
            return value.toFixed(3);
        default:
            return value.toFixed(0);
    }
};

const PlayersTable = ({ data, loadingMessage }: PlayersTableProps): JSX.Element => {
    const [settings] = useSettings();

    const scoringSettingEntries = React.useMemo(() => Object.entries(settings.scoring), [settings]);

    const tableHeadings = React.useMemo(() => {
        const headings = [...fixedHeadings];

        for (const [key, value] of scoringSettingEntries) {
            if (value) {
                headings.push({
                    title: settingsToAcronymMap[key as keyof ScoringSettings],
                    align: 'right',
                });
            }
        }

        return headings;
    }, [scoringSettingEntries]);

    return (
        <DataTable headings={tableHeadings}>
            {loadingMessage ? (
                <DataTable.Row>
                    <DataTable.Cell align="center" colSpan={tableHeadings.length}>
                        <div className="flex items-center justify-center gap-2">
                            <div className="text-blue-500">
                                <Spinner />
                            </div>
                            <div className="text-sm text-gray-500 animate-pulse">
                                {loadingMessage}...
                            </div>
                        </div>
                    </DataTable.Cell>
                </DataTable.Row>
            ) : data?.length ? data.map((row) => (
                <DataTable.Row key={`${row.name}-${row.position}`}>
                    <DataTable.Cell>
                        {row.name}
                    </DataTable.Cell>
                    <DataTable.Cell align="center">
                        {row.team}
                    </DataTable.Cell>
                    <DataTable.Cell align="center">
                        {row.position}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.fantasyPoints.toFixed(1)}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.averageDraftPosition?.toFixed(1)}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.gamesPlayed}
                    </DataTable.Cell>
                    {scoringSettingEntries.map(([key, value]) => value ? (
                        <DataTable.Cell key={key} align="right">
                            {formatStat(row.totals[key as keyof PlayerStats], key as keyof ScoringSettings)}
                        </DataTable.Cell>
                    ) : null)}
                </DataTable.Row>
            )) : (
                <DataTable.Row>
                    <DataTable.Cell align="center" colSpan={tableHeadings.length}>
                        <p className="text-sm text-gray-500">
                            No results found.
                        </p>
                    </DataTable.Cell>
                </DataTable.Row>
            )}
        </DataTable>
    );
};

export default PlayersTable;
